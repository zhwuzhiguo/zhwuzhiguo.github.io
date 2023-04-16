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

7. 创建另一个表

       CREATE TABLE `region` (
         `id` bigint(20) unsigned NOT NULL COMMENT 'ID',
         `name` varchar(256) NOT NULL COMMENT '名称',
         `address` varchar(256) NOT NULL COMMENT '地址',
         `status` int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
         `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
         `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
         PRIMARY KEY (`id`) USING BTREE
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地区';

8. 再插入2行记录

       INSERT INTO region(id, name, address) VALUES (1, '北京', '中国北京市');
       INSERT INTO region(id, name, address) VALUES (2, '上海', '中国上海市');


### 执行记录

    mysql> create database sample;
    Query OK, 1 row affected (0.00 sec)
    
    mysql> use sample;
    Database changed
    mysql>
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
    Query OK, 0 rows affected (0.02 sec)
    
    mysql> INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00');
    Query OK, 1 row affected (0.00 sec)
    
    mysql> INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26');
    Query OK, 1 row affected (0.00 sec)
    
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES
        -> ('admin1', '123456', '管理员1', 13512345678, 0),
        -> ('admin2', '123456', '管理员2', 13512345678, 0);
    Query OK, 2 rows affected (0.00 sec)
    Records: 2  Duplicates: 0  Warnings: 0
    
    mysql> UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';
    Query OK, 2 rows affected (0.00 sec)
    Rows matched: 2  Changed: 2  Warnings: 0
    
    mysql> DELETE FROM user WHERE username LIKE 'admin%';
    Query OK, 2 rows affected (0.01 sec)
    
    mysql> CREATE TABLE `region` (
        ->   `id` bigint(20) unsigned NOT NULL COMMENT 'ID',
        ->   `name` varchar(256) NOT NULL COMMENT '名称',
        ->   `address` varchar(256) NOT NULL COMMENT '地址',
        ->   `status` int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
        ->   `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        ->   `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        ->   PRIMARY KEY (`id`) USING BTREE
        -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地区';
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> INSERT INTO region(id, name, address) VALUES (1, '北京', '中国北京市');
    Query OK, 1 row affected (0.01 sec)
    
    mysql> INSERT INTO region(id, name, address) VALUES (2, '上海', '中国上海市');
    Query OK, 1 row affected (0.01 sec)


### 主库的二进制日志信息

    mysql> select * from user;
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname | telephone   | status | create_time         | update_time         |
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    |  1 | master   | 123456   | 主人     | 13512345678 |      0 | 2023-03-30 19:02:40 | 2023-03-30 19:19:00 |
    |  2 | slave    | 123456   | 仆人     | 13512345678 |      0 | 2023-03-30 19:19:26 | 2023-03-30 19:19:26 |
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    2 rows in set (0.00 sec)
    
    mysql> select * from region;
    +----+--------+-----------------+--------+---------------------+---------------------+
    | id | name   | address         | status | create_time         | update_time         |
    +----+--------+-----------------+--------+---------------------+---------------------+
    |  1 | 北京   | 中国北京市      |      0 | 2023-04-16 22:12:18 | 2023-04-16 22:12:18 |
    |  2 | 上海   | 中国上海市      |      0 | 2023-04-16 22:12:59 | 2023-04-16 22:12:59 |
    +----+--------+-----------------+--------+---------------------+---------------------+
    2 rows in set (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000006 |    15962 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    mysql> show binary logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   7828591 |
    | mysql-bin.000003 |     50409 |
    | mysql-bin.000004 |    188728 |
    | mysql-bin.000005 |     30740 |
    | mysql-bin.000006 |     15962 |
    +------------------+-----------+
    6 rows in set (0.00 sec)

### 最后一个二进制日志文件的事件列表

    mysql> show binlog events in 'mysql-bin.000006' \G
    *************************** 1. row ***************************
       Log_name: mysql-bin.000006
            Pos: 4
     Event_type: Format_desc
      Server_id: 1
    End_log_pos: 123
           Info: Server ver: 5.7.41-log, Binlog ver: 4
    *************************** 2. row ***************************
       Log_name: mysql-bin.000006
            Pos: 123
     Event_type: Previous_gtids
      Server_id: 1
    End_log_pos: 154
           Info:
    *************************** 3. row ***************************
       Log_name: mysql-bin.000006
            Pos: 154
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 219
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 4. row ***************************
       Log_name: mysql-bin.000006
            Pos: 219
     Event_type: Query
      Server_id: 1
    End_log_pos: 308
           Info: BEGIN
    *************************** 5. row ***************************
       Log_name: mysql-bin.000006
            Pos: 308
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 1287
           Info: # insert into canal_instance_config (cluster_id, server_id, name, content, content_md5, status, modified_time) values (1,null,'sample-instance','## 主库同步点位\ncanal.instance.gtidon = false\ncanal.instance.master.address = mysql-33071-master:3306\ncanal.instance.master.journal.name = mysql-bin.000006\ncanal.instance.master.position = 154\ncanal.instance.master.timestamp = \ncanal.instance.master.gtid = \n\n## 阿里云数据库二进制日志OSS\ncanal.instance.rds.accesskey = \ncanal.instance.rds.secretkey = \ncanal.instance.rds.instanceId = \n\n## 主库同步账号\ncanal.instance.dbUsername = reader\ncanal.instance.dbPassword = 123456\ncanal.instance.connectionCharset = UTF-8\n\n## 主库同步过滤规则\ncanal.instance.filter.regex = sample\\\\..*\ncanal.instance.filter.black.regex = \n\n## 同步消息队列\ncanal.mq.topic = sample-topic\ncanal.mq.partition = 0\n','fef7f1bddb069b226abe175e60b8a4e8','1','2023-04-16 21:42:22.2')
    *************************** 6. row ***************************
       Log_name: mysql-bin.000006
            Pos: 1287
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 1375
           Info: table_id: 128 (canal_manager.canal_instance_config)
    *************************** 7. row ***************************
       Log_name: mysql-bin.000006
            Pos: 1375
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 2205
           Info: table_id: 128 flags: STMT_END_F
    *************************** 8. row ***************************
       Log_name: mysql-bin.000006
            Pos: 2205
     Event_type: Xid
      Server_id: 1
    End_log_pos: 2236
           Info: COMMIT /* xid=3557142 */
    *************************** 9. row ***************************
       Log_name: mysql-bin.000006
            Pos: 2236
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 2301
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 10. row ***************************
       Log_name: mysql-bin.000006
            Pos: 2301
     Event_type: Query
      Server_id: 1
    End_log_pos: 3717
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
       Log_name: mysql-bin.000006
            Pos: 3717
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 3782
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 12. row ***************************
       Log_name: mysql-bin.000006
            Pos: 3782
     Event_type: Query
      Server_id: 1
    End_log_pos: 4924
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
       Log_name: mysql-bin.000006
            Pos: 4924
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 4989
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 14. row ***************************
       Log_name: mysql-bin.000006
            Pos: 4989
     Event_type: Query
      Server_id: 1
    End_log_pos: 5075
           Info: BEGIN
    *************************** 15. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5075
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 5357
           Info: # insert into meta_snapshot (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,data,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','0',0,'-1',-2,'{}',null)
    *************************** 16. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5357
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 5439
           Info: table_id: 130 (canal_tsdb.meta_snapshot)
    *************************** 17. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5439
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 5539
           Info: table_id: 130 flags: STMT_END_F
    *************************** 18. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5539
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5570
           Info: COMMIT /* xid=3557271 */
    *************************** 19. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5570
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5635
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 20. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5635
     Event_type: Query
      Server_id: 1
    End_log_pos: 5735
           Info: create database sample
    *************************** 21. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5735
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5800
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 22. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5800
     Event_type: Query
      Server_id: 1
    End_log_pos: 5886
           Info: BEGIN
    *************************** 23. row ***************************
       Log_name: mysql-bin.000006
            Pos: 5886
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 6291
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000006',5635,'1',1681652943000,'sample','sample',null,'create database sample','QUERY',null)
    *************************** 24. row ***************************
       Log_name: mysql-bin.000006
            Pos: 6291
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 6384
           Info: table_id: 131 (canal_tsdb.meta_history)
    *************************** 25. row ***************************
       Log_name: mysql-bin.000006
            Pos: 6384
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 6541
           Info: table_id: 131 flags: STMT_END_F
    *************************** 26. row ***************************
       Log_name: mysql-bin.000006
            Pos: 6541
     Event_type: Xid
      Server_id: 1
    End_log_pos: 6572
           Info: COMMIT /* xid=3562322 */
    *************************** 27. row ***************************
       Log_name: mysql-bin.000006
            Pos: 6572
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6637
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 28. row ***************************
       Log_name: mysql-bin.000006
            Pos: 6637
     Event_type: Query
      Server_id: 1
    End_log_pos: 7468
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
       Log_name: mysql-bin.000006
            Pos: 7468
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 7533
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 30. row ***************************
       Log_name: mysql-bin.000006
            Pos: 7533
     Event_type: Query
      Server_id: 1
    End_log_pos: 7619
           Info: BEGIN
    *************************** 31. row ***************************
       Log_name: mysql-bin.000006
            Pos: 7619
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 8791
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000006',6637,'1',1681653187000,'sample','sample','user','CREATE TABLE user (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT \'ID\',\n  username varchar(32) NOT NULL COMMENT \'用户名\',\n  password varchar(32) NOT NULL COMMENT \'用户密码\',\n  nickname varchar(32) NOT NULL COMMENT \'用户昵称\',\n  telephone bigint(20) unsigned NOT NULL COMMENT \'用户手机\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'用户状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT \'用户名唯一索引\'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'用户\'','CREATE',null)
    *************************** 32. row ***************************
       Log_name: mysql-bin.000006
            Pos: 8791
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 8884
           Info: table_id: 131 (canal_tsdb.meta_history)
    *************************** 33. row ***************************
       Log_name: mysql-bin.000006
            Pos: 8884
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 9779
           Info: table_id: 131 flags: STMT_END_F
    *************************** 34. row ***************************
       Log_name: mysql-bin.000006
            Pos: 9779
     Event_type: Xid
      Server_id: 1
    End_log_pos: 9810
           Info: COMMIT /* xid=3565340 */
    *************************** 35. row ***************************
       Log_name: mysql-bin.000006
            Pos: 9810
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 9875
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 36. row ***************************
       Log_name: mysql-bin.000006
            Pos: 9875
     Event_type: Query
      Server_id: 1
    End_log_pos: 9949
           Info: BEGIN
    *************************** 37. row ***************************
       Log_name: mysql-bin.000006
            Pos: 9949
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 10171
           Info: # INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00')
    *************************** 38. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10171
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 10235
           Info: table_id: 132 (sample.user)
    *************************** 39. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10235
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 10322
           Info: table_id: 132 flags: STMT_END_F
    *************************** 40. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10322
     Event_type: Xid
      Server_id: 1
    End_log_pos: 10353
           Info: COMMIT /* xid=3566609 */
    *************************** 41. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10353
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 10418
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 42. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10418
     Event_type: Query
      Server_id: 1
    End_log_pos: 10492
           Info: BEGIN
    *************************** 43. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10492
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 10713
           Info: # INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26')
    *************************** 44. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10713
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 10777
           Info: table_id: 132 (sample.user)
    *************************** 45. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10777
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 10863
           Info: table_id: 132 flags: STMT_END_F
    *************************** 46. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10863
     Event_type: Xid
      Server_id: 1
    End_log_pos: 10894
           Info: COMMIT /* xid=3566780 */
    *************************** 47. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10894
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 10959
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 48. row ***************************
       Log_name: mysql-bin.000006
            Pos: 10959
     Event_type: Query
      Server_id: 1
    End_log_pos: 11041
           Info: BEGIN
    *************************** 49. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11041
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 11241
           Info: # INSERT INTO user(username, password, nickname, telephone, status) VALUES
    ('admin1', '123456', '管理员1', 13512345678, 0),
    ('admin2', '123456', '管理员2', 13512345678, 0)
    *************************** 50. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11241
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 11305
           Info: table_id: 132 (sample.user)
    *************************** 51. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11305
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 11452
           Info: table_id: 132 flags: STMT_END_F
    *************************** 52. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11452
     Event_type: Xid
      Server_id: 1
    End_log_pos: 11483
           Info: COMMIT /* xid=3567915 */
    *************************** 53. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11483
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 11548
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 54. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11548
     Event_type: Query
      Server_id: 1
    End_log_pos: 11630
           Info: BEGIN
    *************************** 55. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11630
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 11716
           Info: # UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%'
    *************************** 56. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11716
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 11780
           Info: table_id: 132 (sample.user)
    *************************** 57. row ***************************
       Log_name: mysql-bin.000006
            Pos: 11780
     Event_type: Update_rows
      Server_id: 1
    End_log_pos: 12036
           Info: table_id: 132 flags: STMT_END_F
    *************************** 58. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12036
     Event_type: Xid
      Server_id: 1
    End_log_pos: 12067
           Info: COMMIT /* xid=3568702 */
    *************************** 59. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12067
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 12132
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 60. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12132
     Event_type: Query
      Server_id: 1
    End_log_pos: 12206
           Info: BEGIN
    *************************** 61. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12206
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 12275
           Info: # DELETE FROM user WHERE username LIKE 'admin%'
    *************************** 62. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12275
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 12339
           Info: table_id: 132 (sample.user)
    *************************** 63. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12339
     Event_type: Delete_rows
      Server_id: 1
    End_log_pos: 12482
           Info: table_id: 132 flags: STMT_END_F
    *************************** 64. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12482
     Event_type: Xid
      Server_id: 1
    End_log_pos: 12513
           Info: COMMIT /* xid=3569327 */
    *************************** 65. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12513
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 12578
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 66. row ***************************
       Log_name: mysql-bin.000006
            Pos: 12578
     Event_type: Query
      Server_id: 1
    End_log_pos: 13198
           Info: use `sample`; CREATE TABLE `region` (
      `id` bigint(20) unsigned NOT NULL COMMENT 'ID',
      `name` varchar(256) NOT NULL COMMENT '名称',
      `address` varchar(256) NOT NULL COMMENT '地址',
      `status` int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
      `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (`id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地区'
    *************************** 67. row ***************************
       Log_name: mysql-bin.000006
            Pos: 13198
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 13263
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 68. row ***************************
       Log_name: mysql-bin.000006
            Pos: 13263
     Event_type: Query
      Server_id: 1
    End_log_pos: 13349
           Info: BEGIN
    *************************** 69. row ***************************
       Log_name: mysql-bin.000006
            Pos: 13349
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 14304
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000006',12578,'1',1681654040000,'sample','sample','region','CREATE TABLE `region` (\n  `id` bigint(20) unsigned NOT NULL COMMENT \'ID\',\n  `name` varchar(256) NOT NULL COMMENT \'名称\',\n  `address` varchar(256) NOT NULL COMMENT \'地址\',\n  `status` int(20) NOT NULL DEFAULT \'0\' COMMENT \'数据状态 0-正常 1-禁用\',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (`id`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'地区\'','CREATE',null)
    *************************** 70. row ***************************
       Log_name: mysql-bin.000006
            Pos: 14304
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 14397
           Info: table_id: 131 (canal_tsdb.meta_history)
    *************************** 71. row ***************************
       Log_name: mysql-bin.000006
            Pos: 14397
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 15083
           Info: table_id: 131 flags: STMT_END_F
    *************************** 72. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15083
     Event_type: Xid
      Server_id: 1
    End_log_pos: 15114
           Info: COMMIT /* xid=3575780 */
    *************************** 73. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15114
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 15179
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 74. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15179
     Event_type: Query
      Server_id: 1
    End_log_pos: 15261
           Info: BEGIN
    *************************** 75. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15261
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 15362
           Info: # INSERT INTO region(id, name, address) VALUES (1, '北京', '中国北京市')
    *************************** 76. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15362
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 15424
           Info: table_id: 133 (sample.region)
    *************************** 77. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15424
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 15507
           Info: table_id: 133 flags: STMT_END_F
    *************************** 78. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15507
     Event_type: Xid
      Server_id: 1
    End_log_pos: 15538
           Info: COMMIT /* xid=3579428 */
    *************************** 79. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15538
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 15603
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 80. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15603
     Event_type: Query
      Server_id: 1
    End_log_pos: 15685
           Info: BEGIN
    *************************** 81. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15685
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 15786
           Info: # INSERT INTO region(id, name, address) VALUES (2, '上海', '中国上海市')
    *************************** 82. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15786
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 15848
           Info: table_id: 133 (sample.region)
    *************************** 83. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15848
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 15931
           Info: table_id: 133 flags: STMT_END_F
    *************************** 84. row ***************************
       Log_name: mysql-bin.000006
            Pos: 15931
     Event_type: Xid
      Server_id: 1
    End_log_pos: 15962
           Info: COMMIT /* xid=3579912 */
    84 rows in set (0.00 sec)


## 查看 ZooKeeper 数据

查看实例当前的主库同步位点信息：

    [zk: localhost:2181(CONNECTED) 0] get /otter/canal/destinations/sample-instance/1001/cursor
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
            "journalName": "mysql-bin.000006",
            "position": 15931,
            "serverId": 1,
            "timestamp": 1681654379000
        }
    }

当前的同步位点 `"position": 15931` 是主库的最后一个二进制日志事件的开始位置。

## 查看 RocketMQ 消息

### 消息00

    // 消息 ID
    7F0000010C11150BF4F651EDDE960000 | sample-tag | 2023-04-16 21:49:03
    
    // 对应 SQL
    create database sample;
    
    {
        "data": null,
        "database": "sample",
        "es": 1681652943000,
        "id": 2,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "create database sample",
        "sqlType": null,
        "table": "",
        "ts": 1681652943498,
        "type": "QUERY"
    }

### 消息01

    // 消息 ID
    7F0000010C11150BF4F651F1997E0001 | sample-tag | 2023-04-16 21:53:07
    
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
        "es": 1681653187000,
        "id": 3,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "CREATE TABLE user (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',\n  username varchar(32) NOT NULL COMMENT '用户名',\n  password varchar(32) NOT NULL COMMENT '用户密码',\n  nickname varchar(32) NOT NULL COMMENT '用户昵称',\n  telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',\n  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户'",
        "sqlType": null,
        "table": "user",
        "ts": 1681653187966,
        "type": "CREATE"
    }

### 消息02

    // 消息 ID
    7F0000010C11150BF4F651F335560002 | sample-tag | 2023-04-16 21:54:53
    
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
        "es": 1681653293000,
        "id": 4,
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
        "ts": 1681653293397,
        "type": "INSERT"
    }

### 消息03

    // 消息 ID
    7F0000010C11150BF4F651F366390003 | sample-tag | 2023-04-16 21:55:05
    
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
        "es": 1681653305000,
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
        "ts": 1681653305913,
        "type": "INSERT"
    }

### 消息04

    // 消息 ID
    7F0000010C11150BF4F651F4CA970004 | sample-tag | 2023-04-16 21:56:37
    
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
                "create_time": "2023-04-16 21:56:37",
                "update_time": "2023-04-16 21:56:37"
            },
            {
                "id": "4",
                "username": "admin2",
                "password": "123456",
                "nickname": "管理员2",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-16 21:56:37",
                "update_time": "2023-04-16 21:56:37"
            }
        ],
        "database": "sample",
        "es": 1681653397000,
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
        "ts": 1681653397142,
        "type": "INSERT"
    }

### 消息05

    // 消息 ID
    7F0000010C11150BF4F651F5C7A20005 | sample-tag | 2023-04-16 21:57:41
    
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
                "create_time": "2023-04-16 21:56:37",
                "update_time": "2023-04-16 21:57:41"
            },
            {
                "id": "4",
                "username": "admin2",
                "password": "abcd",
                "nickname": "管理员2",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-16 21:56:37",
                "update_time": "2023-04-16 21:57:41"
            }
        ],
        "database": "sample",
        "es": 1681653461000,
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
        "old": [
            {
                "password": "123456",
                "update_time": "2023-04-16 21:56:37"
            },
            {
                "password": "123456",
                "update_time": "2023-04-16 21:56:37"
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
        "ts": 1681653461921,
        "type": "UPDATE"
    }

### 消息06

    // 消息 ID
    7F0000010C11150BF4F651F6983D0006 | sample-tag | 2023-04-16 21:58:35
    
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
                "create_time": "2023-04-16 21:56:37",
                "update_time": "2023-04-16 21:57:41"
            },
            {
                "id": "4",
                "username": "admin2",
                "password": "abcd",
                "nickname": "管理员2",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-16 21:56:37",
                "update_time": "2023-04-16 21:57:41"
            }
        ],
        "database": "sample",
        "es": 1681653515000,
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
        "ts": 1681653515325,
        "type": "DELETE"
    }

### 消息07

    // 消息 ID
    7F0000010C11150BF4F651FE9D4E0007 | sample-tag | 2023-04-16 22:07:20
    
    // 对应 SQL
    CREATE TABLE `region` (
      `id` bigint(20) unsigned NOT NULL COMMENT 'ID',
      `name` varchar(256) NOT NULL COMMENT '名称',
      `address` varchar(256) NOT NULL COMMENT '地址',
      `status` int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
      `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (`id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地区';
    
    {
        "data": null,
        "database": "sample",
        "es": 1681654040000,
        "id": 9,
        "isDdl": true,
        "mysqlType": null,
        "old": null,
        "pkNames": null,
        "sql": "CREATE TABLE `region` (\n  `id` bigint(20) unsigned NOT NULL COMMENT 'ID',\n  `name` varchar(256) NOT NULL COMMENT '名称',\n  `address` varchar(256) NOT NULL COMMENT '地址',\n  `status` int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (`id`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地区'",
        "sqlType": null,
        "table": "region",
        "ts": 1681654040910,
        "type": "CREATE"
    }

### 消息08

    // 消息 ID
    7F0000010C11150BF4F652032A240008 | sample-tag | 2023-04-16 22:12:19
    
    // 对应 SQL
    INSERT INTO region(id, name, address) VALUES (1, '北京', '中国北京市');
    
    {
        "data": [
            {
                "id": "1",
                "name": "北京",
                "address": "中国北京市",
                "status": "0",
                "create_time": "2023-04-16 22:12:18",
                "update_time": "2023-04-16 22:12:18"
            }
        ],
        "database": "sample",
        "es": 1681654338000,
        "id": 10,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "name": "varchar(256)",
            "address": "varchar(256)",
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
            "name": 12,
            "address": 12,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "region",
        "ts": 1681654339108,
        "type": "INSERT"
    }

### 消息09

    // 消息 ID
    7F0000010C11150BF4F65203C9530009 | sample-tag | 2023-04-16 22:12:59
    
    // 对应 SQL
    INSERT INTO region(id, name, address) VALUES (2, '上海', '中国上海市');
    
    {
        "data": [
            {
                "id": "2",
                "name": "上海",
                "address": "中国上海市",
                "status": "0",
                "create_time": "2023-04-16 22:12:59",
                "update_time": "2023-04-16 22:12:59"
            }
        ],
        "database": "sample",
        "es": 1681654379000,
        "id": 11,
        "isDdl": false,
        "mysqlType": {
            "id": "bigint(20) unsigned",
            "name": "varchar(256)",
            "address": "varchar(256)",
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
            "name": 12,
            "address": 12,
            "status": 4,
            "create_time": 93,
            "update_time": 93
        },
        "table": "region",
        "ts": 1681654379858,
        "type": "INSERT"
    }

以上消息中没有二进制日志配置 `binlog-rows-query-log-events=TRUE` 产生的事件对应的 `QUERY` 类型的消息，是通过如下配置过滤的：

    ## 过滤 QUERY 类型的日志
    canal.instance.filter.query.dml = true

# 完