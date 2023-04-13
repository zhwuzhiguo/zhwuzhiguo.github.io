# 02-Canal-集群-验证

验证已经搭建好的 `Canal` 集群，数据库更新操作同步消息到 `RocketMQ`。

## 执行数据库操作

### 执行列表

1. 创建数据库

       create database sample;

2. 创建表

       CREATE TABLE user (
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
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';

3. 分别插入2行记录

       INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00');
       INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26');

4. 一次性插入2行记录

       INSERT INTO user(username, password, nickname, telephone, status) VALUES 
       ('admin1', '123456', '管理员1', 13512345678, 0),
       ('admin2', '123456', '管理员2', 13512345678, 0);

5. 更新2行记录

       UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';

6. 删除2行记录

       DELETE FROM user WHERE username LIKE 'admin%';


### 执行记录

    mysql> create database sample;
    Query OK, 1 row affected (0.00 sec)
    
    mysql> use sample;
    Database changed
    mysql> show tables;
    Empty set (0.00 sec)
    
    mysql> CREATE TABLE user (
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
        -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';
    Query OK, 0 rows affected (0.08 sec)
    
    mysql> INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00');
    Query OK, 1 row affected (0.00 sec)
    
    mysql> INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26');
    Query OK, 1 row affected (0.01 sec)
    
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES
        -> ('admin1', '123456', '管理员1', 13512345678, 0),
        -> ('admin2', '123456', '管理员2', 13512345678, 0);
    Query OK, 2 rows affected (0.01 sec)
    Records: 2  Duplicates: 0  Warnings: 0
    
    mysql> UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';
    Query OK, 2 rows affected (0.00 sec)
    Rows matched: 2  Changed: 2  Warnings: 0
    
    mysql> DELETE FROM user WHERE username LIKE 'admin%';
    Query OK, 2 rows affected (0.01 sec)

### 主库的二进制日志信息

    mysql> select * from user;
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname | telephone   | status | create_time         | update_time         |
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    |  1 | master   | 123456   | 主人     | 13512345678 |      0 | 2023-03-30 19:02:40 | 2023-03-30 19:19:00 |
    |  2 | slave    | 123456   | 仆人     | 13512345678 |      0 | 2023-03-30 19:19:26 | 2023-03-30 19:19:26 |
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    2 rows in set (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000004 |    12515 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    mysql> show binary logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   7828591 |
    | mysql-bin.000003 |     50409 |
    | mysql-bin.000004 |     12515 |
    +------------------+-----------+
    4 rows in set (0.00 sec)

### 最后一个二进制日志文件的事件列表

    mysql> show binlog events in 'mysql-bin.000004' \G
    *************************** 1. row ***************************
       Log_name: mysql-bin.000004
            Pos: 4
     Event_type: Format_desc
      Server_id: 1
    End_log_pos: 123
           Info: Server ver: 5.7.41-log, Binlog ver: 4
    *************************** 2. row ***************************
       Log_name: mysql-bin.000004
            Pos: 123
     Event_type: Previous_gtids
      Server_id: 1
    End_log_pos: 154
           Info:
    *************************** 3. row ***************************
       Log_name: mysql-bin.000004
            Pos: 154
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 219
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 4. row ***************************
       Log_name: mysql-bin.000004
            Pos: 219
     Event_type: Query
      Server_id: 1
    End_log_pos: 308
           Info: BEGIN
    *************************** 5. row ***************************
       Log_name: mysql-bin.000004
            Pos: 308
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 1289
           Info: # insert into canal_instance_config (cluster_id, server_id, name, content, content_md5, status, modified_time) values (1,null,'sample-instance','## 主库同步点位\ncanal.instance.gtidon = false\ncanal.instance.master.address = mysql-33071-master:3306\ncanal.instance.master.journal.name = mysql-bin.000004\ncanal.instance.master.position = 154\ncanal.instance.master.timestamp = \ncanal.instance.master.gtid = \n\n## 阿里云数据库二进制日志OSS\ncanal.instance.rds.accesskey = \ncanal.instance.rds.secretkey = \ncanal.instance.rds.instanceId = \n\n## 主库同步账号\ncanal.instance.dbUsername = reader\ncanal.instance.dbPassword = 123456\ncanal.instance.connectionCharset = UTF-8\n\n## 主库同步过滤规则\ncanal.instance.filter.regex = sample\\\\..*\ncanal.instance.filter.black.regex = \n\n## 同步消息队列\ncanal.mq.topic = sample-topic\ncanal.mq.partition = 0\n','9cc91e1e60577eda77522c29fa2ab455','1','2023-04-12 18:50:34.689')
    *************************** 6. row ***************************
       Log_name: mysql-bin.000004
            Pos: 1289
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 1377
           Info: table_id: 114 (canal_manager.canal_instance_config)
    *************************** 7. row ***************************
       Log_name: mysql-bin.000004
            Pos: 1377
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 2207
           Info: table_id: 114 flags: STMT_END_F
    *************************** 8. row ***************************
       Log_name: mysql-bin.000004
            Pos: 2207
     Event_type: Xid
      Server_id: 1
    End_log_pos: 2238
           Info: COMMIT /* xid=13271 */
    *************************** 9. row ***************************
       Log_name: mysql-bin.000004
            Pos: 2238
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 2303
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 10. row ***************************
       Log_name: mysql-bin.000004
            Pos: 2303
     Event_type: Query
      Server_id: 1
    End_log_pos: 3719
           Info: use `canal_tsdb`; CREATE TABLE IF NOT EXISTS `meta_history` (
      `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
      `gmt_create` datetime NOT NULL COMMENT '创建时间',
      `gmt_modified` datetime NOT NULL COMMENT '修改时间',
      `destination` varchar(128) DEFAULT NULL COMMENT '通道名称',
      `binlog_file` varchar(64) DEFAULT NULL COMMENT 'binlog文件名',
      `binlog_offest` bigint(20) DEFAULT NULL COMMENT 'binlog偏移量',
      `binlog_master_id` varchar(64) DEFAULT NULL COMMENT 'binlog节点id',
      `binlog_timestamp` bigint(20) DEFAULT NULL COMMENT 'binlog应用的时间戳',
      `use_schema` varchar(1024) DEFAULT NULL COMMENT '执行sql时对应的schema',
      `sql_schema` varchar(1024) DEFAULT NULL COMMENT '对应的schema',
      `sql_table` varchar(1024) DEFAULT NULL COMMENT '对应的table',
      `sql_text` longtext DEFAULT NULL COMMENT '执行的sql',
      `sql_type` varchar(256) DEFAULT NULL COMMENT 'sql类型',
      `extra` text DEFAULT NULL COMMENT '额外的扩展信息',
      PRIMARY KEY (`id`),
      UNIQUE KEY binlog_file_offest(`destination`,`binlog_master_id`,`binlog_file`,`binlog_offest`),
      KEY `destination` (`destination`),
      KEY `destination_timestamp` (`destination`,`binlog_timestamp`),
      KEY `gmt_modified` (`gmt_modified`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='表结构变化明细表'
    *************************** 11. row ***************************
       Log_name: mysql-bin.000004
            Pos: 3719
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 3784
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 12. row ***************************
       Log_name: mysql-bin.000004
            Pos: 3784
     Event_type: Query
      Server_id: 1
    End_log_pos: 4926
           Info: use `canal_tsdb`; CREATE TABLE IF NOT EXISTS `meta_snapshot` (
      `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
      `gmt_create` datetime NOT NULL COMMENT '创建时间',
      `gmt_modified` datetime NOT NULL COMMENT '修改时间',
      `destination` varchar(128) DEFAULT NULL COMMENT '通道名称',
      `binlog_file` varchar(64) DEFAULT NULL COMMENT 'binlog文件名',
      `binlog_offest` bigint(20) DEFAULT NULL COMMENT 'binlog偏移量',
      `binlog_master_id` varchar(64) DEFAULT NULL COMMENT 'binlog节点id',
      `binlog_timestamp` bigint(20) DEFAULT NULL COMMENT 'binlog应用的时间戳',
      `data` longtext DEFAULT NULL COMMENT '表结构数据',
      `extra` text DEFAULT NULL COMMENT '额外的扩展信息',
      PRIMARY KEY (`id`),
      UNIQUE KEY binlog_file_offest(`destination`,`binlog_master_id`,`binlog_file`,`binlog_offest`),
      KEY `destination` (`destination`),
      KEY `destination_timestamp` (`destination`,`binlog_timestamp`),
      KEY `gmt_modified` (`gmt_modified`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='表结构记录表快照表'
    *************************** 13. row ***************************
       Log_name: mysql-bin.000004
            Pos: 4926
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 4991
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 14. row ***************************
       Log_name: mysql-bin.000004
            Pos: 4991
     Event_type: Query
      Server_id: 1
    End_log_pos: 5077
           Info: BEGIN
    *************************** 15. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5077
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 5359
           Info: # insert into meta_snapshot (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,data,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','0',0,'-1',-2,'{}',null)
    *************************** 16. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5359
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 5441
           Info: table_id: 116 (canal_tsdb.meta_snapshot)
    *************************** 17. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5441
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 5541
           Info: table_id: 116 flags: STMT_END_F
    *************************** 18. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5541
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5572
           Info: COMMIT /* xid=13395 */
    *************************** 19. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5572
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5637
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 20. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5637
     Event_type: Query
      Server_id: 1
    End_log_pos: 5737
           Info: create database sample
    *************************** 21. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5737
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5802
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 22. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5802
     Event_type: Query
      Server_id: 1
    End_log_pos: 5888
           Info: BEGIN
    *************************** 23. row ***************************
       Log_name: mysql-bin.000004
            Pos: 5888
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 6293
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000004',5637,'1',1681298791000,'sample','sample',null,'create database sample','QUERY',null)
    *************************** 24. row ***************************
       Log_name: mysql-bin.000004
            Pos: 6293
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 6386
           Info: table_id: 117 (canal_tsdb.meta_history)
    *************************** 25. row ***************************
       Log_name: mysql-bin.000004
            Pos: 6386
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 6543
           Info: table_id: 117 flags: STMT_END_F
    *************************** 26. row ***************************
       Log_name: mysql-bin.000004
            Pos: 6543
     Event_type: Xid
      Server_id: 1
    End_log_pos: 6574
           Info: COMMIT /* xid=39259 */
    *************************** 27. row ***************************
       Log_name: mysql-bin.000004
            Pos: 6574
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6639
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 28. row ***************************
       Log_name: mysql-bin.000004
            Pos: 6639
     Event_type: Query
      Server_id: 1
    End_log_pos: 7470
           Info: use `sample`; CREATE TABLE user (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户'
    *************************** 29. row ***************************
       Log_name: mysql-bin.000004
            Pos: 7470
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 7535
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 30. row ***************************
       Log_name: mysql-bin.000004
            Pos: 7535
     Event_type: Query
      Server_id: 1
    End_log_pos: 7621
           Info: BEGIN
    *************************** 31. row ***************************
       Log_name: mysql-bin.000004
            Pos: 7621
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 8793
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000004',6639,'1',1681299204000,'sample','sample','user','CREATE TABLE user (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT \'ID\',\n  username varchar(32) NOT NULL COMMENT \'用户名\',\n  password varchar(32) NOT NULL COMMENT \'用户密码\',\n  nickname varchar(32) NOT NULL COMMENT \'用户昵称\',\n  telephone bigint(20) unsigned NOT NULL COMMENT \'用户手机\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'用户状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT \'用户名唯一索引\'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'用户\'','CREATE',null)
    *************************** 32. row ***************************
       Log_name: mysql-bin.000004
            Pos: 8793
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 8886
           Info: table_id: 117 (canal_tsdb.meta_history)
    *************************** 33. row ***************************
       Log_name: mysql-bin.000004
            Pos: 8886
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 9781
           Info: table_id: 117 flags: STMT_END_F
    *************************** 34. row ***************************
       Log_name: mysql-bin.000004
            Pos: 9781
     Event_type: Xid
      Server_id: 1
    End_log_pos: 9812
           Info: COMMIT /* xid=44313 */
    *************************** 35. row ***************************
       Log_name: mysql-bin.000004
            Pos: 9812
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 9877
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 36. row ***************************
       Log_name: mysql-bin.000004
            Pos: 9877
     Event_type: Query
      Server_id: 1
    End_log_pos: 9951
           Info: BEGIN
    *************************** 37. row ***************************
       Log_name: mysql-bin.000004
            Pos: 9951
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 10173
           Info: # INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00')
    *************************** 38. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10173
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 10237
           Info: table_id: 118 (sample.user)
    *************************** 39. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10237
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 10324
           Info: table_id: 118 flags: STMT_END_F
    *************************** 40. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10324
     Event_type: Xid
      Server_id: 1
    End_log_pos: 10355
           Info: COMMIT /* xid=45761 */
    *************************** 41. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10355
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 10420
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 42. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10420
     Event_type: Query
      Server_id: 1
    End_log_pos: 10494
           Info: BEGIN
    *************************** 43. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10494
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 10715
           Info: # INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26')
    *************************** 44. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10715
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 10779
           Info: table_id: 118 (sample.user)
    *************************** 45. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10779
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 10865
           Info: table_id: 118 flags: STMT_END_F
    *************************** 46. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10865
     Event_type: Xid
      Server_id: 1
    End_log_pos: 10896
           Info: COMMIT /* xid=45933 */
    *************************** 47. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10896
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 10961
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 48. row ***************************
       Log_name: mysql-bin.000004
            Pos: 10961
     Event_type: Query
      Server_id: 1
    End_log_pos: 11043
           Info: BEGIN
    *************************** 49. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11043
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 11243
           Info: # INSERT INTO user(username, password, nickname, telephone, status) VALUES
    ('admin1', '123456', '管理员1', 13512345678, 0),
    ('admin2', '123456', '管理员2', 13512345678, 0)
    *************************** 50. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11243
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 11307
           Info: table_id: 118 (sample.user)
    *************************** 51. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11307
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 11454
           Info: table_id: 118 flags: STMT_END_F
    *************************** 52. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11454
     Event_type: Xid
      Server_id: 1
    End_log_pos: 11485
           Info: COMMIT /* xid=50365 */
    *************************** 53. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11485
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 11550
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 54. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11550
     Event_type: Query
      Server_id: 1
    End_log_pos: 11632
           Info: BEGIN
    *************************** 55. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11632
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 11718
           Info: # UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%'
    *************************** 56. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11718
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 11782
           Info: table_id: 118 (sample.user)
    *************************** 57. row ***************************
       Log_name: mysql-bin.000004
            Pos: 11782
     Event_type: Update_rows
      Server_id: 1
    End_log_pos: 12038
           Info: table_id: 118 flags: STMT_END_F
    *************************** 58. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12038
     Event_type: Xid
      Server_id: 1
    End_log_pos: 12069
           Info: COMMIT /* xid=50426 */
    *************************** 59. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12069
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 12134
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 60. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12134
     Event_type: Query
      Server_id: 1
    End_log_pos: 12208
           Info: BEGIN
    *************************** 61. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12208
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 12277
           Info: # DELETE FROM user WHERE username LIKE 'admin%'
    *************************** 62. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12277
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 12341
           Info: table_id: 118 (sample.user)
    *************************** 63. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12341
     Event_type: Delete_rows
      Server_id: 1
    End_log_pos: 12484
           Info: table_id: 118 flags: STMT_END_F
    *************************** 64. row ***************************
       Log_name: mysql-bin.000004
            Pos: 12484
     Event_type: Xid
      Server_id: 1
    End_log_pos: 12515
           Info: COMMIT /* xid=50539 */
    64 rows in set (0.01 sec)

## 查看 ZooKeeper 数据

查看实例当前的主库同步位点信息：

    [zk: localhost:2181(CONNECTED) 12] get /otter/canal/destinations/sample-instance/1001/cursor
    {
        "@type": "com.alibaba.otter.canal.protocol.position.LogPosition",
        "identity": {
            "slaveId": -1,
            "sourceAddress": {
                "address": "mysql-33071-master",
                "port": 3306
            }
        },
        "postion": {
            "gtid": "",
            "included": false,
            "journalName": "mysql-bin.000004",
            "position": 12484,
            "serverId": 1,
            "timestamp": 1681299716000
        }
    }

当前的同步位点 `"position": 12484` 是主库的最后一个二进制日志事件的开始位置。

## 查看 RocketMQ 消息

### 消息00

    // 消息 ID
    7F00000100571D9B7CCE3CB115430000 | sample-tag | 2023-04-12 18:50:38
    
    // 对应 SQL
    创建实例配置的时候插入canal_manager库数据
    
    {
        "data": null,
        "database": "",
        "es": 1681296634000,
        "id": 1,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "insert into canal_instance_config (cluster_id, server_id, name, content, content_md5, status, modified_time) values (1,null,'sample-instance','## 主库同步点位\\ncanal.instance.gtidon = false\\ncanal.instance.master.address = mysql-33071-master:3306\\ncanal.instance.master.journal.name = mysql-bin.000004\\ncanal.instance.master.position = 154\\ncanal.instance.master.timestamp = \\ncanal.instance.master.gtid = \\n\\n## 阿里云数据库二进制日志OSS\\ncanal.instance.rds.accesskey = \\ncanal.instance.rds.secretkey = \\ncanal.instance.rds.instanceId = \\n\\n## 主库同步账号\\ncanal.instance.dbUsername = reader\\ncanal.instance.dbPassword = 123456\\ncanal.instance.connectionCharset = UTF-8\\n\\n## 主库同步过滤规则\\ncanal.instance.filter.regex = sample\\\\\\\\..*\\ncanal.instance.filter.black.regex = \\n\\n## 同步消息队列\\ncanal.mq.topic = sample-topic\\ncanal.mq.partition = 0\\n','9cc91e1e60577eda77522c29fa2ab455','1','2023-04-12 18:50:34.689')",
        "sqlType": null,
        "table": "canal_instance_config",
        "ts": 1681296638252,
        "type": "QUERY"
    }

### 消息01

    // 消息 ID
    7F00000100571D9B7CCE3CB1159C0001 | sample-tag | 2023-04-12 18:50:38

    // 对应 SQL
    创建实例配置的时候插入canal_tsdb库数据

    {
        "data": null,
        "database": "",
        "es": 1681296637000,
        "id": 1,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "insert into meta_snapshot ( \n         \n\t\tgmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,data,extra\n         \n     )\n        values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','0',0,'-1',-2,'{}',null)",
        "sqlType": null,
        "table": "meta_snapshot",
        "ts": 1681296638253,
        "type": "QUERY"
    }

### 消息02

    // 消息 ID
    7F00000100571D9B7CCE3CD1F0B00002 | sample-tag | 2023-04-12 19:26:31

    // 对应 SQL
    create database sample;

    {
        "data": null,
        "database": "sample",
        "es": 1681298791000,
        "id": 2,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "create database sample",
        "sqlType": null,
        "table": "",
        "ts": 1681298791599,
        "type": "QUERY"
    }

### 消息03

    // 消息 ID
    7F00000100571D9B7CCE3CD1F0B00003 | sample-tag | 2023-04-12 19:26:31

    // 对应 SQL
    创建数据库sample插入canal_tsdb库数据

    {
        "data": null,
        "database": "",
        "es": 1681298791000,
        "id": 2,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "insert into meta_history ( \n         \n\t\tgmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra\n         \n     )\n        values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000004',5637,'1',1681298791000,'sample','sample',null,'create database sample','QUERY',null)",
        "sqlType": null,
        "table": "meta_history",
        "ts": 1681298791599,
        "type": "QUERY"
    }

### 消息04

    // 消息 ID
    7F00000100571D9B7CCE3CD840400004 | sample-tag | 2023-04-12 19:33:25

    // 对应 SQL
    CREATE TABLE user (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';

    {
        "data": null,
        "database": "sample",
        "es": 1681299204000,
        "id": 3,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "CREATE TABLE user (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',\n  username varchar(32) NOT NULL COMMENT '用户名',\n  password varchar(32) NOT NULL COMMENT '用户密码',\n  nickname varchar(32) NOT NULL COMMENT '用户昵称',\n  telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',\n  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户'",
        "sqlType": null,
        "table": "user",
        "ts": 1681299205183,
        "type": "CREATE"
    }

### 消息05

    // 消息 ID
    7F00000100571D9B7CCE3CD840400005 | sample-tag | 2023-04-12 19:33:25

    // 对应 SQL
    创建表user插入canal_tsdb库数据

    {
        "data": null,
        "database": "",
        "es": 1681299205000,
        "id": 3,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "insert into meta_history ( \n         \n\t\tgmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra\n         \n     )\n        values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000004',6639,'1',1681299204000,'sample','sample','user','CREATE TABLE user (\\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT \\'ID\\',\\n  username varchar(32) NOT NULL COMMENT \\'用户名\\',\\n  password varchar(32) NOT NULL COMMENT \\'用户密码\\',\\n  nickname varchar(32) NOT NULL COMMENT \\'用户昵称\\',\\n  telephone bigint(20) unsigned NOT NULL COMMENT \\'用户手机\\',\\n  status int(20) NOT NULL DEFAULT \\'0\\' COMMENT \\'用户状态 0-正常 1-禁用\\',\\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \\'创建时间\\',\\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \\'更新时间\\',\\n  PRIMARY KEY (id) USING BTREE,\\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT \\'用户名唯一索引\\'\\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\\'用户\\'','CREATE',null)",
        "sqlType": null,
        "table": "meta_history",
        "ts": 1681299205183,
        "type": "QUERY"
    }

### 消息06

    // 消息 ID
    7F00000100571D9B7CCE3CDA0E300006 | sample-tag | 2023-04-12 19:35:23

    // 对应 SQL
    INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00');

    {
        "data": null,
        "database": "",
        "es": 1681299323000,
        "id": 4,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00')",
        "sqlType": null,
        "table": "user",
        "ts": 1681299323440,
        "type": "QUERY"
    }

### 消息07

    // 消息 ID
    7F00000100571D9B7CCE3CDA0E9A0007 | sample-tag | 2023-04-12 19:35:23

    // 对应 SQL
    INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00');

    {
        "data": [
            {
                "id": "1",
                "username": "master",
                "password": "123456",
                "nickname": "主人",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-03-30 19:02:40",
                "update_time": "2023-03-30 19:19:00"
            }
        ],
        "database": "sample",
        "es": 1681299323000,
        "id": 5,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "username": "varchar(32)",
            "password": "varchar(32)",
            "nickname": "varchar(32)",
            "telephone": "bigint(20) unsigned",
            "status": "int(20)",
            "create_time": "datetime",
            "update_time": "datetime"
        },
        "old": null,
        "pkNames": [
            "id"
        ],
        "sql": "",
        "sqlType": {
            "id": -5,
            "username": 12,
            "password": 12,
            "nickname": 12,
            "telephone": -5,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "user",
        "ts": 1681299323545,
        "type": "INSERT"
    }

### 消息08

    // 消息 ID
    7F00000100571D9B7CCE3CDA44F60008 | sample-tag | 2023-04-12 19:35:37

    // 对应 SQL
    INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26');

    {
        "data": null,
        "database": "",
        "es": 1681299337000,
        "id": 6,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26')",
        "sqlType": null,
        "table": "user",
        "ts": 1681299337461,
        "type": "QUERY"
    }

### 消息09

    // 消息 ID
    7F00000100571D9B7CCE3CDA44F60009 | sample-tag | 2023-04-12 19:35:37

    // 对应 SQL
    INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26');

    {
        "data": [
            {
                "id": "2",
                "username": "slave",
                "password": "123456",
                "nickname": "仆人",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-03-30 19:19:26",
                "update_time": "2023-03-30 19:19:26"
            }
        ],
        "database": "sample",
        "es": 1681299337000,
        "id": 6,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "username": "varchar(32)",
            "password": "varchar(32)",
            "nickname": "varchar(32)",
            "telephone": "bigint(20) unsigned",
            "status": "int(20)",
            "create_time": "datetime",
            "update_time": "datetime"
        },
        "old": null,
        "pkNames": [
            "id"
        ],
        "sql": "",
        "sqlType": {
            "id": -5,
            "username": 12,
            "password": 12,
            "nickname": 12,
            "telephone": -5,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "user",
        "ts": 1681299337461,
        "type": "INSERT"
    }

### 消息0A

    // 消息 ID
    7F00000100571D9B7CCE3CDFDBE9000A | sample-tag | 2023-04-12 19:41:43

    // 对应 SQL
    INSERT INTO user(username, password, nickname, telephone, status) VALUES 
    ('admin1', '123456', '管理员1', 13512345678, 0),
    ('admin2', '123456', '管理员2', 13512345678, 0);

    {
        "data": null,
        "database": "",
        "es": 1681299703000,
        "id": 7,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "INSERT INTO user(username, password, nickname, telephone, status) VALUES \n('admin1', '123456', '管理员1', 13512345678, 0),\n('admin2', '123456', '管理员2', 13512345678, 0)",
        "sqlType": null,
        "table": "user",
        "ts": 1681299703785,
        "type": "QUERY"
    }

### 消息0B

    // 消息 ID
    7F00000100571D9B7CCE3CDFDBE9000B | sample-tag | 2023-04-12 19:41:43

    // 对应 SQL
    INSERT INTO user(username, password, nickname, telephone, status) VALUES 
    ('admin1', '123456', '管理员1', 13512345678, 0),
    ('admin2', '123456', '管理员2', 13512345678, 0);

    {
        "data": [
            {
                "id": "3",
                "username": "admin1",
                "password": "123456",
                "nickname": "管理员1",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-12 19:41:43",
                "update_time": "2023-04-12 19:41:43"
            },
            {
                "id": "4",
                "username": "admin2",
                "password": "123456",
                "nickname": "管理员2",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-12 19:41:43",
                "update_time": "2023-04-12 19:41:43"
            }
        ],
        "database": "sample",
        "es": 1681299703000,
        "id": 7,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "username": "varchar(32)",
            "password": "varchar(32)",
            "nickname": "varchar(32)",
            "telephone": "bigint(20) unsigned",
            "status": "int(20)",
            "create_time": "datetime",
            "update_time": "datetime"
        },
        "old": null,
        "pkNames": [
            "id"
        ],
        "sql": "",
        "sqlType": {
            "id": -5,
            "username": 12,
            "password": 12,
            "nickname": 12,
            "telephone": -5,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "user",
        "ts": 1681299703785,
        "type": "INSERT"
    }

### 消息0C

    // 消息 ID
    7F00000100571D9B7CCE3CDFEFDE000C | sample-tag | 2023-04-12 19:41:48

    // 对应 SQL
    UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';

    {
        "data": null,
        "database": "",
        "es": 1681299708000,
        "id": 8,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%'",
        "sqlType": null,
        "table": "user",
        "ts": 1681299708894,
        "type": "QUERY"
    }

### 消息0D

    // 消息 ID
    7F00000100571D9B7CCE3CDFEFDE000D | sample-tag | 2023-04-12 19:41:48

    // 对应 SQL
    UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';

    {
        "data": [
            {
                "id": "3",
                "username": "admin1",
                "password": "abcd",
                "nickname": "管理员1",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-12 19:41:43",
                "update_time": "2023-04-12 19:41:48"
            },
            {
                "id": "4",
                "username": "admin2",
                "password": "abcd",
                "nickname": "管理员2",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-12 19:41:43",
                "update_time": "2023-04-12 19:41:48"
            }
        ],
        "database": "sample",
        "es": 1681299708000,
        "id": 8,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "username": "varchar(32)",
            "password": "varchar(32)",
            "nickname": "varchar(32)",
            "telephone": "bigint(20) unsigned",
            "status": "int(20)",
            "create_time": "datetime",
            "update_time": "datetime"
        },
        "old": [
            {
                "password": "123456",
                "update_time": "2023-04-12 19:41:43"
            },
            {
                "password": "123456",
                "update_time": "2023-04-12 19:41:43"
            }
        ],
        "pkNames": [
            "id"
        ],
        "sql": "",
        "sqlType": {
            "id": -5,
            "username": 12,
            "password": 12,
            "nickname": 12,
            "telephone": -5,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "user",
        "ts": 1681299708894,
        "type": "UPDATE"
    }

### 消息0E

    // 消息 ID
    7F00000100571D9B7CCE3CE00EC6000E | sample-tag | 2023-04-12 19:41:56

    // 对应 SQL
    DELETE FROM user WHERE username LIKE 'admin%';

    {
        "data": null,
        "database": "",
        "es": 1681299716000,
        "id": 9,
        "isDdl": false,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "DELETE FROM user WHERE username LIKE 'admin%'",
        "sqlType": null,
        "table": "user",
        "ts": 1681299716805,
        "type": "QUERY"
    }

### 消息0F

    // 消息 ID
    7F00000100571D9B7CCE3CE00EC6000F | sample-tag | 2023-04-12 19:41:56
    
    // 对应 SQL
    DELETE FROM user WHERE username LIKE 'admin%';
    
    {
        "data": [
            {
                "id": "3",
                "username": "admin1",
                "password": "abcd",
                "nickname": "管理员1",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-12 19:41:43",
                "update_time": "2023-04-12 19:41:48"
            },
            {
                "id": "4",
                "username": "admin2",
                "password": "abcd",
                "nickname": "管理员2",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-12 19:41:43",
                "update_time": "2023-04-12 19:41:48"
            }
        ],
        "database": "sample",
        "es": 1681299716000,
        "id": 9,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "username": "varchar(32)",
            "password": "varchar(32)",
            "nickname": "varchar(32)",
            "telephone": "bigint(20) unsigned",
            "status": "int(20)",
            "create_time": "datetime",
            "update_time": "datetime"
        },
        "old": null,
        "pkNames": [
            "id"
        ],
        "sql": "",
        "sqlType": {
            "id": -5,
            "username": 12,
            "password": 12,
            "nickname": 12,
            "telephone": -5,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "user",
        "ts": 1681299716805,
        "type": "DELETE"
    }


其中的 `QUERY` 类型的消息是二进制日志配置 `binlog-rows-query-log-events=TRUE` 产生的事件，可以通过如下方式过滤：

    canal.instance.filter.query.dml = false


# 完