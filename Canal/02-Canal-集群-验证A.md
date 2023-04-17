# 02-Canal-集群-验证A

全量同步验证：

验证已经搭建好的 `Canal` 集群，数据库更新操作同步消息到 `RocketMQ`。

## 执行数据库操作

先刷新一下二进制日志，启用一个新文件：

    mysql> flush logs;
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000009 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

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
    Query OK, 2 rows affected (0.01 sec)
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
    | mysql-bin.000009 |     7096 |              |                  |                   |
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
    | mysql-bin.000006 |     18288 |
    | mysql-bin.000007 |     30737 |
    | mysql-bin.000008 |      5619 |
    | mysql-bin.000009 |      7096 |
    +------------------+-----------+
    9 rows in set (0.00 sec)

### 最后一个二进制日志文件的事件列表

    mysql> show binlog events in 'mysql-bin.000009' \G
    *************************** 1. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4
     Event_type: Format_desc
      Server_id: 1
    End_log_pos: 123
           Info: Server ver: 5.7.41-log, Binlog ver: 4
    *************************** 2. row ***************************
       Log_name: mysql-bin.000009
            Pos: 123
     Event_type: Previous_gtids
      Server_id: 1
    End_log_pos: 154
           Info:
    *************************** 3. row ***************************
       Log_name: mysql-bin.000009
            Pos: 154
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 219
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 4. row ***************************
       Log_name: mysql-bin.000009
            Pos: 219
     Event_type: Query
      Server_id: 1
    End_log_pos: 319
           Info: create database sample
    *************************** 5. row ***************************
       Log_name: mysql-bin.000009
            Pos: 319
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 384
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 6. row ***************************
       Log_name: mysql-bin.000009
            Pos: 384
     Event_type: Query
      Server_id: 1
    End_log_pos: 470
           Info: BEGIN
    *************************** 7. row ***************************
       Log_name: mysql-bin.000009
            Pos: 470
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 874
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000009',219,'1',1681705232000,'sample','sample',null,'create database sample','QUERY',null)
    *************************** 8. row ***************************
       Log_name: mysql-bin.000009
            Pos: 874
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 967
           Info: table_id: 140 (canal_tsdb.meta_history)
    *************************** 9. row ***************************
       Log_name: mysql-bin.000009
            Pos: 967
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 1124
           Info: table_id: 140 flags: STMT_END_F
    *************************** 10. row ***************************
       Log_name: mysql-bin.000009
            Pos: 1124
     Event_type: Xid
      Server_id: 1
    End_log_pos: 1155
           Info: COMMIT /* xid=4173799 */
    *************************** 11. row ***************************
       Log_name: mysql-bin.000009
            Pos: 1155
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 1220
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 12. row ***************************
       Log_name: mysql-bin.000009
            Pos: 1220
     Event_type: Query
      Server_id: 1
    End_log_pos: 2051
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
    *************************** 13. row ***************************
       Log_name: mysql-bin.000009
            Pos: 2051
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 2116
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 14. row ***************************
       Log_name: mysql-bin.000009
            Pos: 2116
     Event_type: Query
      Server_id: 1
    End_log_pos: 2202
           Info: BEGIN
    *************************** 15. row ***************************
       Log_name: mysql-bin.000009
            Pos: 2202
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 3374
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000009',1220,'1',1681705353000,'sample','sample','user','CREATE TABLE user (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT \'ID\',\n  username varchar(32) NOT NULL COMMENT \'用户名\',\n  password varchar(32) NOT NULL COMMENT \'用户密码\',\n  nickname varchar(32) NOT NULL COMMENT \'用户昵称\',\n  telephone bigint(20) unsigned NOT NULL COMMENT \'用户手机\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'用户状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT \'用户名唯一索引\'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'用户\'','CREATE',null)
    *************************** 16. row ***************************
       Log_name: mysql-bin.000009
            Pos: 3374
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 3467
           Info: table_id: 140 (canal_tsdb.meta_history)
    *************************** 17. row ***************************
       Log_name: mysql-bin.000009
            Pos: 3467
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 4362
           Info: table_id: 140 flags: STMT_END_F
    *************************** 18. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4362
     Event_type: Xid
      Server_id: 1
    End_log_pos: 4393
           Info: COMMIT /* xid=4175305 */
    *************************** 19. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4393
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 4458
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 20. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4458
     Event_type: Query
      Server_id: 1
    End_log_pos: 4532
           Info: BEGIN
    *************************** 21. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4532
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 4754
           Info: # INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (1, 'master', '123456', '主人', 13512345678, 0, '2023-03-30 19:02:40', '2023-03-30 19:19:00')
    *************************** 22. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4754
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 4818
           Info: table_id: 141 (sample.user)
    *************************** 23. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4818
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 4905
           Info: table_id: 141 flags: STMT_END_F
    *************************** 24. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4905
     Event_type: Xid
      Server_id: 1
    End_log_pos: 4936
           Info: COMMIT /* xid=4175545 */
    *************************** 25. row ***************************
       Log_name: mysql-bin.000009
            Pos: 4936
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5001
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 26. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5001
     Event_type: Query
      Server_id: 1
    End_log_pos: 5075
           Info: BEGIN
    *************************** 27. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5075
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 5296
           Info: # INSERT INTO user(id, username, password, nickname, telephone, status, create_time, update_time) VALUES (2, 'slave', '123456', '仆人', 13512345678, 0, '2023-03-30 19:19:26', '2023-03-30 19:19:26')
    *************************** 28. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5296
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 5360
           Info: table_id: 141 (sample.user)
    *************************** 29. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5360
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 5446
           Info: table_id: 141 flags: STMT_END_F
    *************************** 30. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5446
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5477
           Info: COMMIT /* xid=4175650 */
    *************************** 31. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5477
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5542
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 32. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5542
     Event_type: Query
      Server_id: 1
    End_log_pos: 5624
           Info: BEGIN
    *************************** 33. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5624
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 5824
           Info: # INSERT INTO user(username, password, nickname, telephone, status) VALUES
    ('admin1', '123456', '管理员1', 13512345678, 0),
    ('admin2', '123456', '管理员2', 13512345678, 0)
    *************************** 34. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5824
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 5888
           Info: table_id: 141 (sample.user)
    *************************** 35. row ***************************
       Log_name: mysql-bin.000009
            Pos: 5888
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 6035
           Info: table_id: 141 flags: STMT_END_F
    *************************** 36. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6035
     Event_type: Xid
      Server_id: 1
    End_log_pos: 6066
           Info: COMMIT /* xid=4175950 */
    *************************** 37. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6066
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6131
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 38. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6131
     Event_type: Query
      Server_id: 1
    End_log_pos: 6213
           Info: BEGIN
    *************************** 39. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6213
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 6299
           Info: # UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%'
    *************************** 40. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6299
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 6363
           Info: table_id: 141 (sample.user)
    *************************** 41. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6363
     Event_type: Update_rows
      Server_id: 1
    End_log_pos: 6619
           Info: table_id: 141 flags: STMT_END_F
    *************************** 42. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6619
     Event_type: Xid
      Server_id: 1
    End_log_pos: 6650
           Info: COMMIT /* xid=4176082 */
    *************************** 43. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6650
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6715
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 44. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6715
     Event_type: Query
      Server_id: 1
    End_log_pos: 6789
           Info: BEGIN
    *************************** 45. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6789
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 6858
           Info: # DELETE FROM user WHERE username LIKE 'admin%'
    *************************** 46. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6858
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 6922
           Info: table_id: 141 (sample.user)
    *************************** 47. row ***************************
       Log_name: mysql-bin.000009
            Pos: 6922
     Event_type: Delete_rows
      Server_id: 1
    End_log_pos: 7065
           Info: table_id: 141 flags: STMT_END_F
    *************************** 48. row ***************************
       Log_name: mysql-bin.000009
            Pos: 7065
     Event_type: Xid
      Server_id: 1
    End_log_pos: 7096
           Info: COMMIT /* xid=4176142 */
    48 rows in set (0.00 sec)
    

## 查看 ZooKeeper 数据

查看实例当前的主库同步位点信息：

    [root@centos ~]# docker exec -it zookeeper-cluster-zoo1-1 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null
    [zk: localhost:2181(CONNECTED) 0]
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
            "journalName": "mysql-bin.000009",
            "position": 7065,
            "serverId": 1,
            "timestamp": 1681705421000
        }
    }

当前的同步位点 `"position": 7065` 是主库的最后一个二进制日志事件的开始位置。

## 查看 RocketMQ 消息

### 消息00

    // 消息 ID
    7F0000010A602090562B550BBCE10000 | sample-tag | 2023-04-17 12:20:32
    
    // 对应 SQL
    create database sample;
    
    {
      "data": null,
      "database": "sample",
      "es": 1681705232000,
      "id": 2,
      "isDdl": true,
      "mysqlType": null,
      "old": null,
      "pkNames": null,
      "sql": "create database sample",
      "sqlType": null,
      "table": "",
      "ts": 1681705232584,
      "type": "QUERY"
    }

### 消息01

    // 消息 ID
    7F0000010A602090562B550D95040001 | sample-tag | 2023-04-17 12:22:33
    
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
      "es": 1681705353000,
      "id": 3,
      "isDdl": true,
      "mysqlType": null,
      "old": null,
      "pkNames": null,
      "sql": "CREATE TABLE user (\n  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',\n  username varchar(32) NOT NULL COMMENT '用户名',\n  password varchar(32) NOT NULL COMMENT '用户密码',\n  nickname varchar(32) NOT NULL COMMENT '用户昵称',\n  telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',\n  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (id) USING BTREE,\n  UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引'\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户'",
      "sqlType": null,
      "table": "user",
      "ts": 1681705353475,
      "type": "CREATE"
    }

### 消息02

    // 消息 ID
    7F0000010A602090562B550DE52E0002 | sample-tag | 2023-04-17 12:22:54
    
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
      "es": 1681705373000,
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
      "ts": 1681705373998,
      "type": "INSERT"
    }

### 消息03

    // 消息 ID
    7F0000010A602090562B550DFF7B0003 | sample-tag | 2023-04-17 12:23:00
    
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
      "es": 1681705380000,
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
      "ts": 1681705380731,
      "type": "INSERT"
    }

### 消息04

    // 消息 ID
    7F0000010A602090562B550E62770004 | sample-tag | 2023-04-17 12:23:26
    
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
          "create_time": "2023-04-17 12:23:25",
          "update_time": "2023-04-17 12:23:25"
        },
        {
          "id": "4",
          "username": "admin2",
          "password": "123456",
          "nickname": "管理员2",
          "telephone": "13512345678",
          "status": "0",
          "create_time": "2023-04-17 12:23:25",
          "update_time": "2023-04-17 12:23:25"
        }
      ],
      "database": "sample",
      "es": 1681705405000,
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
      "ts": 1681705406070,
      "type": "INSERT"
    }

### 消息05

    // 消息 ID
    7F0000010A602090562B550E8D1D0005 | sample-tag | 2023-04-17 12:23:36
    
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
          "create_time": "2023-04-17 12:23:25",
          "update_time": "2023-04-17 12:23:36"
        },
        {
          "id": "4",
          "username": "admin2",
          "password": "abcd",
          "nickname": "管理员2",
          "telephone": "13512345678",
          "status": "0",
          "create_time": "2023-04-17 12:23:25",
          "update_time": "2023-04-17 12:23:36"
        }
      ],
      "database": "sample",
      "es": 1681705416000,
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
          "update_time": "2023-04-17 12:23:25"
        },
        {
          "password": "123456",
          "update_time": "2023-04-17 12:23:25"
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
      "ts": 1681705416988,
      "type": "UPDATE"
    }

### 消息06

    // 消息 ID
    7F0000010A602090562B550E9F810006 | sample-tag | 2023-04-17 12:23:41
    
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
          "create_time": "2023-04-17 12:23:25",
          "update_time": "2023-04-17 12:23:36"
        },
        {
          "id": "4",
          "username": "admin2",
          "password": "abcd",
          "nickname": "管理员2",
          "telephone": "13512345678",
          "status": "0",
          "create_time": "2023-04-17 12:23:25",
          "update_time": "2023-04-17 12:23:36"
        }
      ],
      "database": "sample",
      "es": 1681705421000,
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
      "ts": 1681705421697,
      "type": "DELETE"
    }


以上消息中没有二进制日志配置 `binlog-rows-query-log-events=TRUE` 产生的事件对应的 `QUERY` 类型的消息，是通过如下配置过滤的：

    ## 过滤 QUERY 类型的日志
    canal.instance.filter.query.dml = true

# 完