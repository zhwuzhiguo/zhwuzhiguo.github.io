# 02-Canal-集群-验证C

历史表结构变化回溯同步验证：

验证已经搭建好的 `Canal` 集群，数据库更新操作同步消息到 `RocketMQ`。

本示例增量同步数据库 `sample` 的 `temp` 表。

## 创建 Canal Instance

首先在 `RocketMQ` 新建一个 `TOPIC`： 

    sample-topic-rollback

查看源数据库的二进制日志位置信息：

    [root@centos ~]# docker exec -it mysql-33071-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    mysql> flush logs;
    Query OK, 0 rows affected (0.02 sec)

    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000013 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)


在 `Canal Admin` 的 `Instance` 界面新建集群 `canal-cluster-1` 的名为 `sample-instance-rollback` 的 `Instance`。

在实例配置中指定：
- 同步的表：`temp`
- 同步点位：备份表的时候脚本中输出的当时的点位。
- 同步队列：`sample-topic-rollback`

配置内容：

    ## 主库同步点位
    canal.instance.gtidon = false
    canal.instance.master.address = mysql-33071-master:3306
    canal.instance.master.journal.name = mysql-bin.000013
    canal.instance.master.position = 154
    canal.instance.master.timestamp = 
    canal.instance.master.gtid = 
    
    ## 阿里云数据库二进制日志OSS
    canal.instance.rds.accesskey = 
    canal.instance.rds.secretkey = 
    canal.instance.rds.instanceId = 
    
    ## 主库同步账号
    canal.instance.dbUsername = reader
    canal.instance.dbPassword = 123456
    canal.instance.connectionCharset = UTF-8
    
    ## 主库同步过滤规则
    canal.instance.filter.regex = sample\\.temp
    canal.instance.filter.black.regex = 
    
    ## 同步消息队列
    canal.mq.topic = sample-topic-rollback
    canal.mq.partition = 0

现在这个实例就跑起来了。

## 执行数据库操作

先刷新一下二进制日志，启用一个新文件：

    mysql> flush logs;
    Query OK, 0 rows affected (0.01 sec)

    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000014 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

### 执行列表

1. 创建表

       CREATE TABLE temp (
         id bigint(20) unsigned NOT NULL COMMENT 'ID',
         name varchar(256) NOT NULL COMMENT '名称',
         address varchar(256) NOT NULL COMMENT '地址',
         status int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
         create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
         update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
         PRIMARY KEY (id) USING BTREE
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时表';

2. 数据操作

       INSERT INTO temp(id, name, address) VALUES 
       (1, '北京', '中国北京市'),
       (2, '上海', '中国上海市'),
       (3, '广州', '中国广州市');
       
       UPDATE temp SET address = '中国' WHERE id = 2;
       
       DELETE FROM temp WHERE id = 3;

3. 修改表结构

       ALTER TABLE temp 
       DROP COLUMN address,
       ADD COLUMN telephone varchar(256) NOT NULL DEFAULT '' COMMENT '电话' AFTER status;

4. 数据操作

       INSERT INTO temp(id, name, telephone) VALUES 
       (4, '深圳', '12345'),
       (5, '重庆', '12345');
       
       UPDATE temp SET telephone = '13512345678' WHERE id = 4;
       
       DELETE FROM temp WHERE id = 5;

### 执行记录

    mysql> use sample;
    Reading table information for completion of table and column names
    You can turn off this feature to get a quicker startup with -A
    
    Database changed
    mysql> CREATE TABLE temp (
        ->   id bigint(20) unsigned NOT NULL COMMENT 'ID',
        ->   name varchar(256) NOT NULL COMMENT '名称',
        ->   address varchar(256) NOT NULL COMMENT '地址',
        ->   status int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
        ->   create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        ->   update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        ->   PRIMARY KEY (id) USING BTREE
        -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时表';
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> INSERT INTO temp(id, name, address) VALUES
        -> (1, '北京', '中国北京市'),
        -> (2, '上海', '中国上海市'),
        -> (3, '广州', '中国广州市');
    Query OK, 3 rows affected (0.00 sec)
    Records: 3  Duplicates: 0  Warnings: 0
    
    mysql> UPDATE temp SET address = '中国' WHERE id = 2;
    Query OK, 1 row affected (0.00 sec)
    Rows matched: 1  Changed: 1  Warnings: 0
    
    mysql> DELETE FROM temp WHERE id = 3;
    Query OK, 1 row affected (0.00 sec)
    
    mysql> ALTER TABLE temp
        -> DROP COLUMN address,
        -> ADD COLUMN telephone varchar(256) NOT NULL DEFAULT '' COMMENT '电话' AFTER status;
    Query OK, 0 rows affected (0.05 sec)
    Records: 0  Duplicates: 0  Warnings: 0
    
    mysql> INSERT INTO temp(id, name, telephone) VALUES
        -> (4, '深圳', '12345'),
        -> (5, '重庆', '12345');
    Query OK, 2 rows affected (0.01 sec)
    Records: 2  Duplicates: 0  Warnings: 0
    
    mysql> UPDATE temp SET telephone = '13512345678' WHERE id = 4;
    Query OK, 1 row affected (0.00 sec)
    Rows matched: 1  Changed: 1  Warnings: 0
    
    mysql> DELETE FROM temp WHERE id = 5;
    Query OK, 1 row affected (0.01 sec)

### 主库的二进制日志信息

    mysql> select * from temp;
    +----+--------+--------+-------------+---------------------+---------------------+
    | id | name   | status | telephone   | create_time         | update_time         |
    +----+--------+--------+-------------+---------------------+---------------------+
    |  1 | 北京   |      0 |             | 2023-04-17 17:36:35 | 2023-04-17 17:36:35 |
    |  2 | 上海   |      0 |             | 2023-04-17 17:36:35 | 2023-04-17 17:36:41 |
    |  4 | 深圳   |      0 | 13512345678 | 2023-04-17 17:39:40 | 2023-04-17 17:39:48 |
    +----+--------+--------+-------------+---------------------+---------------------+
    3 rows in set (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000014 |     9633 |              |                  |                   |
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
    | mysql-bin.000009 |      7143 |
    | mysql-bin.000010 |       201 |
    | mysql-bin.000011 |      7349 |
    | mysql-bin.000012 |      1374 |
    | mysql-bin.000013 |      5676 |
    | mysql-bin.000014 |      9633 |
    +------------------+-----------+
    14 rows in set (0.00 sec)

### 最后一个二进制日志文件的事件列表

    mysql> show binlog events in 'mysql-bin.000014' \G
    *************************** 1. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4
     Event_type: Format_desc
      Server_id: 1
    End_log_pos: 123
           Info: Server ver: 5.7.41-log, Binlog ver: 4
    *************************** 2. row ***************************
       Log_name: mysql-bin.000014
            Pos: 123
     Event_type: Previous_gtids
      Server_id: 1
    End_log_pos: 154
           Info:
    *************************** 3. row ***************************
       Log_name: mysql-bin.000014
            Pos: 154
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 219
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 4. row ***************************
       Log_name: mysql-bin.000014
            Pos: 219
     Event_type: Query
      Server_id: 1
    End_log_pos: 824
           Info: use `sample`; CREATE TABLE temp (
      id bigint(20) unsigned NOT NULL COMMENT 'ID',
      name varchar(256) NOT NULL COMMENT '名称',
      address varchar(256) NOT NULL COMMENT '地址',
      status int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
      create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时表'
    *************************** 5. row ***************************
       Log_name: mysql-bin.000014
            Pos: 824
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 889
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 6. row ***************************
       Log_name: mysql-bin.000014
            Pos: 889
     Event_type: Query
      Server_id: 1
    End_log_pos: 975
           Info: BEGIN
    *************************** 7. row ***************************
       Log_name: mysql-bin.000014
            Pos: 975
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 1911
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000014',219,'1',1681724087000,'sample','sample','temp','CREATE TABLE temp (\n  id bigint(20) unsigned NOT NULL COMMENT \'ID\',\n  name varchar(256) NOT NULL COMMENT \'名称\',\n  address varchar(256) NOT NULL COMMENT \'地址\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'数据状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'临时表\'','CREATE',null)
    *************************** 8. row ***************************
       Log_name: mysql-bin.000014
            Pos: 1911
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 2004
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 9. row ***************************
       Log_name: mysql-bin.000014
            Pos: 2004
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 2673
           Info: table_id: 155 flags: STMT_END_F
    *************************** 10. row ***************************
       Log_name: mysql-bin.000014
            Pos: 2673
     Event_type: Xid
      Server_id: 1
    End_log_pos: 2704
           Info: COMMIT /* xid=4477608 */
    *************************** 11. row ***************************
       Log_name: mysql-bin.000014
            Pos: 2704
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 2769
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 12. row ***************************
       Log_name: mysql-bin.000014
            Pos: 2769
     Event_type: Query
      Server_id: 1
    End_log_pos: 2855
           Info: BEGIN
    *************************** 13. row ***************************
       Log_name: mysql-bin.000014
            Pos: 2855
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 3800
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-rollback','mysql-bin.000014',219,'1',1681724087000,'sample','sample','temp','CREATE TABLE temp (\n  id bigint(20) unsigned NOT NULL COMMENT \'ID\',\n  name varchar(256) NOT NULL COMMENT \'名称\',\n  address varchar(256) NOT NULL COMMENT \'地址\',\n  status int(20) NOT NULL DEFAULT \'0\' COMMENT \'数据状态 0-正常 1-禁用\',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\',\n  PRIMARY KEY (id) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'临时表\'','CREATE',null)
    *************************** 14. row ***************************
       Log_name: mysql-bin.000014
            Pos: 3800
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 3893
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 15. row ***************************
       Log_name: mysql-bin.000014
            Pos: 3893
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 4571
           Info: table_id: 155 flags: STMT_END_F
    *************************** 16. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4571
     Event_type: Xid
      Server_id: 1
    End_log_pos: 4602
           Info: COMMIT /* xid=4477611 */
    *************************** 17. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4602
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 4667
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 18. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4667
     Event_type: Query
      Server_id: 1
    End_log_pos: 4749
           Info: BEGIN
    *************************** 19. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4749
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 4917
           Info: # INSERT INTO temp(id, name, address) VALUES
    (1, '北京', '中国北京市'),
    (2, '上海', '中国上海市'),
    (3, '广州', '中国广州市')
    *************************** 20. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4917
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 4977
           Info: table_id: 161 (sample.temp)
    *************************** 21. row ***************************
       Log_name: mysql-bin.000014
            Pos: 4977
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 5156
           Info: table_id: 161 flags: STMT_END_F
    *************************** 22. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5156
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5187
           Info: COMMIT /* xid=4479973 */
    *************************** 23. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5187
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5252
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 24. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5252
     Event_type: Query
      Server_id: 1
    End_log_pos: 5334
           Info: BEGIN
    *************************** 25. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5334
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 5405
           Info: # UPDATE temp SET address = '中国' WHERE id = 2
    *************************** 26. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5405
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 5465
           Info: table_id: 161 (sample.temp)
    *************************** 27. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5465
     Event_type: Update_rows
      Server_id: 1
    End_log_pos: 5588
           Info: table_id: 161 flags: STMT_END_F
    *************************** 28. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5588
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5619
           Info: COMMIT /* xid=4480090 */
    *************************** 29. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5619
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 5684
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 30. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5684
     Event_type: Query
      Server_id: 1
    End_log_pos: 5758
           Info: BEGIN
    *************************** 31. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5758
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 5811
           Info: # DELETE FROM temp WHERE id = 3
    *************************** 32. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5811
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 5871
           Info: table_id: 161 (sample.temp)
    *************************** 33. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5871
     Event_type: Delete_rows
      Server_id: 1
    End_log_pos: 5954
           Info: table_id: 161 flags: STMT_END_F
    *************************** 34. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5954
     Event_type: Xid
      Server_id: 1
    End_log_pos: 5985
           Info: COMMIT /* xid=4480243 */
    *************************** 35. row ***************************
       Log_name: mysql-bin.000014
            Pos: 5985
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6050
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 36. row ***************************
       Log_name: mysql-bin.000014
            Pos: 6050
     Event_type: Query
      Server_id: 1
    End_log_pos: 6258
           Info: use `sample`; ALTER TABLE temp
    DROP COLUMN address,
    ADD COLUMN telephone varchar(256) NOT NULL DEFAULT '' COMMENT '电话' AFTER status
    *************************** 37. row ***************************
       Log_name: mysql-bin.000014
            Pos: 6258
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 6323
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 38. row ***************************
       Log_name: mysql-bin.000014
            Pos: 6323
     Event_type: Query
      Server_id: 1
    End_log_pos: 6409
           Info: BEGIN
    *************************** 39. row ***************************
       Log_name: mysql-bin.000014
            Pos: 6409
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 6931
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance-rollback','mysql-bin.000014',6050,'1',1681724322000,'sample','sample','temp','ALTER TABLE temp \nDROP COLUMN address,\nADD COLUMN telephone varchar(256) NOT NULL DEFAULT \'\' COMMENT \'电话\' AFTER status','ALTER',null)
    *************************** 40. row ***************************
       Log_name: mysql-bin.000014
            Pos: 6931
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 7024
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 41. row ***************************
       Log_name: mysql-bin.000014
            Pos: 7024
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 7296
           Info: table_id: 155 flags: STMT_END_F
    *************************** 42. row ***************************
       Log_name: mysql-bin.000014
            Pos: 7296
     Event_type: Xid
      Server_id: 1
    End_log_pos: 7327
           Info: COMMIT /* xid=4482717 */
    *************************** 43. row ***************************
       Log_name: mysql-bin.000014
            Pos: 7327
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 7392
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 44. row ***************************
       Log_name: mysql-bin.000014
            Pos: 7392
     Event_type: Query
      Server_id: 1
    End_log_pos: 7478
           Info: BEGIN
    *************************** 45. row ***************************
       Log_name: mysql-bin.000014
            Pos: 7478
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 7991
           Info: # insert into meta_history (
    
    		gmt_create,gmt_modified,destination,binlog_file,binlog_offest,binlog_master_id,binlog_timestamp,use_schema,sql_schema,sql_table,sql_text,sql_type,extra
    
         )
            values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'sample-instance','mysql-bin.000014',6050,'1',1681724322000,'sample','sample','temp','ALTER TABLE temp \nDROP COLUMN address,\nADD COLUMN telephone varchar(256) NOT NULL DEFAULT \'\' COMMENT \'电话\' AFTER status','ALTER',null)
    *************************** 46. row ***************************
       Log_name: mysql-bin.000014
            Pos: 7991
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 8084
           Info: table_id: 155 (canal_tsdb.meta_history)
    *************************** 47. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8084
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 8347
           Info: table_id: 155 flags: STMT_END_F
    *************************** 48. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8347
     Event_type: Xid
      Server_id: 1
    End_log_pos: 8378
           Info: COMMIT /* xid=4482719 */
    *************************** 49. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8378
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 8443
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 50. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8443
     Event_type: Query
      Server_id: 1
    End_log_pos: 8525
           Info: BEGIN
    *************************** 51. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8525
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 8641
           Info: # INSERT INTO temp(id, name, telephone) VALUES
    (4, '深圳', '12345'),
    (5, '重庆', '12345')
    *************************** 52. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8641
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 8701
           Info: table_id: 162 (sample.temp)
    *************************** 53. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8701
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 8812
           Info: table_id: 162 flags: STMT_END_F
    *************************** 54. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8812
     Event_type: Xid
      Server_id: 1
    End_log_pos: 8843
           Info: COMMIT /* xid=4484009 */
    *************************** 55. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8843
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 8908
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 56. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8908
     Event_type: Query
      Server_id: 1
    End_log_pos: 8990
           Info: BEGIN
    *************************** 57. row ***************************
       Log_name: mysql-bin.000014
            Pos: 8990
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 9068
           Info: # UPDATE temp SET telephone = '13512345678' WHERE id = 4
    *************************** 58. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9068
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 9128
           Info: table_id: 162 (sample.temp)
    *************************** 59. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9128
     Event_type: Update_rows
      Server_id: 1
    End_log_pos: 9246
           Info: table_id: 162 flags: STMT_END_F
    *************************** 60. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9246
     Event_type: Xid
      Server_id: 1
    End_log_pos: 9277
           Info: COMMIT /* xid=4484126 */
    *************************** 61. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9277
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 9342
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 62. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9342
     Event_type: Query
      Server_id: 1
    End_log_pos: 9416
           Info: BEGIN
    *************************** 63. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9416
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 9469
           Info: # DELETE FROM temp WHERE id = 5
    *************************** 64. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9469
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 9529
           Info: table_id: 162 (sample.temp)
    *************************** 65. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9529
     Event_type: Delete_rows
      Server_id: 1
    End_log_pos: 9602
           Info: table_id: 162 flags: STMT_END_F
    *************************** 66. row ***************************
       Log_name: mysql-bin.000014
            Pos: 9602
     Event_type: Xid
      Server_id: 1
    End_log_pos: 9633
           Info: COMMIT /* xid=4484240 */
    66 rows in set (0.00 sec)
    

## 查看 ZooKeeper 数据

查看实例当前的主库同步位点信息：

    [root@centos ~]# docker exec -it zookeeper-cluster-zoo1-1 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null
    [zk: localhost:2181(CONNECTED) 0]
    [zk: localhost:2181(CONNECTED) 0] get /otter/canal/destinations/sample-instance-rollback/1001/cursor
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
            "journalName": "mysql-bin.000014",
            "position": 9602,
            "serverId": 1,
            "timestamp": 1681724393000
        }
    }

当前的同步位点 `"position": 9602` 是主库的最后一个二进制日志事件的开始位置。

## 查看 RocketMQ 消息

### 消息02

    // 消息 ID
    7F0000010CD2150BF4F6562B6F930002 | sample-tag | 2023-04-17 17:34:47
    
    // 对应 SQL
    CREATE TABLE temp (
      id bigint(20) unsigned NOT NULL COMMENT 'ID',
      name varchar(256) NOT NULL COMMENT '名称',
      address varchar(256) NOT NULL COMMENT '地址',
      status int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',
      create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时表';
    
    {
      "data": null,
      "database": "sample",
      "es": 1681724087000,
      "id": 2,
      "isDdl": true,
      "mysqlType": null,
      "old": null,
      "pkNames": null,
      "sql": "CREATE TABLE temp (\n  id bigint(20) unsigned NOT NULL COMMENT 'ID',\n  name varchar(256) NOT NULL COMMENT '名称',\n  address varchar(256) NOT NULL COMMENT '地址',\n  status int(20) NOT NULL DEFAULT '0' COMMENT '数据状态 0-正常 1-禁用',\n  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (id) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时表'",
      "sqlType": null,
      "table": "temp",
      "ts": 1681724087185,
      "type": "CREATE"
    }

### 消息03

    // 消息 ID
    7F0000010CD2150BF4F6562D16700003 | sample-tag | 2023-04-17 17:36:35
    
    // 对应 SQL
    INSERT INTO temp(id, name, address) VALUES 
    (1, '北京', '中国北京市'),
    (2, '上海', '中国上海市'),
    (3, '广州', '中国广州市');
    
    {
      "data": [
        {
          "id": "1",
          "name": "北京",
          "address": "中国北京市",
          "status": "0",
          "create_time": "2023-04-17 17:36:35",
          "update_time": "2023-04-17 17:36:35"
        },
        {
          "id": "2",
          "name": "上海",
          "address": "中国上海市",
          "status": "0",
          "create_time": "2023-04-17 17:36:35",
          "update_time": "2023-04-17 17:36:35"
        },
        {
          "id": "3",
          "name": "广州",
          "address": "中国广州市",
          "status": "0",
          "create_time": "2023-04-17 17:36:35",
          "update_time": "2023-04-17 17:36:35"
        }
      ],
      "database": "sample",
      "es": 1681724195000,
      "id": 3,
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
      "table": "temp",
      "ts": 1681724195439,
      "type": "INSERT"
    }

### 消息04

    // 消息 ID
    7F0000010CD2150BF4F6562D2E590004 | sample-tag | 2023-04-17 17:36:41
    
    // 对应 SQL
    UPDATE temp SET address = '中国' WHERE id = 2;
    
    {
      "data": [
        {
          "id": "2",
          "name": "上海",
          "address": "中国",
          "status": "0",
          "create_time": "2023-04-17 17:36:35",
          "update_time": "2023-04-17 17:36:41"
        }
      ],
      "database": "sample",
      "es": 1681724201000,
      "id": 4,
      "isDdl": false,
      "mysqlType": {
        "id": "bigint(20) unsigned",
        "name": "varchar(256)",
        "address": "varchar(256)",
        "status": "int(20)",
        "create_time": "datetime",
        "update_time": "datetime"
      },
      "old": [
        {
          "address": "中国上海市",
          "update_time": "2023-04-17 17:36:35"
        }
      ],
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
      "table": "temp",
      "ts": 1681724201561,
      "type": "UPDATE"
    }

### 消息05

    // 消息 ID
    7F0000010CD2150BF4F6562D4C780005 | sample-tag | 2023-04-17 17:36:49
    
    // 对应 SQL
    DELETE FROM temp WHERE id = 3;
    
    {
      "data": [
        {
          "id": "3",
          "name": "广州",
          "address": "中国广州市",
          "status": "0",
          "create_time": "2023-04-17 17:36:35",
          "update_time": "2023-04-17 17:36:35"
        }
      ],
      "database": "sample",
      "es": 1681724209000,
      "id": 5,
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
      "table": "temp",
      "ts": 1681724209272,
      "type": "DELETE"
    }

### 消息06

    // 消息 ID
    7F0000010CD2150BF4F6562F09330006 | sample-tag | 2023-04-17 17:38:43
    
    // 对应 SQL
    ALTER TABLE temp 
    DROP COLUMN address,
    ADD COLUMN telephone varchar(256) NOT NULL DEFAULT '' COMMENT '电话' AFTER status;
    
    {
      "data": null,
      "database": "sample",
      "es": 1681724322000,
      "id": 6,
      "isDdl": true,
      "mysqlType": null,
      "old": null,
      "pkNames": null,
      "sql": "ALTER TABLE temp \nDROP COLUMN address,\nADD COLUMN telephone varchar(256) NOT NULL DEFAULT '' COMMENT '电话' AFTER status",
      "sqlType": null,
      "table": "temp",
      "ts": 1681724323123,
      "type": "ALTER"
    }

### 消息07

    // 消息 ID
    7F0000010CD2150BF4F6562FEB960007 | sample-tag | 2023-04-17 17:39:41
    
    // 对应 SQL
    INSERT INTO temp(id, name, telephone) VALUES 
    (4, '深圳', '12345'),
    (5, '重庆', '12345');
    
    {
      "data": [
        {
          "id": "4",
          "name": "深圳",
          "status": "0",
          "telephone": "12345",
          "create_time": "2023-04-17 17:39:40",
          "update_time": "2023-04-17 17:39:40"
        },
        {
          "id": "5",
          "name": "重庆",
          "status": "0",
          "telephone": "12345",
          "create_time": "2023-04-17 17:39:40",
          "update_time": "2023-04-17 17:39:40"
        }
      ],
      "database": "sample",
      "es": 1681724380000,
      "id": 7,
      "isDdl": false,
      "mysqlType": {
        "id": "bigint(20) unsigned",
        "name": "varchar(256)",
        "status": "int(20)",
        "telephone": "varchar(256)",
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
        "status": 4,
        "telephone": 12,
        "create_time": 93,
        "update_time": 93
      },
      "table": "temp",
      "ts": 1681724381078,
      "type": "INSERT"
    }

### 消息08

    // 消息 ID
    7F0000010CD2150BF4F6563008260008 | sample-tag | 2023-04-17 17:39:48
    
    // 对应 SQL
    UPDATE temp SET telephone = '13512345678' WHERE id = 4;
    
    {
      "data": [
        {
          "id": "4",
          "name": "深圳",
          "status": "0",
          "telephone": "13512345678",
          "create_time": "2023-04-17 17:39:40",
          "update_time": "2023-04-17 17:39:48"
        }
      ],
      "database": "sample",
      "es": 1681724388000,
      "id": 8,
      "isDdl": false,
      "mysqlType": {
        "id": "bigint(20) unsigned",
        "name": "varchar(256)",
        "status": "int(20)",
        "telephone": "varchar(256)",
        "create_time": "datetime",
        "update_time": "datetime"
      },
      "old": [
        {
          "telephone": "12345",
          "update_time": "2023-04-17 17:39:40"
        }
      ],
      "pkNames": [
        "id"
      ],
      "sql": "",
      "sqlType": {
        "id": -5,
        "name": 12,
        "status": 4,
        "telephone": 12,
        "create_time": 93,
        "update_time": 93
      },
      "table": "temp",
      "ts": 1681724388390,
      "type": "UPDATE"
    }

### 消息09

    // 消息 ID
    7F0000010CD2150BF4F656301E770009 | sample-tag | 2023-04-17 17:39:54
    
    // 对应 SQL
    DELETE FROM temp WHERE id = 5;
    
    {
      "data": [
        {
          "id": "5",
          "name": "重庆",
          "status": "0",
          "telephone": "12345",
          "create_time": "2023-04-17 17:39:40",
          "update_time": "2023-04-17 17:39:40"
        }
      ],
      "database": "sample",
      "es": 1681724393000,
      "id": 9,
      "isDdl": false,
      "mysqlType": {
        "id": "bigint(20) unsigned",
        "name": "varchar(256)",
        "status": "int(20)",
        "telephone": "varchar(256)",
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
        "status": 4,
        "telephone": 12,
        "create_time": 93,
        "update_time": 93
      },
      "table": "temp",
      "ts": 1681724394103,
      "type": "DELETE"
    }

## 回溯同步验证

// todo

# 完