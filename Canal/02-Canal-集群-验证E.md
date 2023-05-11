# 02-Canal-集群-验证E

表 `DDL` 操作事件验证：

验证已经搭建好的 `Canal` 集群，数据库更新操作同步消息到 `RocketMQ`。

本示例在数据库 `sample` 的 `demo` 表执行如下操作：
- `创建表`
- `修改表`
- `创建索引`
- `删除索引`
- `截断表`
- `重命名表`
- `删除表`

## 执行数据库操作

先刷新一下二进制日志，启用一个新文件：

    mysql> flush logs;
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000022 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

### 执行列表

- 切换数据库：

      use sample;

- 创建表

      CREATE TABLE demo (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
        username varchar(32) NOT NULL COMMENT '用户名',
        password varchar(32) NOT NULL COMMENT '用户密码',
        nickname varchar(32) NOT NULL COMMENT '用户昵称',
        telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
        status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
        create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (id) USING BTREE,
        UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表';

- 修改表

      ALTER TABLE demo 
      ADD COLUMN memo varchar(128) NULL COMMENT '备注' AFTER status;
      
      ALTER TABLE demo 
      MODIFY COLUMN memo varchar(256) NULL COMMENT '备注修改' AFTER status;
      
      ALTER TABLE demo 
      DROP COLUMN memo;

- 创建索引

      ALTER TABLE demo 
      ADD INDEX idx_status(status) USING BTREE COMMENT '用户状态索引';

- 删除索引

      ALTER TABLE demo 
      DROP INDEX idx_status;

- 截断表

      TRUNCATE demo;

- 重命名表

      RENAME TABLE demo TO demo2;

- 删除表

      DROP TABLE demo2;

### 执行记录

    mysql> use sample;
    Database changed
    mysql> CREATE TABLE demo (
        ->   id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
        ->   username varchar(32) NOT NULL COMMENT '用户名',
        ->   password varchar(32) NOT NULL COMMENT '用户密码',
        ->   nickname varchar(32) NOT NULL COMMENT '用户昵称',
        ->   telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
        ->   status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
        ->   create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        ->   update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        ->   PRIMARY KEY (id) USING BTREE,
        ->   UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'
        -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表';
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> ALTER TABLE demo
        -> ADD COLUMN memo varchar(128) NULL COMMENT '备注' AFTER status;
    Query OK, 0 rows affected (0.02 sec)
    Records: 0  Duplicates: 0  Warnings: 0
    
    mysql> ALTER TABLE demo
        -> MODIFY COLUMN memo varchar(256) NULL COMMENT '备注修改' AFTER status;
    Query OK, 0 rows affected (0.01 sec)
    Records: 0  Duplicates: 0  Warnings: 0
    
    mysql> ALTER TABLE demo
        -> DROP COLUMN memo;
    Query OK, 0 rows affected (0.01 sec)
    Records: 0  Duplicates: 0  Warnings: 0
    
    mysql> ALTER TABLE demo
        -> ADD INDEX idx_status(status) USING BTREE COMMENT '用户状态索引';
    Query OK, 0 rows affected (0.01 sec)
    Records: 0  Duplicates: 0  Warnings: 0
    
    mysql> ALTER TABLE demo
        -> DROP INDEX idx_status;
    Query OK, 0 rows affected (0.01 sec)
    Records: 0  Duplicates: 0  Warnings: 0
    
    mysql> TRUNCATE demo;
    Query OK, 0 rows affected (0.00 sec)
    
    mysql> RENAME TABLE demo TO demo2;
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> DROP TABLE demo2;
    Query OK, 0 rows affected (0.00 sec)
        

### 二进制日志文件的事件列表

    mysql> show binlog events in 'mysql-bin.000022' \G
    *************************** 1. row ***************************
       Log_name: mysql-bin.000022
            Pos: 4
     Event_type: Format_desc
      Server_id: 1
    End_log_pos: 123
           Info: Server ver: 5.7.41-log, Binlog ver: 4
    *************************** 2. row ***************************
       Log_name: mysql-bin.000022
            Pos: 123
     Event_type: Previous_gtids
      Server_id: 1
    End_log_pos: 154
           Info:
    *************************** 3. row ***************************
       Log_name: mysql-bin.000022
            Pos: 154
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 219
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 4. row ***************************
       Log_name: mysql-bin.000022
            Pos: 219
     Event_type: Query
      Server_id: 1
    End_log_pos: 1053
           Info: use `sample`; CREATE TABLE demo (
      id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
      username varchar(32) NOT NULL COMMENT '用户名',
      password varchar(32) NOT NULL COMMENT '用户密码',
      nickname varchar(32) NOT NULL COMMENT '用户昵称',
      telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
      status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
      create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id) USING BTREE,
      UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表'
    *************************** 5. row ***************************
       Log_name: mysql-bin.000022
            Pos: 1053
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 1118
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 6. row ***************************
       Log_name: mysql-bin.000022
            Pos: 1118
     Event_type: Query
      Server_id: 1
    End_log_pos: 1204
           Info: BEGIN
    *************************** 7. row ***************************
       Log_name: mysql-bin.000022
            Pos: 1204
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 2378
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',219,'1',1683801189000,'sample','sample','demo','CREATE TABLE demo (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT \'ID\',\n  username varchar(32) NOT NULL COMMENT \'用户名\',\n  password varchar(32) NOT NULL COMMENT \'用户密码\',\n  nickname varchar(32) NOT NULL COMMENT \'用户昵称\',\n  telephone bigint(20) unsigned NOT NULL COMMENT \'用户手机\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'用户状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT \'用户名唯一索引\'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'示例表\'','CREATE',null)
    *************************** 8. row ***************************
       Log_name: mysql-bin.000022
            Pos: 2378
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 2471
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 9. row ***************************
       Log_name: mysql-bin.000022
            Pos: 2471
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 3369
           Info: table_id: 155 flags: STMT_END_F
    *************************** 10. row ***************************
       Log_name: mysql-bin.000022
            Pos: 3369
     Event_type: Xid
      Server_id: 1
    End_log_pos: 3400
           Info: COMMIT /* xid=66107686 */
    *************************** 11. row ***************************
       Log_name: mysql-bin.000022
            Pos: 3400
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 3465
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 12. row ***************************
       Log_name: mysql-bin.000022
            Pos: 3465
     Event_type: Query
      Server_id: 1
    End_log_pos: 3551
           Info: BEGIN
    *************************** 13. row ***************************
       Log_name: mysql-bin.000022
            Pos: 3551
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 4739
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',219,'1',1683801189000,'sample','sample','demo','CREATE TABLE demo (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT \'ID\',\n  username varchar(32) NOT NULL COMMENT \'用户名\',\n  password varchar(32) NOT NULL COMMENT \'用户密码\',\n  nickname varchar(32) NOT NULL COMMENT \'用户昵称\',\n  telephone bigint(20) unsigned NOT NULL COMMENT \'用户手机\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'用户状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT \'用户名唯一索引\'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'示例表\'','CREATE',null)
    *************************** 14. row ***************************
       Log_name: mysql-bin.000022
            Pos: 4739
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 4832
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 15. row ***************************
       Log_name: mysql-bin.000022
            Pos: 4832
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 5744
           Info: table_id: 155 flags: STMT_END_F
    *************************** 16. row ***************************
       Log_name: mysql-bin.000022
            Pos: 5744
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5775
           Info: COMMIT /* xid=66107688 */
    *************************** 17. row ***************************
       Log_name: mysql-bin.000022
            Pos: 5775
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5840
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 18. row ***************************
       Log_name: mysql-bin.000022
            Pos: 5840
     Event_type: Query
      Server_id: 1
    End_log_pos: 6007
           Info: use `sample`; ALTER TABLE demo
    ADD COLUMN memo varchar(128) NULL COMMENT '备注' AFTER status
    *************************** 19. row ***************************
       Log_name: mysql-bin.000022
            Pos: 6007
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6072
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 20. row ***************************
       Log_name: mysql-bin.000022
            Pos: 6072
     Event_type: Query
      Server_id: 1
    End_log_pos: 6158
           Info: BEGIN
    *************************** 21. row ***************************
       Log_name: mysql-bin.000022
            Pos: 6158
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 6641
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',5840,'1',1683801195000,'sample','sample','demo','ALTER TABLE demo \nADD COLUMN memo varchar(128) NULL COMMENT \'备注\' AFTER status','ALTER',null)
    *************************** 22. row ***************************
       Log_name: mysql-bin.000022
            Pos: 6641
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 6734
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 23. row ***************************
       Log_name: mysql-bin.000022
            Pos: 6734
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 6970
           Info: table_id: 155 flags: STMT_END_F
    *************************** 24. row ***************************
       Log_name: mysql-bin.000022
            Pos: 6970
     Event_type: Xid
      Server_id: 1
    End_log_pos: 7001
           Info: COMMIT /* xid=66107853 */
    *************************** 25. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7001
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 7066
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 26. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7066
     Event_type: Query
      Server_id: 1
    End_log_pos: 7152
           Info: BEGIN
    *************************** 27. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7152
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 7621
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',5840,'1',1683801195000,'sample','sample','demo','ALTER TABLE demo \nADD COLUMN memo varchar(128) NULL COMMENT \'备注\' AFTER status','ALTER',null)
    *************************** 28. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7621
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 7714
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 29. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7714
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 7936
           Info: table_id: 155 flags: STMT_END_F
    *************************** 30. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7936
     Event_type: Xid
      Server_id: 1
    End_log_pos: 7967
           Info: COMMIT /* xid=66107855 */
    *************************** 31. row ***************************
       Log_name: mysql-bin.000022
            Pos: 7967
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 8032
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 32. row ***************************
       Log_name: mysql-bin.000022
            Pos: 8032
     Event_type: Query
      Server_id: 1
    End_log_pos: 8200
           Info: use `sample`; ALTER TABLE demo
    MODIFY COLUMN memo varchar(256) NULL COMMENT '备注修改' AFTER status
    *************************** 33. row ***************************
       Log_name: mysql-bin.000022
            Pos: 8200
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 8265
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 34. row ***************************
       Log_name: mysql-bin.000022
            Pos: 8265
     Event_type: Query
      Server_id: 1
    End_log_pos: 8351
           Info: BEGIN
    *************************** 35. row ***************************
       Log_name: mysql-bin.000022
            Pos: 8351
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 8829
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',8032,'1',1683801200000,'sample','sample','demo','ALTER TABLE demo \nMODIFY COLUMN memo varchar(256) NULL COMMENT \'备注修改\' AFTER status','ALTER',null)
    *************************** 36. row ***************************
       Log_name: mysql-bin.000022
            Pos: 8829
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 8922
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 37. row ***************************
       Log_name: mysql-bin.000022
            Pos: 8922
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 9153
           Info: table_id: 155 flags: STMT_END_F
    *************************** 38. row ***************************
       Log_name: mysql-bin.000022
            Pos: 9153
     Event_type: Xid
      Server_id: 1
    End_log_pos: 9184
           Info: COMMIT /* xid=66108022 */
    *************************** 39. row ***************************
       Log_name: mysql-bin.000022
            Pos: 9184
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 9249
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 40. row ***************************
       Log_name: mysql-bin.000022
            Pos: 9249
     Event_type: Query
      Server_id: 1
    End_log_pos: 9335
           Info: BEGIN
    *************************** 41. row ***************************
       Log_name: mysql-bin.000022
            Pos: 9335
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 9827
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',8032,'1',1683801200000,'sample','sample','demo','ALTER TABLE demo \nMODIFY COLUMN memo varchar(256) NULL COMMENT \'备注修改\' AFTER status','ALTER',null)
    *************************** 42. row ***************************
       Log_name: mysql-bin.000022
            Pos: 9827
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 9920
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 43. row ***************************
       Log_name: mysql-bin.000022
            Pos: 9920
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 10165
           Info: table_id: 155 flags: STMT_END_F
    *************************** 44. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10165
     Event_type: Xid
      Server_id: 1
    End_log_pos: 10196
           Info: COMMIT /* xid=66108023 */
    *************************** 45. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10196
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 10261
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 46. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10261
     Event_type: Query
      Server_id: 1
    End_log_pos: 10381
           Info: use `sample`; ALTER TABLE demo
    DROP COLUMN memo
    *************************** 47. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10381
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 10446
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 48. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10446
     Event_type: Query
      Server_id: 1
    End_log_pos: 10532
           Info: BEGIN
    *************************** 49. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10532
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 10967
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',10261,'1',1683801205000,'sample','sample','demo','ALTER TABLE demo \nDROP COLUMN memo','ALTER',null)
    *************************** 50. row ***************************
       Log_name: mysql-bin.000022
            Pos: 10967
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 11060
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 51. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11060
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 11249
           Info: table_id: 155 flags: STMT_END_F
    *************************** 52. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11249
     Event_type: Xid
      Server_id: 1
    End_log_pos: 11280
           Info: COMMIT /* xid=66108191 */
    *************************** 53. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11280
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 11345
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 54. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11345
     Event_type: Query
      Server_id: 1
    End_log_pos: 11431
           Info: BEGIN
    *************************** 55. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11431
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 11852
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',10261,'1',1683801205000,'sample','sample','demo','ALTER TABLE demo \nDROP COLUMN memo','ALTER',null)
    *************************** 56. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11852
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 11945
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 57. row ***************************
       Log_name: mysql-bin.000022
            Pos: 11945
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 12120
           Info: table_id: 155 flags: STMT_END_F
    *************************** 58. row ***************************
       Log_name: mysql-bin.000022
            Pos: 12120
     Event_type: Xid
      Server_id: 1
    End_log_pos: 12151
           Info: COMMIT /* xid=66108192 */
    *************************** 59. row ***************************
       Log_name: mysql-bin.000022
            Pos: 12151
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 12216
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 60. row ***************************
       Log_name: mysql-bin.000022
            Pos: 12216
     Event_type: Query
      Server_id: 1
    End_log_pos: 12389
           Info: use `sample`; ALTER TABLE demo
    ADD INDEX idx_status(status) USING BTREE COMMENT '用户状态索引'
    *************************** 61. row ***************************
       Log_name: mysql-bin.000022
            Pos: 12389
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 12454
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 62. row ***************************
       Log_name: mysql-bin.000022
            Pos: 12454
     Event_type: Query
      Server_id: 1
    End_log_pos: 12540
           Info: BEGIN
    *************************** 63. row ***************************
       Log_name: mysql-bin.000022
            Pos: 12540
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 13017
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',12216,'1',1683801212000,'sample','sample','demo','ALTER TABLE demo \nADD INDEX idx_status(status) USING BTREE COMMENT \'用户状态索引\'','CINDEX',null)
    *************************** 64. row ***************************
       Log_name: mysql-bin.000022
            Pos: 13017
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 13110
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 65. row ***************************
       Log_name: mysql-bin.000022
            Pos: 13110
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 13339
           Info: table_id: 155 flags: STMT_END_F
    *************************** 66. row ***************************
       Log_name: mysql-bin.000022
            Pos: 13339
     Event_type: Xid
      Server_id: 1
    End_log_pos: 13370
           Info: COMMIT /* xid=66108501 */
    *************************** 67. row ***************************
       Log_name: mysql-bin.000022
            Pos: 13370
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 13435
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 68. row ***************************
       Log_name: mysql-bin.000022
            Pos: 13435
     Event_type: Query
      Server_id: 1
    End_log_pos: 13521
           Info: BEGIN
    *************************** 69. row ***************************
       Log_name: mysql-bin.000022
            Pos: 13521
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 14012
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',12216,'1',1683801212000,'sample','sample','demo','ALTER TABLE demo \nADD INDEX idx_status(status) USING BTREE COMMENT \'用户状态索引\'','CINDEX',null)
    *************************** 70. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14012
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 14105
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 71. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14105
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 14348
           Info: table_id: 155 flags: STMT_END_F
    *************************** 72. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14348
     Event_type: Xid
      Server_id: 1
    End_log_pos: 14379
           Info: COMMIT /* xid=66108503 */
    *************************** 73. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14379
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 14444
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 74. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14444
     Event_type: Query
      Server_id: 1
    End_log_pos: 14561
           Info: use `sample`; ALTER TABLE demo
    DROP INDEX idx_status
    *************************** 75. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14561
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 14626
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 76. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14626
     Event_type: Query
      Server_id: 1
    End_log_pos: 14712
           Info: BEGIN
    *************************** 77. row ***************************
       Log_name: mysql-bin.000022
            Pos: 14712
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 15139
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',14444,'1',1683801217000,'sample','sample','demo','ALTER TABLE demo \nDROP INDEX idx_status','DINDEX',null)
    *************************** 78. row ***************************
       Log_name: mysql-bin.000022
            Pos: 15139
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 15232
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 79. row ***************************
       Log_name: mysql-bin.000022
            Pos: 15232
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 15413
           Info: table_id: 155 flags: STMT_END_F
    *************************** 80. row ***************************
       Log_name: mysql-bin.000022
            Pos: 15413
     Event_type: Xid
      Server_id: 1
    End_log_pos: 15444
           Info: COMMIT /* xid=66108669 */
    *************************** 81. row ***************************
       Log_name: mysql-bin.000022
            Pos: 15444
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 15509
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 82. row ***************************
       Log_name: mysql-bin.000022
            Pos: 15509
     Event_type: Query
      Server_id: 1
    End_log_pos: 15595
           Info: BEGIN
    *************************** 83. row ***************************
       Log_name: mysql-bin.000022
            Pos: 15595
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 16036
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',14444,'1',1683801217000,'sample','sample','demo','ALTER TABLE demo \nDROP INDEX idx_status','DINDEX',null)
    *************************** 84. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16036
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 16129
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 85. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16129
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 16324
           Info: table_id: 155 flags: STMT_END_F
    *************************** 86. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16324
     Event_type: Xid
      Server_id: 1
    End_log_pos: 16355
           Info: COMMIT /* xid=66108671 */
    *************************** 87. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16355
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 16420
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 88. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16420
     Event_type: Query
      Server_id: 1
    End_log_pos: 16502
           Info: use `sample`; TRUNCATE demo
    *************************** 89. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16502
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 16567
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 90. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16567
     Event_type: Query
      Server_id: 1
    End_log_pos: 16653
           Info: BEGIN
    *************************** 91. row ***************************
       Log_name: mysql-bin.000022
            Pos: 16653
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 17069
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',16420,'1',1683801224000,'sample','sample','demo','TRUNCATE demo','TRUNCATE',null)
    *************************** 92. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17069
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 17162
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 93. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17162
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 17333
           Info: table_id: 155 flags: STMT_END_F
    *************************** 94. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17333
     Event_type: Xid
      Server_id: 1
    End_log_pos: 17364
           Info: COMMIT /* xid=66108861 */
    *************************** 95. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17364
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 17429
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 96. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17429
     Event_type: Query
      Server_id: 1
    End_log_pos: 17515
           Info: BEGIN
    *************************** 97. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17515
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 17917
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',16420,'1',1683801224000,'sample','sample','demo','TRUNCATE demo','TRUNCATE',null)
    *************************** 98. row ***************************
       Log_name: mysql-bin.000022
            Pos: 17917
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 18010
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 99. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18010
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 18167
           Info: table_id: 155 flags: STMT_END_F
    *************************** 100. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18167
     Event_type: Xid
      Server_id: 1
    End_log_pos: 18198
           Info: COMMIT /* xid=66108862 */
    *************************** 101. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18198
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 18263
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 102. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18263
     Event_type: Query
      Server_id: 1
    End_log_pos: 18367
           Info: use `sample`; RENAME TABLE demo TO demo2
    *************************** 103. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18367
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 18432
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 104. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18432
     Event_type: Query
      Server_id: 1
    End_log_pos: 18518
           Info: BEGIN
    *************************** 105. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18518
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 18946
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',18263,'1',1683801232000,'sample','sample','demo2','RENAME TABLE demo TO demo2','RENAME',null)
    *************************** 106. row ***************************
       Log_name: mysql-bin.000022
            Pos: 18946
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 19039
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 107. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19039
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 19222
           Info: table_id: 155 flags: STMT_END_F
    *************************** 108. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19222
     Event_type: Xid
      Server_id: 1
    End_log_pos: 19253
           Info: COMMIT /* xid=66109172 */
    *************************** 109. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19253
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 19318
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 110. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19318
     Event_type: Query
      Server_id: 1
    End_log_pos: 19404
           Info: BEGIN
    *************************** 111. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19404
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 19818
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',18263,'1',1683801232000,'sample','sample','demo2','RENAME TABLE demo TO demo2','RENAME',null)
    *************************** 112. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19818
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 19911
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 113. row ***************************
       Log_name: mysql-bin.000022
            Pos: 19911
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 20080
           Info: table_id: 155 flags: STMT_END_F
    *************************** 114. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20080
     Event_type: Xid
      Server_id: 1
    End_log_pos: 20111
           Info: COMMIT /* xid=66109173 */
    *************************** 115. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20111
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 20176
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 116. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20176
     Event_type: Query
      Server_id: 1
    End_log_pos: 20298
           Info: use `sample`; DROP TABLE `demo2` /* generated by server */
    *************************** 117. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20298
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 20363
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 118. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20363
     Event_type: Query
      Server_id: 1
    End_log_pos: 20449
           Info: BEGIN
    *************************** 119. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20449
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 20880
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000022',20176,'1',1683801237000,'sample','sample','demo2','DROP TABLE `demo2` /* generated by server */','ERASE',null)
    *************************** 120. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20880
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 20973
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 121. row ***************************
       Log_name: mysql-bin.000022
            Pos: 20973
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 21159
           Info: table_id: 155 flags: STMT_END_F
    *************************** 122. row ***************************
       Log_name: mysql-bin.000022
            Pos: 21159
     Event_type: Xid
      Server_id: 1
    End_log_pos: 21190
           Info: COMMIT /* xid=66109342 */
    *************************** 123. row ***************************
       Log_name: mysql-bin.000022
            Pos: 21190
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 21255
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 124. row ***************************
       Log_name: mysql-bin.000022
            Pos: 21255
     Event_type: Query
      Server_id: 1
    End_log_pos: 21341
           Info: BEGIN
    *************************** 125. row ***************************
       Log_name: mysql-bin.000022
            Pos: 21341
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 21786
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-dynamic-topic','mysql-bin.000022',20176,'1',1683801237000,'sample','sample','demo2','DROP TABLE `demo2` /* generated by server */','ERASE',null)
    *************************** 126. row ***************************
       Log_name: mysql-bin.000022
            Pos: 21786
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 21879
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 127. row ***************************
       Log_name: mysql-bin.000022
            Pos: 21879
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 22079
           Info: table_id: 155 flags: STMT_END_F
    *************************** 128. row ***************************
       Log_name: mysql-bin.000022
            Pos: 22079
     Event_type: Xid
      Server_id: 1
    End_log_pos: 22110
           Info: COMMIT /* xid=66109343 */
    128 rows in set (0.00 sec)
    

## 查看 RocketMQ 消息

### 消息

    // 消息
    7F0000010A602090562B377AB78F0042 | sample-tag | 2023-05-11 18:33:09	
    
    // 对应SQL
    CREATE TABLE demo (
      id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
      username varchar(32) NOT NULL COMMENT '用户名',
      password varchar(32) NOT NULL COMMENT '用户密码',
      nickname varchar(32) NOT NULL COMMENT '用户昵称',
      telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
      status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
      create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id) USING BTREE,
      UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表';
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801189000,
        "id": 74,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "CREATE TABLE demo (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',\n  username varchar(32) NOT NULL COMMENT '用户名',\n  password varchar(32) NOT NULL COMMENT '用户密码',\n  nickname varchar(32) NOT NULL COMMENT '用户昵称',\n  telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',\n  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='示例表'",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801189262,
        "type": "CREATE"
    }

### 消息

    // 消息
    7F0000010A602090562B377AD0FA0043 | sample-tag | 2023-05-11 18:33:15	
    
    // 对应SQL
    ALTER TABLE demo 
    ADD COLUMN memo varchar(128) NULL COMMENT '备注' AFTER status;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801195000,
        "id": 75,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "ALTER TABLE demo \nADD COLUMN memo varchar(128) NULL COMMENT '备注' AFTER status",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801195770,
        "type": "ALTER"
    }

### 消息

    // 消息
    7F0000010A602090562B377AE4F00044 | sample-tag | 2023-05-11 18:33:20	
    
    // 对应SQL
    ALTER TABLE demo 
    MODIFY COLUMN memo varchar(256) NULL COMMENT '备注修改' AFTER status;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801200000,
        "id": 76,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "ALTER TABLE demo \nMODIFY COLUMN memo varchar(256) NULL COMMENT '备注修改' AFTER status",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801200880,
        "type": "ALTER"
    }

### 消息

    // 消息
    7F0000010A602090562B377AF7580045 | sample-tag | 2023-05-11 18:33:25	
    
    // 对应SQL
    ALTER TABLE demo 
    DROP COLUMN memo;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801205000,
        "id": 77,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "ALTER TABLE demo \nDROP COLUMN memo",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801205592,
        "type": "ALTER"
    }

### 消息

    // 消息
    7F0000010A602090562B377B118C0046 | sample-tag | 2023-05-11 18:33:32	
    
    // 对应SQL
    ALTER TABLE demo 
    ADD INDEX idx_status(status) USING BTREE COMMENT '用户状态索引';
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801212000,
        "id": 78,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "ALTER TABLE demo \nADD INDEX idx_status(status) USING BTREE COMMENT '用户状态索引'",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801212300,
        "type": "CINDEX"
    }

### 消息

    // 消息
    7F0000010A602090562B377B25800047 | sample-tag | 2023-05-11 18:33:37	
    
    // 对应SQL
    ALTER TABLE demo 
    DROP INDEX idx_status;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801217000,
        "id": 79,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "ALTER TABLE demo \nDROP INDEX idx_status",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801217407,
        "type": "DINDEX"
    }

### 消息

    // 消息
    7F0000010A602090562B377B40820048 | sample-tag | 2023-05-11 18:33:44	
    
    // 对应SQL
    TRUNCATE demo;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801224000,
        "id": 80,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "TRUNCATE demo",
        "sqlType": null,
        "table": "demo",
        "ts": 1683801224322,
        "type": "TRUNCATE"
    }

### 消息

    // 消息
    7F0000010A602090562B377B61C20049 | sample-tag | 2023-05-11 18:33:52	
    
    // 对应SQL
    RENAME TABLE demo TO demo2;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801232000,
        "id": 81,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "RENAME TABLE demo TO demo2",
        "sqlType": null,
        "table": "demo2",
        "ts": 1683801232834,
        "type": "RENAME"
    }

### 消息

    // 消息
    7F0000010A602090562B377B735B004A | sample-tag | 2023-05-11 18:33:57 
    
    // 对应SQL
    DROP TABLE demo2;
    
    {
        "data": null,
        "database": "sample",
        "es": 1683801237000,
        "id": 82,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "DROP TABLE `demo2` /* generated by server */",
        "sqlType": null,
        "table": "demo2",
        "ts": 1683801237339,
        "type": "ERASE"
    }


## 创建/删除 数据库的消息

`创建/删除` 数据库的消息类型都是 `QUERY` 类型。

### 创建数据库

    {
        "data": null,
        "database": "`sample_back`",
        "es": 1683803149000,
        "id": 84,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "CREATE DATABASE `sample_back`",
        "sqlType": null,
        "table": "",
        "ts": 1683803149764,
        "type": "QUERY"
    }

### 删除数据库

    {
        "data": null,
        "database": "`sample_back`",
        "es": 1683803066000,
        "id": 83,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "DROP DATABASE `sample_back`",
        "sqlType": null,
        "table": "",
        "ts": 1683803067186,
        "type": "QUERY"
    }

## 总结

`DDL` 操作消息的 `sql` 字段是原始执行的 `SQL` 语句，有可能 `表名` 的前面会有 `数据库名`，消费的时候如果要同步到不同名的 `数据库`，需要对 `SQL` 语句执行相应的替换处理。

# 完