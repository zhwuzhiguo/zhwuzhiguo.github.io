# 16-order-by是怎么工作的

假设要查询城市是 `杭州` 的所有人的 `城市`、`姓名`、`年龄`，并且按照 `姓名` 排序返回前 `1000` 行。

```sql
CREATE TABLE t (
    id int(11) NOT NULL,
    city varchar(16) NOT NULL,
    name varchar(16) NOT NULL,
    age int(11) NOT NULL,
    addr varchar(128) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY city (city)
) ENGINE=InnoDB;
```

```sql
select city, name, age from t where city='杭州' order by name limit 1000;
```

## 全字段排序

用 `explain` 命令来看看这个语句的执行情况：

```sql
explain select city, name, age from t where city='杭州' order by name limit 1000;
+----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+---------------------------------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra                                 |
+----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+---------------------------------------+
|  1 | SIMPLE      | t     | NULL       | ref  | city          | city | 66      | const |    1 |   100.00 | Using index condition; Using filesort |
+----+-------------+-------+------------+------+---------------+------+---------+-------+------+----------+---------------------------------------+
```

`Extra` 字段中的 `Using filesort` 表示需要排序。

`MySQL` 会给每个线程分配一块内存用于排序，称为 `sort_buffer`。

参数 `sort_buffer_size` 用于指定 `sort_buffer` 的大小。

这个语句执行流程：
- 初始化 `sort_buffer`，放入 `name`、`city`、`age` 这三个字段。
- 从索引 `city` 找到满足 `city='杭州'` 条件的所有主键 `id`，回表取出 `name`、`city`、`age` 三个字段的值，放入 `sort_buffer` 中。
- 对 `sort_buffer` 中的数据按照字段 `name` 做快速排序。
- 按照排序结果取前 `1000` 行返回给客户端。

这个排序过程是把所有需要返回的字段都取出来放在 `sort_buffer` 中进行排序，称为`全字段排序`。

![sort-all](./img16/sort-all.jpeg)

这个排序动作，可能在内存中完成，也可能需要使用外部排序：
- 如果排序的数据量所需内存小于 `sort_buffer_size`，排序就在内存中完成。
- 如果排序的数据量所需内存大于 `sort_buffer_size`，内存放不下，则不得不利用磁盘临时文件辅助排序。

## rowid 排序

`全字段排序` 有一个问题，如果查询要返回的字段很多的话，那么 `sort_buffer` 里面要放的字段数太多，这样内存里能够同时放下的行数就很少，要分成很多个磁盘临时文件，排序的性能就很差。

所以如果单行很大，`全字段排序` 就效率不够好。

参数 `max_length_for_sort_data` 是专门控制用于排序的行数据的长度的。

如果单行的长度超过这个值，MySQL 就使用 `rowid 排序`。

执行流程：
- 初始化 `sort_buffer`，放入需要排序的字段和主键字段，即 `name`、`id` 两个字段。
- 从索引 `city` 找到满足 `city='杭州'` 条件的所有主键 `id`，回表取出 `name`、`id` 字段的值，放入 `sort_buffer` 中。
- 对 `sort_buffer` 中的数据按照字段 `name` 做快速排序。
- 按照排序结果取前 `1000` 行，并按照 `id` 的值回表取出 `name`、`city`、`age` 三个字段的值返回给客户端。

这个排序过程是把需要排序的字段和主键字段先取出来放在 `sort_buffer` 中进行排序，然后再回表取完整字段，节省了排序内存 `sort_buffer`， 称为`rowid 排序`。

![sort-rowid](./img16/sort-rowid.jpeg)

可见，`rowid 排序` 多执行了一次回表操作。

## 全字段排序 VS rowid 排序

如果 `MySQL` 认为排序内存太小，会影响排序效率，才会采用 `rowid 排序算法`，这样排序过程中一次可以排序更多行，但是需要再次回表。

如果 `MySQL` 认为内存足够大，会优先选择全字段排序，把需要的字段都放到 `sort_buffer` 中，这样排序后就能直接从内存里返回查询结果了。

这体现了 `MySQL` 的一个设计思想：**如果内存够，就要多利用内存，尽量减少磁盘访问。**

对于 `InnoDB` 表来说，`rowid 排序`会要求回表多造成磁盘读，因此不会被优先选择。

通过建立`联合索引`能避免以上的排序操作：

```sql
alter table t add index city_user(city, name);
```

在这个索引里，依然可以定位满足 `city='杭州'` 的记录，并且这些记录是按照 `name` 的值排好序的。


```sql
explain select city, name, age from t where city='杭州' order by name limit 1000;
+----+-------------+-------+------------+------+----------------+-----------+---------+-------+------+----------+-----------------------+
| id | select_type | table | partitions | type | possible_keys  | key       | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+-------+------------+------+----------------+-----------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | t     | NULL       | ref  | city,city_user | city_user | 66      | const |    1 |   100.00 | Using index condition |
+----+-------------+-------+------------+------+----------------+-----------+---------+-------+------+----------+-----------------------+
```

`Extra` 字段中没有 `Using filesort` 了，也就是不需要排序了。


还可以通过`索引覆盖`进一步优化：

```sql
alter table t add index city_user_age(city, name, age);
```

在这个索引里，依然可以定位满足 `city='杭州'` 的记录，并且这些记录是按照 `name` 的值排好序的，而且索引里包含所有需要返回的字段。

这样通过这个索引查询不仅是排好序的，而且不用回表就能获取到所有需要返回的字段。

```sql
explain select city, name, age from t where city='杭州' order by name limit 1000;
+----+-------------+-------+------------+------+------------------------------+---------------+---------+-------+------+----------+--------------------------+
| id | select_type | table | partitions | type | possible_keys                | key           | key_len | ref   | rows | filtered | Extra                    |
+----+-------------+-------+------------+------+------------------------------+---------------+---------+-------+------+----------+--------------------------+
|  1 | SIMPLE      | t     | NULL       | ref  | city,city_user,city_user_age | city_user_age | 66      | const |   50 |   100.00 | Using where; Using index |
+----+-------------+-------+------------+------+------------------------------+---------------+---------+-------+------+----------+--------------------------+
```

`Extra` 字段中的 `Using index` ，表示使用了`覆盖索引`，性能上会快很多。

# 完