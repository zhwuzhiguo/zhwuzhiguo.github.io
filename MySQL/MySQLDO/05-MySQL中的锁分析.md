# 05-MySQL中的锁分析

准备数据：

    -- 创建表
    CREATE TABLE temp (
      id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
      name varchar(256) NOT NULL COMMENT '名称',
      status int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
      telephone varchar(256) NOT NULL DEFAULT '' COMMENT '电话',
      create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id) USING BTREE
    ) ENGINE=InnoDB COMMENT='临时表';
    
    -- 插入三条数据
    insert into temp (name, status, telephone) values ('aaa', 0, '13512345678');
    insert into temp (name, status, telephone) values ('bbb', 0, '13512345678');
    insert into temp (name, status, telephone) values ('ccc', 0, '13512345678');


## 1 锁定表

锁定表：

    -- 会话结束自动解锁
    LOCK TABLES table_name [READ | WRITE];

解锁表：

    UNLOCK TABLES;

列出当前在表缓存中打开的非临时表：

    SHOW OPEN TABLES [{FROM | IN} db_name] [LIKE 'pattern' | WHERE expr]

    -- 示例
    SHOW OPEN TABLES;
    SHOW OPEN TABLES FROM sample LIKE 'temp';
    SHOW OPEN TABLES FROM sample WHERE In_use > 0;
    SHOW OPEN TABLES WHERE In_use > 0;

    -- 实例
    mysql> SHOW OPEN TABLES WHERE In_use > 0;
    +----------+-------+--------+-------------+
    | Database | Table | In_use | Name_locked |
    +----------+-------+--------+-------------+
    | sample   | temp  |      1 |           0 |
    +----------+-------+--------+-------------+

其中：
- `Database` - 数据库名称
- `Table` - 表名
- `In_use` - 表的表锁或锁请求数。
  - `表锁举例`：一个会话获得一个表的 `READ` 锁，则 `In_use` 为 `1`，此时另一个会话也获得这个表的 `READ` 锁，则 `In_use` 为 `2`。
  - `锁请求数举例`：一个会话给一条记录加写锁，`In_use` 为 `0`，此时另一个会话也给这条记录加写锁时阻塞，此时 `In_use` 为 `1`。
- `Name_locked` - 表名是否被锁定，诸如删除或重命名表的操作。

另外：  
会话超时时间由如下俩个变量设置：

    -- 交互会话超时时间(通过MySQL客户端连接的会话)
    -- 8 小时
    mysql> show variables like 'interactive_timeout';
    +---------------------+-------+
    | Variable_name       | Value |
    +---------------------+-------+
    | interactive_timeout | 28800 |
    +---------------------+-------+
    1 row in set (0.00 sec)

    -- 非交互会话超时时间(通过jdbc等程序连接的会话)
    -- 8 小时
    mysql> show variables like 'wait_timeout';
    +---------------+-------+
    | Variable_name | Value |
    +---------------+-------+
    | wait_timeout  | 28800 |
    +---------------+-------+
    1 row in set (0.00 sec)

实例：

步骤一：

- 会话A：

      -- 表加读锁
      mysql> LOCK TABLES temp READ;
      Query OK, 0 rows affected (0.00 sec)
      
      -- 可以读
      mysql> select * from temp;
      +----+------+--------+-------------+---------------------+---------------------+
      | id | name | status | telephone   | create_time         | update_time         |
      +----+------+--------+-------------+---------------------+---------------------+
      |  1 | aaa  |      1 | 13512345678 | 2023-05-31 14:18:48 | 2023-05-31 14:31:38 |
      |  2 | bbb  |      0 | 13512345678 | 2023-05-31 14:18:54 | 2023-05-31 14:18:54 |
      |  3 | ccc  |      0 | 13512345678 | 2023-05-31 14:19:00 | 2023-05-31 14:19:00 |
      +----+------+--------+-------------+---------------------+---------------------+
      3 rows in set (0.00 sec)
      
      -- 拒绝写
      mysql> update temp set status = 1 where id = 1;
      ERROR 1099 (HY000): Table 'temp' was locked with a READ lock and can't be updated
      
      -- 拒绝写
      mysql> insert into temp (name, status, telephone) values ('ddd', 0, '13512345678');
      ERROR 1099 (HY000): Table 'temp' was locked with a READ lock and can't be updated
      
      -- 查看表的锁状态
      -- 此时有一个表锁
      mysql> SHOW OPEN TABLES FROM sample LIKE 'temp';
      +----------+-------+--------+-------------+
      | Database | Table | In_use | Name_locked |
      +----------+-------+--------+-------------+
      | sample   | temp  |      1 |           0 |
      +----------+-------+--------+-------------+
      1 row in set (0.00 sec)

- 会话B：

      -- 表加读锁
      mysql> LOCK TABLES temp READ;
      Query OK, 0 rows affected (0.00 sec)
      
      -- 查看表的锁状态
      -- 此时有俩个表锁
      mysql> SHOW OPEN TABLES FROM sample LIKE 'temp';
      +----------+-------+--------+-------------+
      | Database | Table | In_use | Name_locked |
      +----------+-------+--------+-------------+
      | sample   | temp  |      2 |           0 |
      +----------+-------+--------+-------------+
      1 row in set (0.00 sec)
      
      -- 可以读
      mysql> select * from temp;
      +----+------+--------+-------------+---------------------+---------------------+
      | id | name | status | telephone   | create_time         | update_time         |
      +----+------+--------+-------------+---------------------+---------------------+
      |  1 | aaa  |      1 | 13512345678 | 2023-05-31 14:18:48 | 2023-05-31 14:31:38 |
      |  2 | bbb  |      0 | 13512345678 | 2023-05-31 14:18:54 | 2023-05-31 14:18:54 |
      |  3 | ccc  |      0 | 13512345678 | 2023-05-31 14:19:00 | 2023-05-31 14:19:00 |
      +----+------+--------+-------------+---------------------+---------------------+
      3 rows in set (0.01 sec)
      
      -- 拒绝写
      mysql> update temp set status = 1 where id = 1;
      ERROR 1099 (HY000): Table 'temp' was locked with a READ lock and can't be updated

- 会话C：

      -- 可以读
      mysql> select * from temp;
      +----+------+--------+-------------+---------------------+---------------------+
      | id | name | status | telephone   | create_time         | update_time         |
      +----+------+--------+-------------+---------------------+---------------------+
      |  1 | aaa  |      1 | 13512345678 | 2023-05-31 14:18:48 | 2023-05-31 14:31:38 |
      |  2 | bbb  |      0 | 13512345678 | 2023-05-31 14:18:54 | 2023-05-31 14:18:54 |
      |  3 | ccc  |      0 | 13512345678 | 2023-05-31 14:19:00 | 2023-05-31 14:19:00 |
      +----+------+--------+-------------+---------------------+---------------------+
      3 rows in set (0.00 sec)
      
      -- 写被阻塞
      mysql> update temp set status = 1 where id = 1;
      [这里阻塞]

      -- 阻塞时间为 lock_wait_timeout 参数的秒数
      -- 365 天
      mysql> show variables like 'lock_wait_timeout';
      +-------------------+----------+
      | Variable_name     | Value    |
      +-------------------+----------+
      | lock_wait_timeout | 31536000 |
      +-------------------+----------+
      1 row in set (0.00 sec)

步骤二：

- 会话A：

      -- 查看会话状态
      -- 会话C正在等待表的元数据锁
      mysql> SHOW PROCESSLIST;
      +-------+------+-----------+--------+---------+------+---------------------------------+-----------------------------------------+
      | Id    | User | Host      | db     | Command | Time | State                           | Info                                    |
      +-------+------+-----------+--------+---------+------+---------------------------------+-----------------------------------------+
      | 59697 | root | localhost | sample | Query   |    0 | starting                        | SHOW PROCESSLIST                        |
      | 59698 | root | localhost | sample | Sleep   |    3 |                                 | NULL                                    |
      | 59699 | root | localhost | sample | Query   |    5 | Waiting for table metadata lock | update temp set status = 1 where id = 1 |
      +-------+------+-----------+--------+---------+------+---------------------------------+-----------------------------------------+
      3 rows in set (0.00 sec)

      -- 释放锁
      mysql> UNLOCK TABLES;
      Query OK, 0 rows affected (0.00 sec)

- 会话B：

      -- 释放锁
      mysql> UNLOCK TABLES;
      Query OK, 0 rows affected (0.00 sec)

- 会话C：

      -- 解除阻塞
      -- 继续执行
      mysql> update temp set status = 1 where id = 1;
      Query OK, 0 rows affected (22.23 sec)
      Rows matched: 1  Changed: 0  Warnings: 0

      -- 查看会话状态
      -- 会话C不再等待锁
      mysql> SHOW PROCESSLIST;
      +-------+------+-----------+--------+---------+------+----------+------------------+
      | Id    | User | Host      | db     | Command | Time | State    | Info             |
      +-------+------+-----------+--------+---------+------+----------+------------------+
      | 59697 | root | localhost | sample | Sleep   |   33 |          | NULL             |
      | 59698 | root | localhost | sample | Sleep   |   19 |          | NULL             |
      | 59699 | root | localhost | sample | Query   |    0 | starting | SHOW PROCESSLIST |
      +-------+------+-----------+--------+---------+------+----------+------------------+
      3 rows in set (0.00 sec)

## 2 锁定记录

系统库 `information_schema` 的表：
- `innodb_trx` - 当前运行的所有事务
- `innodb_locks` - 当前出现的锁
- `innodb_lock_waits` - 锁等待对应的关系


实例：

- 会话A：

      -- 查看表数据
      mysql> select * from temp;
      +----+------+--------+-------------+---------------------+---------------------+
      | id | name | status | telephone   | create_time         | update_time         |
      +----+------+--------+-------------+---------------------+---------------------+
      |  1 | aaa  |      1 | 13512345678 | 2023-05-31 14:18:48 | 2023-05-31 14:31:38 |
      |  2 | bbb  |      2 | 13512345678 | 2023-05-31 14:18:54 | 2023-05-31 19:20:48 |
      |  3 | ccc  |      0 | 13512345678 | 2023-05-31 14:19:00 | 2023-05-31 14:19:00 |
      +----+------+--------+-------------+---------------------+---------------------+
      3 rows in set (0.00 sec)
      
      -- 开启事务
      mysql> begin;
      Query OK, 0 rows affected (0.00 sec)
      
      -- 更新一条记录
      -- 记录加写锁
      mysql> update temp set status = 1 where id = 2;
      Query OK, 1 row affected (0.00 sec)
      Rows matched: 1  Changed: 1  Warnings: 0

- 会话B：

      -- 查看表的锁状态
      -- 此时没有锁
      mysql> SHOW OPEN TABLES FROM sample LIKE 'temp';
      +----------+-------+--------+-------------+
      | Database | Table | In_use | Name_locked |
      +----------+-------+--------+-------------+
      | sample   | temp  |      0 |           0 |
      +----------+-------+--------+-------------+
      1 row in set (0.00 sec)
      
      -- 更新同一条记录获取写锁阻塞
      mysql> update temp set status = 2 where id = 2;
      [这里阻塞]

- 会话C：

      -- 查看表的锁状态
      -- 此时有一个锁请求
      mysql> SHOW OPEN TABLES FROM sample LIKE 'temp';
      +----------+-------+--------+-------------+
      | Database | Table | In_use | Name_locked |
      +----------+-------+--------+-------------+
      | sample   | temp  |      1 |           0 |
      +----------+-------+--------+-------------+
      1 row in set (0.00 sec)
      
      -- 查看当前会话列表
      mysql> SHOW PROCESSLIST;
      +-------+------+-----------+--------+---------+------+----------+-----------------------------------------+
      | Id    | User | Host      | db     | Command | Time | State    | Info                                    |
      +-------+------+-----------+--------+---------+------+----------+-----------------------------------------+
      | 59697 | root | localhost | sample | Sleep   |   33 |          | NULL                                    |
      | 59698 | root | localhost | sample | Query   |   11 | updating | update temp set status = 2 where id = 2 |
      | 59699 | root | localhost | sample | Query   |    0 | starting | SHOW PROCESSLIST                        |
      +-------+------+-----------+--------+---------+------+----------+-----------------------------------------+
      3 rows in set (0.00 sec)
      
      -- 当前运行的所有事务
      -- 59698 会话对应的事务状态为 LOCK WAIT
      mysql> select * from information_schema.innodb_trx \G
      *************************** 1. row ***************************
                          trx_id: 1761892
                       trx_state: LOCK WAIT
                     trx_started: 2023-05-31 19:21:36
           trx_requested_lock_id: 1761892:196:3:3
                trx_wait_started: 2023-05-31 19:21:36
                      trx_weight: 2
             trx_mysql_thread_id: 59698
                       trx_query: update temp set status = 2 where id = 2
             trx_operation_state: starting index read
               trx_tables_in_use: 1
               trx_tables_locked: 1
                trx_lock_structs: 2
           trx_lock_memory_bytes: 1136
                 trx_rows_locked: 1
               trx_rows_modified: 0
         trx_concurrency_tickets: 0
             trx_isolation_level: REPEATABLE READ
               trx_unique_checks: 1
          trx_foreign_key_checks: 1
      trx_last_foreign_key_error: NULL
       trx_adaptive_hash_latched: 0
       trx_adaptive_hash_timeout: 0
                trx_is_read_only: 0
      trx_autocommit_non_locking: 0
      *************************** 2. row ***************************
                          trx_id: 1761891
                       trx_state: RUNNING
                     trx_started: 2023-05-31 19:21:14
           trx_requested_lock_id: NULL
                trx_wait_started: NULL
                      trx_weight: 3
             trx_mysql_thread_id: 59697
                       trx_query: NULL
             trx_operation_state: NULL
               trx_tables_in_use: 0
               trx_tables_locked: 1
                trx_lock_structs: 2
           trx_lock_memory_bytes: 1136
                 trx_rows_locked: 1
               trx_rows_modified: 1
         trx_concurrency_tickets: 0
             trx_isolation_level: REPEATABLE READ
               trx_unique_checks: 1
          trx_foreign_key_checks: 1
      trx_last_foreign_key_error: NULL
       trx_adaptive_hash_latched: 0
       trx_adaptive_hash_timeout: 0
                trx_is_read_only: 0
      trx_autocommit_non_locking: 0
      2 rows in set (0.00 sec)
      
      -- 当前出现的锁
      -- 俩个事务对应同一条记录的写锁
      mysql> select * from information_schema.innodb_locks \G
      *************************** 1. row ***************************
          lock_id: 1761892:196:3:3
      lock_trx_id: 1761892
        lock_mode: X
        lock_type: RECORD
       lock_table: `sample`.`temp`
       lock_index: PRIMARY
       lock_space: 196
        lock_page: 3
         lock_rec: 3
        lock_data: 2
      *************************** 2. row ***************************
          lock_id: 1761891:196:3:3
      lock_trx_id: 1761891
        lock_mode: X
        lock_type: RECORD
       lock_table: `sample`.`temp`
       lock_index: PRIMARY
       lock_space: 196
        lock_page: 3
         lock_rec: 3
        lock_data: 2
      2 rows in set, 1 warning (0.00 sec)
      
      -- 锁等待对应关系
      -- 事务1761892(会话59698)请求锁
      -- 事务1761891(会话59697)占用锁
      mysql> select * from information_schema.innodb_lock_waits \G
      *************************** 1. row ***************************
      requesting_trx_id: 1761892
      requested_lock_id: 1761892:196:3:3
        blocking_trx_id: 1761891
       blocking_lock_id: 1761891:196:3:3
      1 row in set, 1 warning (0.00 sec)
      
      -- 行锁等待阻塞时间为 innodb_lock_wait_timeout 参数的秒数
      -- 50 秒
      mysql> show variables like 'innodb_lock_wait_timeout';
      +--------------------------+-------+
      | Variable_name            | Value |
      +--------------------------+-------+
      | innodb_lock_wait_timeout | 50    |
      +--------------------------+-------+
      1 row in set (0.00 sec)

**====== 50秒后 ======**

- 会话B：

      -- 行锁等待超时
      mysql> update temp set status = 2 where id = 2;
      ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction


- 会话C：

      -- 查看表的锁状态
      -- 此时不再有锁请求
      mysql> SHOW OPEN TABLES FROM sample LIKE 'temp';
      +----------+-------+--------+-------------+
      | Database | Table | In_use | Name_locked |
      +----------+-------+--------+-------------+
      | sample   | temp  |      0 |           0 |
      +----------+-------+--------+-------------+
      1 row in set (0.00 sec)
      
      -- 当前运行的所有事务
      -- 只剩下 59697 会话对应的事务
      mysql> select * from information_schema.innodb_trx \G
      *************************** 1. row ***************************
                          trx_id: 1761891
                       trx_state: RUNNING
                     trx_started: 2023-05-31 19:21:14
           trx_requested_lock_id: NULL
                trx_wait_started: NULL
                      trx_weight: 3
             trx_mysql_thread_id: 59697
                       trx_query: NULL
             trx_operation_state: NULL
               trx_tables_in_use: 0
               trx_tables_locked: 1
                trx_lock_structs: 2
           trx_lock_memory_bytes: 1136
                 trx_rows_locked: 1
               trx_rows_modified: 1
         trx_concurrency_tickets: 0
             trx_isolation_level: REPEATABLE READ
               trx_unique_checks: 1
          trx_foreign_key_checks: 1
      trx_last_foreign_key_error: NULL
       trx_adaptive_hash_latched: 0
       trx_adaptive_hash_timeout: 0
                trx_is_read_only: 0
      trx_autocommit_non_locking: 0
      1 row in set (0.00 sec)
      
      -- 当前出现的锁
      -- 无记录
      mysql> select * from information_schema.innodb_locks \G
      Empty set, 1 warning (0.00 sec)
      
      -- 锁等待对应关系
      -- 无记录
      mysql> select * from information_schema.innodb_lock_waits \G
      Empty set, 1 warning (0.00 sec)
      
      
      -- 查看当前会话列表
      mysql> SHOW PROCESSLIST;
      +-------+------+-----------+--------+---------+------+----------+------------------+
      | Id    | User | Host      | db     | Command | Time | State    | Info             |
      +-------+------+-----------+--------+---------+------+----------+------------------+
      | 59697 | root | localhost | sample | Sleep   |  393 |          | NULL             |
      | 59698 | root | localhost | sample | Sleep   |  371 |          | NULL             |
      | 59699 | root | localhost | sample | Query   |    0 | starting | SHOW PROCESSLIST |
      +-------+------+-----------+--------+---------+------+----------+------------------+
      3 rows in set (0.00 sec)

# 完
