# 10-MySQL为什么有时候会选错索引

看一个例子：

    -- 新建表
    CREATE TABLE t (
        id int(11) NOT NULL AUTO_INCREMENT,
        a int(11) DEFAULT NULL,
        b int(11) DEFAULT NULL,
        PRIMARY KEY (id),
        KEY a (a),
        KEY b (b)
    ) ENGINE=InnoDB;

    -- 存储过程
    -- 插入10万行记录：
    -- (1,1,1)，(2,2,2)，(3,3,3) 直到 (100000,100000,100000)
    CREATE PROCEDURE idata()
    BEGIN
        declare i int;
        set i=1;
        while(i<=100000) do
            insert into t values(i, i, i);
            set i=i+1;  
        end while;
    END

    -- 执行
    CALL idata();

## 优化器的逻辑

优化器选择索引的目的，是找到一个最优的执行方案，并用最小的代价去执行语句。

在数据库里面，扫描行数是影响执行代价的因素之一。扫描的行数越少，意味着访问磁盘数据的次数越少，消耗的 CPU 资源越少。

扫描行数并不是唯一的判断标准，优化器还会结合是否使用临时表、是否排序等因素进行综合判断。

**扫描行数的判断**

MySQL 在执行语句之前，并不能精确地知道满足这个条件的记录有多少条，而是根据统计信息来估算记录数。

一个索引上不同的值的个数，称之为`基数`（`cardinality`），基数越大，索引的区分度越好。

通过如下方式查看`索引基数`：

    mysql> SHOW INDEX FROM t;
    +-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
    | Table | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
    +-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
    | t     |          0 | PRIMARY  |            1 | id          | A         |      100256 |     NULL | NULL   |      | BTREE      |         |               |
    | t     |          1 | a        |            1 | a           | A         |      100256 |     NULL | NULL   | YES  | BTREE      |         |               |
    | t     |          1 | b        |            1 | b           | A         |      100256 |     NULL | NULL   | YES  | BTREE      |         |               |
    +-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+

MySQL 通过`采样统计`的方法得到索引的基数。

采样统计的时候，`InnoDB` 默认会选择 `N` 个数据页，统计这些页面上的不同值，得到一个平均值，然后乘以这个索引的页面数，就得到了这个索引的基数。

当变更的数据行数超过 `1/M` 的时候，会自动触发重新做一次索引统计。

由于是采样统计，所以这个基数都是不准的。

随着表的记录更新，索引基数不准的时候可以使用如下方式重新统计索引信息：

    mysql> ANALYZE TABLE t;
    +--------+---------+----------+----------+
    | Table  | Op      | Msg_type | Msg_text |
    +--------+---------+----------+----------+
    | test.t | analyze | status   | OK       |
    +--------+---------+----------+----------+

在实践中，如果发现 `explain` 的结果预估的 `rows` 值跟实际情况差距比较大，可以采用这个方法来处理。

    mysql> EXPLAIN SELECT * FROM t WHERE a BETWEEN 10000 AND 20000;
    +----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+-----------------------+
    | id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows  | filtered | Extra                 |
    +----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+-----------------------+
    |  1 | SIMPLE      | t     | NULL       | range | a             | a    | 5       | NULL | 10001 |   100.00 | Using index condition |
    +----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+-----------------------+


## 索引选择异常和处理

- 第一种方法，采用 `force index` 强行选择一个索引。

  MySQL 会分析出可以使用的索引作为候选项，然后在候选列表中依次判断每个索引需要扫描多少行。  
  如果 `force index` 指定的索引在候选索引列表中，就直接选择这个索引，不再评估其他索引的执行代价。

      mysql> EXPLAIN SELECT * FROM t WHERE a BETWEEN 1 AND 1000 AND b BETWEEN 50000 AND 100000 ORDER BY b LIMIT 1;
      +----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+------------------------------------+
      | id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows  | filtered | Extra                              |
      +----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+------------------------------------+
      |  1 | SIMPLE      | t     | NULL       | range | a,b           | b    | 5       | NULL | 50128 |     1.00 | Using index condition; Using where |
      +----+-------------+-------+------------+-------+---------------+------+---------+------+-------+----------+------------------------------------+
      1 row in set, 1 warning (0.00 sec)
  
      mysql> EXPLAIN SELECT * FROM t FORCE INDEX(a) WHERE a BETWEEN 1 AND 1000 AND b BETWEEN 50000 AND 100000 ORDER BY b LIMIT 1;
      +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+----------------------------------------------------+
      | id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra                                              |
      +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+----------------------------------------------------+
      |  1 | SIMPLE      | t     | NULL       | range | a             | a    | 5       | NULL | 1000 |    11.11 | Using index condition; Using where; Using filesort |
      +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+----------------------------------------------------+
      1 row in set, 1 warning (0.00 sec)

- 第二种方法，可以修改语句引导 `MySQL` 使用期望的索引。

  把 `order by b limit 1` 改成 `order by b,a limit 1` 语义的逻辑是相同的。

      mysql> EXPLAIN SELECT * FROM t WHERE a BETWEEN 1 AND 1000 AND b BETWEEN 50000 AND 100000 ORDER BY b,a LIMIT 1;
      +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+----------------------------------------------------+
      | id | select_type | table | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra                                              |
      +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+----------------------------------------------------+
      |  1 | SIMPLE      | t     | NULL       | range | a,b           | a    | 5       | NULL | 1000 |    50.00 | Using index condition; Using where; Using filesort |
      +----+-------------+-------+------------+-------+---------------+------+---------+------+------+----------+----------------------------------------------------+
      1 row in set, 1 warning (0.00 sec)

  之前优化器选择使用索引 `b` 是因为它认为使用索引 `b` 可以避免排序，所以即使扫描行数多，也判定为代价更小。

  现在 `order by b,a` 这种写法，要求按照 `b,a` 排序，就意味着使用这两个索引都需要排序。  
  因此`扫描行数`成了影响决策的主要条件，于是优化器选了只需要扫描 `1000` 行的索引 `a`。

- 第三种方法，新建一个更合适的索引，来提供给优化器做选择，或删掉误用的索引。

  如果索引 `b` 可能删掉的话，优化器也就能选择到正确的索引。

# 完