# 18-为什么这些SQL语句逻辑相同，性能却差异巨大

## 案例一：条件字段函数操作

对字段做了`函数`计算，就用不上索引了。

```sql
CREATE TABLE t (
    id int(11) NOT NULL AUTO_INCREMENT,
    a int(11) DEFAULT NULL,
    b int(11) DEFAULT NULL,
    birthday datetime DEFAULT NULL,
    PRIMARY KEY (id),
    KEY a (a),
    KEY b (b),
    KEY idx_birthday (birthday)
) ENGINE=InnoDB;
```

全表扫描：

    mysql> EXPLAIN SELECT * FROM t WHERE MONTH(birthday) = 7;
    +----+-------------+-------+------------+------+---------------+------+---------+------+-------+----------+-------------+
    | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
    +----+-------------+-------+------------+------+---------------+------+---------+------+-------+----------+-------------+
    |  1 | SIMPLE      | t     | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 99587 |   100.00 | Using where |
    +----+-------------+-------+------------+------+---------------+------+---------+------+-------+----------+-------------+

使用索引：

    mysql> EXPLAIN SELECT * FROM t WHERE birthday > '2025-07-01' AND birthday < '2025-08-01';
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+------+----------+-----------------------+
    | id | select_type | table | partitions | type  | possible_keys | key          | key_len | ref  | rows | filtered | Extra                 |
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+------+----------+-----------------------+
    |  1 | SIMPLE      | t     | NULL       | range | idx_birthday  | idx_birthday | 6       | NULL | 1000 |   100.00 | Using index condition |
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+------+----------+-----------------------+

全索引扫描：  
这里其实也没有真正的使用索引，只是因为遍历这个索引也可以达到计算数量的目的，并且二级索引比聚簇索引占用空间小，整个遍历过程`IO`较少，所以选择使用二级索引。  
通过 `rows` 字段的扫描行数 `99587` 可以看出是全索引扫描。

    mysql> EXPLAIN SELECT COUNT(*) FROM t WHERE MONTH(birthday) = 7;
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+-------+----------+--------------------------+
    | id | select_type | table | partitions | type  | possible_keys | key          | key_len | ref  | rows  | filtered | Extra                    |
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+-------+----------+--------------------------+
    |  1 | SIMPLE      | t     | NULL       | index | NULL          | idx_birthday | 6       | NULL | 99587 |   100.00 | Using where; Using index |
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+-------+----------+--------------------------+

使用索引：  
这里没有全索引扫描。  
通过 `rows` 字段的扫描行数 `1000` 可以看出。

    mysql> EXPLAIN SELECT COUNT(*) FROM t WHERE birthday > '2025-07-01' AND birthday < '2025-08-01';
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+------+----------+--------------------------+
    | id | select_type | table | partitions | type  | possible_keys | key          | key_len | ref  | rows | filtered | Extra                    |
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+------+----------+--------------------------+
    |  1 | SIMPLE      | t     | NULL       | range | idx_birthday  | idx_birthday | 6       | NULL | 1000 |   100.00 | Using where; Using index |
    +----+-------------+-------+------------+-------+---------------+--------------+---------+------+------+----------+--------------------------+

## 案例二：隐式类型转换

订单表(`utf8mb4`)：

```sql
CREATE TABLE mall_order (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
    order_no varchar(32) NOT NULL COMMENT '订单编号',
    memo varchar(512) DEFAULT NULL COMMENT '订单备注',
    PRIMARY KEY (id) USING BTREE,
    UNIQUE KEY uk_order_no (order_no) USING BTREE COMMENT '订单编号唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

`字符串`字段和`数字`比较，查询没有用到索引：

    mysql> EXPLAIN SELECT * FROM mall_order WHERE order_no = 22051118510590571;
    +----+-------------+------------+------------+------+---------------+------+---------+------+------+----------+-------------+
    | id | select_type | table      | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
    +----+-------------+------------+------------+------+---------------+------+---------+------+------+----------+-------------+
    |  1 | SIMPLE      | mall_order | NULL       | ALL  | uk_order_no   | NULL | NULL    | NULL |  819 |    10.00 | Using where |
    +----+-------------+------------+------------+------+---------------+------+---------+------+------+----------+-------------+

做如下`字符串`和`数字`的比较测试：

    mysql> SELECT '10' > 9;
    +----------+
    | '10' > 9 |
    +----------+
    |        1 |
    +----------+

结果是 `1`，说明`字符串`和`数字`比较，是将`字符串`转换成`数字`。

那么上面的 `SQL` 语句就相当于：

    mysql> EXPLAIN SELECT * FROM mall_order WHERE CAST(order_no AS UNSIGNED INT) = 22051118510590571;
    +----+-------------+------------+------------+------+---------------+------+---------+------+------+----------+-------------+
    | id | select_type | table      | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
    +----+-------------+------------+------------+------+---------------+------+---------+------+------+----------+-------------+
    |  1 | SIMPLE      | mall_order | NULL       | ALL  | NULL          | NULL | NULL    | NULL |  819 |   100.00 | Using where |
    +----+-------------+------------+------------+------+---------------+------+---------+------+------+----------+-------------+

这就相当于对索引字段做函数操作，所以没有用到索引。

## 案例三：隐式字符编码转换

订单商品子表(`utf8`)：

```sql
CREATE TABLE mall_order_product (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
    order_no varchar(32) NOT NULL COMMENT '订单编号',
    product_name varchar(256) NOT NULL COMMENT '商品名称',
    PRIMARY KEY (id) USING BTREE,
    KEY idx_order_no (order_no) USING BTREE COMMENT '订单编号索引'
) ENGINE=InnoDB AUTO_INCREMENT=975 DEFAULT CHARSET=utf8 COMMENT='订单商品表';
```

下面的连接查询被驱动表 `mall_order_product` 没有用到索引，进行了全表扫描：

    mysql> EXPLAIN SELECT mop.* FROM mall_order mo, mall_order_product mop WHERE mo.order_no = mop.order_no AND mo.id = 300;
    +----+-------------+-------+------------+-------+---------------------+---------+---------+-------+------+----------+-------------+
    | id | select_type | table | partitions | type  | possible_keys       | key     | key_len | ref   | rows | filtered | Extra       |
    +----+-------------+-------+------------+-------+---------------------+---------+---------+-------+------+----------+-------------+
    |  1 | SIMPLE      | mo    | NULL       | const | PRIMARY,uk_order_no | PRIMARY | 8       | const |    1 |   100.00 | NULL        |
    |  1 | SIMPLE      | mop   | NULL       | ALL   | NULL                | NULL    | NULL    | NULL  |  974 |   100.00 | Using where |
    +----+-------------+-------+------------+-------+---------------------+---------+---------+-------+------+----------+-------------+

一般解释：

因为这两个表的`字符集`不同，一个是 `utf8`，一个是 `utf8mb4`，所以做表连接查询的时候用不上`关联字段`的索引。

分析：

查找执行过程中，先取出驱动表 `mall_order` 中的一条记录，再到被驱动表 `mall_order_product` 中查找 `order_no` 等于驱动表该条记录 `order_no` 的所有记录。  
因为被驱动表 `mall_order_product` 是 `utf8` 编码，所以它的索引 `idx_order_no` 中的 `order_no` 字段也是 `utf8` 编码。  
但驱动表 `mall_order` 是 `utf8mb4` 编码，所以从它取出的记录中的 `order_no` 字段也是 `utf8mb4` 编码。  

字符集 `utf8mb4` 是 `utf8` 的超集，所以当这两个类型的字符串做比较的时候，会先把 `utf8` 字符串转成 `utf8mb4` 字符集，再做比较。

那么上面的 `SQL` 语句就相当于：

    mysql> EXPLAIN SELECT mop.* FROM mall_order mo, mall_order_product mop WHERE mo.order_no = CONVERT(mop.order_no USING utf8mb4) AND mo.id = 300;
    +----+-------------+-------+------------+-------+---------------------+---------+---------+-------+------+----------+-------------+
    | id | select_type | table | partitions | type  | possible_keys       | key     | key_len | ref   | rows | filtered | Extra       |
    +----+-------------+-------+------------+-------+---------------------+---------+---------+-------+------+----------+-------------+
    |  1 | SIMPLE      | mo    | NULL       | const | PRIMARY,uk_order_no | PRIMARY | 8       | const |    1 |   100.00 | NULL        |
    |  1 | SIMPLE      | mop   | NULL       | ALL   | NULL                | NULL    | NULL    | NULL  |  974 |   100.00 | Using where |
    +----+-------------+-------+------------+-------+---------------------+---------+---------+-------+------+----------+-------------+

这就相当于对被驱动表的索引字段做函数操作，所以没有用到索引。

现在应该明白了：

**字符集不同只是条件之一，连接过程中要求在被驱动表的索引字段上加函数操作，是直接导致对被驱动表做全表扫描的原因。**

反过来验证一下：

    mysql> EXPLAIN SELECT mo.* FROM mall_order_product mop, mall_order mo WHERE mop.order_no = mo.order_no AND mop.id = 348;
    +----+-------------+-------+------------+-------+---------------+-------------+---------+-------+------+----------+-------+
    | id | select_type | table | partitions | type  | possible_keys | key         | key_len | ref   | rows | filtered | Extra |
    +----+-------------+-------+------------+-------+---------------+-------------+---------+-------+------+----------+-------+
    |  1 | SIMPLE      | mop   | NULL       | const | PRIMARY       | PRIMARY     | 8       | const |    1 |   100.00 | NULL  |
    |  1 | SIMPLE      | mo    | NULL       | const | uk_order_no   | uk_order_no | 130     | const |    1 |   100.00 | NULL  |
    +----+-------------+-------+------------+-------+---------------+-------------+---------+-------+------+----------+-------+

现在驱动表 `mall_order_product` 是 `utf8` 编码，被驱动表 `mall_order` 是 `utf8mb4` 编码，被驱动表用到了索引。

那么上面的 `SQL` 语句就相当于：

    mysql> EXPLAIN SELECT mo.* FROM mall_order_product mop, mall_order mo WHERE CONVERT(mop.order_no USING utf8mb4) = mo.order_no AND mop.id = 348;
    +----+-------------+-------+------------+-------+---------------+-------------+---------+-------+------+----------+-------+
    | id | select_type | table | partitions | type  | possible_keys | key         | key_len | ref   | rows | filtered | Extra |
    +----+-------------+-------+------------+-------+---------------+-------------+---------+-------+------+----------+-------+
    |  1 | SIMPLE      | mop   | NULL       | const | PRIMARY       | PRIMARY     | 8       | const |    1 |   100.00 | NULL  |
    |  1 | SIMPLE      | mo    | NULL       | const | uk_order_no   | uk_order_no | 130     | const |    1 |   100.00 | NULL  |
    +----+-------------+-------+------------+-------+---------------+-------------+---------+-------+------+----------+-------+

这次的函数并不是加在被驱动表的索引字段上的，所以可以使用被驱动表的索引。

针对字符集不同导致无法使用索引，有两种做法：
- 调整字符集一致。
- 手动转换字符集一致。  

      mysql> EXPLAIN SELECT mop.* FROM mall_order mo, mall_order_product mop WHERE CONVERT(mo.order_no USING utf8) = mop.order_no AND mo.id = 300;
      +----+-------------+-------+------------+-------+---------------+--------------+---------+-------+------+----------+-------+
      | id | select_type | table | partitions | type  | possible_keys | key          | key_len | ref   | rows | filtered | Extra |
      +----+-------------+-------+------------+-------+---------------+--------------+---------+-------+------+----------+-------+
      |  1 | SIMPLE      | mo    | NULL       | const | PRIMARY       | PRIMARY      | 8       | const |    1 |   100.00 | NULL  |
      |  1 | SIMPLE      | mop   | NULL       | ref   | idx_order_no  | idx_order_no | 98      | const |    3 |   100.00 | NULL  |
      +----+-------------+-------+------------+-------+---------------+--------------+---------+-------+------+----------+-------+

## 小结

对索引字段做`函数`操作，可能会破坏索引值的`有序性`，因此优化器会放弃使用索引。

第二个例子是`隐式类型转换`。

第三个例子是`隐式字符编码转换`。

都跟第一个例子一样，因为要求在索引字段上做`函数`操作而导致查询没能使用索引。

# 完