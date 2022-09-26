# 13-InnoDB统计数据是如何收集的

通过`SHOW TABLE STATUS LIKE 表名`可以看到关于表的统计数据。  
通过`SHOW INDEX FROM 表名`可以看到关于索引的统计数据。  
本章介绍InnoDB存储引擎的统计数据收集策略，看完就会明白为啥InnoDB的统计信息是不精确的估计值了。

## 13.1 统计数据的存储方式

InnoDB提供了两种存储统计数据的方式：
- 永久性的统计数据 - 这种统计数据存储在磁盘上。
- 非永久性的统计数据 - 这种统计数据存储在内存中。

系统变量`innodb_stats_persistent`控制默认采用哪种方式去存储统计数据。  
MySQL 5.6.6之前，`innodb_stats_persistent`的值默认是`OFF`，存储到内存。  
MySQL 5.6.6之后，`innodb_stats_persistent`的值默认是`ON`， 存储到磁盘。

InnoDB默认以表为单位来收集和存储统计数据，可以在创建和修改表的时候通过指定`STATS_PERSISTENT`属性来指明该表的统计数据存储方式：

    CREATE TABLE 表名 (...) Engine=InnoDB, STATS_PERSISTENT = (1|0);
    ALTER TABLE 表名 Engine=InnoDB, STATS_PERSISTENT = (1|0);

STATS_PERSISTENT=1时，表的统计数据存储到磁盘。  
STATS_PERSISTENT=0时，表的统计数据存储到内存。  
如果不指定STATS_PERSISTENT属性，那默认采用系统变量`innodb_stats_persistent`的值作为该属性的值。

## 13.2 基于磁盘的永久性统计数据

选择把某个表以及该表索引的统计数据存放到磁盘上时，实际上是把统计数据存储到了两个表里：

    mysql> SHOW TABLES FROM mysql LIKE 'innodb%';
    +---------------------------+
    | Tables_in_mysql (innodb%) |
    +---------------------------+
    | innodb_index_stats        |
    | innodb_table_stats        |
    +---------------------------+

这两个表位于`mysql`系统数据库下边，其中：
- `innodb_table_stats`存储了关于表的统计数据，每一条记录对应着一个表的统计数据。
- `innodb_index_stats`存储了关于索引的统计数据，每一条记录对应着一个索引的一个统计项的统计数据。

### 13.2.1 innodb_table_stats

    mysql> desc mysql.innodb_table_stats;
    +--------------------------+---------------------+------+-----+-------------------+-----------------------------+
    | Field                    | Type                | Null | Key | Default           | Extra                       |
    +--------------------------+---------------------+------+-----+-------------------+-----------------------------+
    | database_name            | varchar(64)         | NO   | PRI | NULL              |                             |
    | table_name               | varchar(199)        | NO   | PRI | NULL              |                             |
    | last_update              | timestamp           | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
    | n_rows                   | bigint(20) unsigned | NO   |     | NULL              |                             |
    | clustered_index_size     | bigint(20) unsigned | NO   |     | NULL              |                             |
    | sum_of_other_index_sizes | bigint(20) unsigned | NO   |     | NULL              |                             |
    +--------------------------+---------------------+------+-----+-------------------+-----------------------------+

各列含义：

| 字段名	                | 描述              |
| ------------------------ | ----------------- |
| database_name            | 数据库名 |
| table_name               | 表名 |
| last_update              | 本条记录最后更新时间 |
| n_rows                   | 表中记录的条数（估计值） |
| clustered_index_size     | 表的聚簇索引占用的页面数量（估计值） |
| sum_of_other_index_sizes | 表的其他索引占用的页面数量（估计值） |

**n_rows统计项的收集**

按照一定算法选取几个叶子节点页面，计算每个页面中主键值记录数量，然后计算平均一个页面中主键值的记录数量乘以全部叶子节点的数量就算是该表的`n_rows`值。

系统变量`innodb_stats_persistent_sample_pages`控制使用永久性的统计数据时，计算统计数据时采样的页面数量，默认值是20。

也可以单独设置某个表的采样页面的数量：

    CREATE TABLE 表名 (...) Engine=InnoDB, STATS_SAMPLE_PAGES = 具体的采样页面数量;
    ALTER TABLE 表名 Engine=InnoDB, STATS_SAMPLE_PAGES = 具体的采样页面数量;

不指定`STATS_SAMPLE_PAGES`属性将默认使用系统变量`innodb_stats_persistent_sample_pages`的值作为该属性的值。

**clustered_index_size和sum_of_other_index_sizes统计项的收集**

统计这两个数据需要用到InnoDB表空间的知识。
- 从数据字典里找到表的各个索引对应的根页面位置。
- 从根页面的`Page Header`里找到叶子节点段和非叶子节点段对应的`Segment Header`。
- 从叶子节点段和非叶子节点段的`Segment Header`中找到这两个段对应的`INODE Entry`结构。
- 从对应的`INODE Entry`结构中可以找到该段对应所有零散的页面地址以及`FREE`、`NOT_FULL`、`FULL`链表的基节点。
- 直接统计零散的页面有多少个，然后从那三个链表的`List Length`字段中读出该段占用的区的大小，每个区占用64个页，所以就可以统计出整个段占用的页面。
- 分别计算聚簇索引的叶子结点段和非叶子节点段占用的页面数，它们的和就是`clustered_index_size`的值，按照同样的方法把其余索引占用的页面数都算出来，加起来之后就是`sum_of_other_index_sizes`的值。

提示：  
表空间以区为单位申请空间，有一些区中有一些页可能并没有使用，但是在统计`clustered_index_size`和`sum_of_other_index_sizes`时都把它们算进去了，所以说聚簇索引和其他的索引占用的页面数可能比这两个值要小一些。

### 13.2.2 innodb_index_stats

    mysql> desc mysql.innodb_index_stats;
    +------------------+---------------------+------+-----+-------------------+-----------------------------+
    | Field            | Type                | Null | Key | Default           | Extra                       |
    +------------------+---------------------+------+-----+-------------------+-----------------------------+
    | database_name    | varchar(64)         | NO   | PRI | NULL              |                             |
    | table_name       | varchar(199)        | NO   | PRI | NULL              |                             |
    | index_name       | varchar(64)         | NO   | PRI | NULL              |                             |
    | last_update      | timestamp           | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
    | stat_name        | varchar(64)         | NO   | PRI | NULL              |                             |
    | stat_value       | bigint(20) unsigned | NO   |     | NULL              |                             |
    | sample_size      | bigint(20) unsigned | YES  |     | NULL              |                             |
    | stat_description | varchar(1024)       | NO   |     | NULL              |                             |
    +------------------+---------------------+------+-----+-------------------+-----------------------------+

各列含义：

| 字段名	        | 描述              |
| ---------------- | ----------------- |
| database_name    | 数据库名 |
| table_name       | 表名 |
| index_name       | 索引名 |
| last_update      | 本条记录最后更新时间 |
| stat_name        | 统计项的名称 |
| stat_value       | 对应的统计项的值 |
| sample_size      | 为生成统计数据而采样的页面数量 |
| stat_description | 对应的统计项的描述 |

`single_table`表索引统计数据：

    mysql> SELECT * FROM mysql.innodb_index_stats WHERE database_name = 'temp' AND table_name = 'single_table';
    +---------------+--------------+--------------+---------------------+--------------+------------+-------------+-----------------------------------+
    | database_name | table_name   | index_name   | last_update         | stat_name    | stat_value | sample_size | stat_description                  |
    +---------------+--------------+--------------+---------------------+--------------+------------+-------------+-----------------------------------+
    | temp          | single_table | PRIMARY      | 2022-05-07 14:21:15 | n_diff_pfx01 |       9950 |          20 | id                                |
    | temp          | single_table | PRIMARY      | 2022-05-07 14:21:15 | n_leaf_pages |         59 |        NULL | Number of leaf pages in the index |
    | temp          | single_table | PRIMARY      | 2022-05-07 14:21:15 | size         |         97 |        NULL | Number of pages in the index      |
    | temp          | single_table | idx_key1     | 2022-05-07 14:21:15 | n_diff_pfx01 |      10051 |          13 | key1                              |
    | temp          | single_table | idx_key1     | 2022-05-07 14:21:15 | n_diff_pfx02 |      10051 |          13 | key1,id                           |
    | temp          | single_table | idx_key1     | 2022-05-07 14:21:15 | n_leaf_pages |         13 |        NULL | Number of leaf pages in the index |
    | temp          | single_table | idx_key1     | 2022-05-07 14:21:15 | size         |         14 |        NULL | Number of pages in the index      |
    | temp          | single_table | idx_key2     | 2022-05-07 14:21:15 | n_diff_pfx01 |      10051 |          10 | key2                              |
    | temp          | single_table | idx_key2     | 2022-05-07 14:21:15 | n_leaf_pages |         10 |        NULL | Number of leaf pages in the index |
    | temp          | single_table | idx_key2     | 2022-05-07 14:21:15 | size         |         11 |        NULL | Number of pages in the index      |
    | temp          | single_table | idx_key3     | 2022-05-07 14:21:15 | n_diff_pfx01 |      10051 |          13 | key3                              |
    | temp          | single_table | idx_key3     | 2022-05-07 14:21:15 | n_diff_pfx02 |      10051 |          13 | key3,id                           |
    | temp          | single_table | idx_key3     | 2022-05-07 14:21:15 | n_leaf_pages |         13 |        NULL | Number of leaf pages in the index |
    | temp          | single_table | idx_key3     | 2022-05-07 14:21:15 | size         |         14 |        NULL | Number of pages in the index      |
    | temp          | single_table | idx_key_part | 2022-05-07 14:21:15 | n_diff_pfx01 |      10051 |          26 | key_part1                         |
    | temp          | single_table | idx_key_part | 2022-05-07 14:21:15 | n_diff_pfx02 |      10051 |          26 | key_part1,key_part2               |
    | temp          | single_table | idx_key_part | 2022-05-07 14:21:15 | n_diff_pfx03 |      10051 |          26 | key_part1,key_part2,key_part3     |
    | temp          | single_table | idx_key_part | 2022-05-07 14:21:15 | n_diff_pfx04 |      10051 |          26 | key_part1,key_part2,key_part3,id  |
    | temp          | single_table | idx_key_part | 2022-05-07 14:21:15 | n_leaf_pages |         26 |        NULL | Number of leaf pages in the index |
    | temp          | single_table | idx_key_part | 2022-05-07 14:21:15 | size         |         27 |        NULL | Number of pages in the index      |
    +---------------+--------------+--------------+---------------------+--------------+------------+-------------+-----------------------------------+

索引统计项：
- size：表示该索引共占用多少页面。
- n_leaf_pages：表示该索引的叶子节点占用多少页面。
- n_diff_pfxNN：表示对应的索引列不重复的值有多少。其实NN可以为01、02、03等数字。比如对于idx_key_part来说：
  - n_diff_pfx01表示的是统计key_part1这个列不重复的值有多少。
  - n_diff_pfx02表示的是统计key_part1、key_part2这两个列组合起来不重复的值有多少。
  - n_diff_pfx03表示的是统计key_part1、key_part2、key_part3这三个列组合起来不重复的值有多少。
  - n_diff_pfx04表示的是统计key_part1、key_part2、key_part3、id这四个列组合起来不重复的值有多少。

提示：  
对于普通的二级索引，并不能保证它的索引列值是唯一的，此时只有在索引列上加上主键值才可以区分两条索引列值都一样的二级索引记录。  
对于主键和唯一二级索引则没有这个问题，它们本身就可以保证索引列值的不重复，所以也不需要再统计一遍在索引列后加上主键值的不重复值有多少。

在计算某些索引列中包含多少不重复值时，需要对一些叶子节点页面进行采样，`sample_size`列表明采样的页面数量。

提示：  
对于有多个列的联合索引来说，采样的页面数量是：`innodb_stats_persistent_sample_pages` × 索引列的个数。  
当需要采样的页面数量大于该索引的叶子节点数量的话，就直接采用全表扫描来统计索引列的不重复值数量了。  
所以大家可以在查询结果中看到不同索引对应的`sample_size`列的值可能是不同的。

### 13.2.3 定期更新统计数据

两种更新统计数据的方式：

- 开启`innodb_stats_auto_recalc`。

  系统变量`innodb_stats_auto_recalc`决定服务器是否自动重新计算统计数据，默认是ON，开启的。  
  每个表都维护了一个变量，记录着表进行增删改的记录条数，当发生变动的记录数量超过了表大小的10%，就重新进行一次统计数据的计算，并且更新`innodb_table_stats`和`innodb_index_stats`表。

InnoDB默认以表为单位来收集和存储统计数据，可以单独为某个表设置是否自动重新计算统计数的属性：

    CREATE TABLE 表名 (...) Engine=InnoDB, STATS_AUTO_RECALC = (1|0);
    ALTER TABLE 表名 Engine=InnoDB, STATS_AUTO_RECALC = (1|0);

- 手动调用`ANALYZE TABLE`语句来更新统计信息。

      mysql> ANALYZE TABLE single_table;
      +-------------------+---------+----------+----------+
      | Table             | Op      | Msg_type | Msg_text |
      +-------------------+---------+----------+----------+
      | temp.single_table | analyze | status   | OK       |
      +-------------------+---------+----------+----------+

`ANALYZE TABLE`语句会立即重新计算统计数据，也就是这个过程是同步的，在表中索引多或者采样页面特别多时这个过程可能会特别慢，最好在业务不是很繁忙的时候再运行。

### 13.2.4 手动更新innodb_table_stats和innodb_index_stats表

- 步骤一：更新innodb_table_stats表。

      UPDATE innodb_table_stats SET n_rows = 1 WHERE table_name = 'single_table';

- 步骤二：查询优化器重新加载更改过的数据。

      FLUSH TABLE single_table;

使用`SHOW TABLE STATUS`语句查看表的统计数据，Rows变为了1：

    mysql> SHOW TABLE STATUS like 'single_table'\G
    *************************** 1. row ***************************
               Name: single_table
             Engine: InnoDB
            Version: 10
         Row_format: Dynamic
               Rows: 1
     Avg_row_length: 1589248
        Data_length: 1589248
    Max_data_length: 0
       Index_length: 1081344
          Data_free: 4194304
     Auto_increment: 10052
        Create_time: 2022-05-07 12:32:05
        Update_time: 2022-05-07 14:21:07
         Check_time: NULL
          Collation: utf8_general_ci
           Checksum: NULL
     Create_options:
            Comment:

## 13.3 基于内存的非永久性统计数据

与永久性的统计数据不同，非永久性的统计数据采样的页面数量是由`innodb_stats_transient_sample_pages`控制的，这个系统变量的默认值是8。

由于非永久性的统计数据经常更新，所以查询优化器计算查询成本的时候依赖的是经常变化的统计数据，也就会生成经常变化的执行计划。

## 13.4 innodb_stats_method的使用

索引列不重复的值的数量这个统计数据对于MySQL查询优化器十分重要，通过它可以计算出在索引列中平均一个值重复多少行，它的应用场景主要有两个：
- 单表查询中单点区间太多，比如当IN里的参数数量过多时，采用`index dive`的方式直接访问B+树索引去统计每个单点区间对应的记录的数量就太耗费性能了，所以直接依赖统计数据中的平均一个值重复多少行来计算单点区间对应的记录数量。
- 连接查询时，如果有涉及两个表的等值匹配连接条件，该连接条件对应的被驱动表中的列又拥有索引时，则可以使用ref访问方法来对被驱动表进行查询，在真正执行对被驱动表的查询前，驱动表的列值是不确定的，不能通过`index dive`的方式直接访问B+树索引去统计每个单点区间对应的记录的数量，所以也只能依赖统计数据中的平均一个值重复多少行来计算单点区间对应的记录数量。

在统计索引列不重复的值的数量时，`NULL`值怎么处理?

MySQL提供了一个名为`innodb_stats_method`的系统变量，指定在计算某个索引列不重复值的数量时如何对待`NULL`值，有三个候选值：

- `nulls_equal`：认为所有`NULL`值都是相等的。这个值也是`innodb_stats_method`的默认值。

  如果某个索引列中`NULL`值特别多的话，这种统计方式会让优化器认为某个列中平均一个值重复次数特别多，所以倾向于不使用索引进行访问。

- `nulls_unequal`：认为所有`NULL`值都是不相等的。

  如果某个索引列中`NULL`值特别多的话，这种统计方式会让优化器认为某个列中平均一个值重复次数特别少，所以倾向于使用索引进行访问。

- `nulls_ignored`：直接把`NULL`值忽略掉。

所以最好不在索引列中存放`NULL`值才是正解。

## 13.5 总结

- InnoDB以表为单位来收集统计数据，这些统计数据可以是基于磁盘的永久性统计数据，也可以是基于内存的非永久性统计数据。

- `innodb_stats_persistent`控制着使用永久性统计数据还是非永久性统计数据。
- `innodb_stats_persistent_sample_pages`控制着永久性统计数据的采样页面数量。
- `innodb_stats_transient_sample_pages`控制着非永久性统计数据的采样页面数量。
- `innodb_stats_auto_recalc`控制着是否自动重新计算统计数据。

- 可以针对某个具体的表，在创建和修改表时通过指定`STATS_PERSISTENT`、`STATS_AUTO_RECALC`、`STATS_SAMPLE_PAGES`的值来控制相关统计数据属性。

- `innodb_stats_method`决定着在统计某个索引列不重复值的数量时如何对待`NULL`值。

# 完