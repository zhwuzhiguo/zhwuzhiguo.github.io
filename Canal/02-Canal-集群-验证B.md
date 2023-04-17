# 02-Canal-集群-验证B

增量同步验证：

验证已经搭建好的 `Canal` 集群，数据库更新操作同步消息到 `RocketMQ`。

本示例增量同步数据库 `sample` 的 `user` 表。

## 备份表

备份 `user` 表并记录当前二进制日志的位置：

    mysqldump \
    --host=127.0.0.1 \
    --port=33071 \
    --user=root \
    --password=123456 \
    --master-data=2 \
    --single-transaction \
    --flush-logs \
    sample user > sample_user.sql

执行：

    [root@centos backup]# mysqldump \
    > --host=127.0.0.1 \
    > --port=33071 \
    > --user=root \
    > --password=123456 \
    > --master-data=2 \
    > --single-transaction \
    > --flush-logs \
    > sample user > sample_user.sql
    mysqldump: [Warning] Using a password on the command line interface can be insecure.

查看备份脚本：

    [root@centos backup]# cat sample_user.sql
    -- MySQL dump 10.13  Distrib 5.7.37, for Linux (x86_64)
    --
    -- Host: 127.0.0.1    Database: sample
    -- ------------------------------------------------------
    -- Server version	5.7.41-log
    
    /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
    /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
    /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
    /*!40101 SET NAMES utf8 */;
    /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
    /*!40103 SET TIME_ZONE='+00:00' */;
    /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
    /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
    /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
    /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
    
    --
    -- Position to start replication or point-in-time recovery from
    --
    
    -- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000011', MASTER_LOG_POS=154;
    
    --
    -- Table structure for table `user`
    --
    
    DROP TABLE IF EXISTS `user`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `user` (
      `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
      `username` varchar(32) NOT NULL COMMENT '用户名',
      `password` varchar(32) NOT NULL COMMENT '用户密码',
      `nickname` varchar(32) NOT NULL COMMENT '用户昵称',
      `telephone` bigint(20) unsigned NOT NULL COMMENT '用户手机',
      `status` int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
      `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (`id`) USING BTREE,
      UNIQUE KEY `uk_username` (`username`) USING BTREE COMMENT '用户名唯一索引'
    ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='用户';
    /*!40101 SET character_set_client = @saved_cs_client */;
    
    --
    -- Dumping data for table `user`
    --
    
    LOCK TABLES `user` WRITE;
    /*!40000 ALTER TABLE `user` DISABLE KEYS */;
    INSERT INTO `user` VALUES (1,'master','123456','主人',13512345678,0,'2023-03-30 19:02:40','2023-03-30 19:19:00'),(2,'slave','123456','仆人',13512345678,0,'2023-03-30 19:19:26','2023-03-30 19:19:26');
    /*!40000 ALTER TABLE `user` ENABLE KEYS */;
    UNLOCK TABLES;
    /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
    
    /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
    /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
    /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
    /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
    /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
    /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
    /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
    
    -- Dump completed on 2023-04-17 14:37:01

其中二进制日志的点位为：

    -- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000011', MASTER_LOG_POS=154;

此时可以将此备份脚本在同步库上执行来初始化存量数据。

## 创建 Canal Instance

首先在 `RocketMQ` 新建一个 `TOPIC`： 

    sample-topic-tables

在 `Canal Admin` 的 `Instance` 界面新建集群 `canal-cluster-1` 的名为 `sample-instance-tables` 的 `Instance`。

在实例配置中指定：
- 同步的表：`user`
- 同步点位：备份表的时候脚本中输出的当时的点位。
- 同步队列：`sample-topic-tables`

配置内容：

    ## 主库同步点位
    canal.instance.gtidon = false
    canal.instance.master.address = mysql-33071-master:3306
    canal.instance.master.journal.name = mysql-bin.000011
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
    canal.instance.filter.regex = sample\\.user
    canal.instance.filter.black.regex = 
    
    ## 同步消息队列
    canal.mq.topic = sample-topic-tables
    canal.mq.partition = 0

现在这个实例就跑起来了。

## 执行数据库操作

先刷新一下二进制日志，启用一个新文件：

    mysql> flush logs;
    Query OK, 0 rows affected (0.02 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000012 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

### 执行列表

1. 插入记录

       INSERT INTO user(username, password, nickname, telephone, status) VALUES 
       ('admin3', '123456', '管理员3', 13512345678, 0),
       ('admin4', '123456', '管理员4', 13512345678, 0);

2. 更新记录

       UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';

### 执行记录

    mysql> use sample;
    Reading table information for completion of table and column names
    You can turn off this feature to get a quicker startup with -A
    
    Database changed
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES
        -> ('admin3', '123456', '管理员3', 13512345678, 0),
        -> ('admin4', '123456', '管理员4', 13512345678, 0);
    Query OK, 2 rows affected (0.00 sec)
    Records: 2  Duplicates: 0  Warnings: 0
    
    mysql> UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';
    Query OK, 2 rows affected (0.01 sec)
    Rows matched: 2  Changed: 2  Warnings: 0


### 主库的二进制日志信息

    mysql> select * from user;
    +----+----------+----------+------------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname   | telephone   | status | create_time         | update_time         |
    +----+----------+----------+------------+-------------+--------+---------------------+---------------------+
    |  1 | master   | 123456   | 主人       | 13512345678 |      0 | 2023-03-30 19:02:40 | 2023-03-30 19:19:00 |
    |  2 | slave    | 123456   | 仆人       | 13512345678 |      0 | 2023-03-30 19:19:26 | 2023-03-30 19:19:26 |
    |  5 | admin3   | abcd     | 管理员3    | 13512345678 |      0 | 2023-04-17 15:17:19 | 2023-04-17 15:17:27 |
    |  6 | admin4   | abcd     | 管理员4    | 13512345678 |      0 | 2023-04-17 15:17:19 | 2023-04-17 15:17:27 |
    +----+----------+----------+------------+-------------+--------+---------------------+---------------------+
    4 rows in set (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000012 |     1327 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.01 sec)
    
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
    | mysql-bin.000012 |      1327 |
    +------------------+-----------+
    12 rows in set (0.00 sec)

### 最后一个二进制日志文件的事件列表

    mysql> show binlog events in 'mysql-bin.000012' \G
    *************************** 1. row ***************************
       Log_name: mysql-bin.000012
            Pos: 4
     Event_type: Format_desc
      Server_id: 1
    End_log_pos: 123
           Info: Server ver: 5.7.41-log, Binlog ver: 4
    *************************** 2. row ***************************
       Log_name: mysql-bin.000012
            Pos: 123
     Event_type: Previous_gtids
      Server_id: 1
    End_log_pos: 154
           Info:
    *************************** 3. row ***************************
       Log_name: mysql-bin.000012
            Pos: 154
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 219
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 4. row ***************************
       Log_name: mysql-bin.000012
            Pos: 219
     Event_type: Query
      Server_id: 1
    End_log_pos: 301
           Info: BEGIN
    *************************** 5. row ***************************
       Log_name: mysql-bin.000012
            Pos: 301
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 501
           Info: # INSERT INTO user(username, password, nickname, telephone, status) VALUES
    ('admin3', '123456', '管理员3', 13512345678, 0),
    ('admin4', '123456', '管理员4', 13512345678, 0)
    *************************** 6. row ***************************
       Log_name: mysql-bin.000012
            Pos: 501
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 565
           Info: table_id: 149 (sample.user)
    *************************** 7. row ***************************
       Log_name: mysql-bin.000012
            Pos: 565
     Event_type: Write_rows
      Server_id: 1
    End_log_pos: 712
           Info: table_id: 149 flags: STMT_END_F
    *************************** 8. row ***************************
       Log_name: mysql-bin.000012
            Pos: 712
     Event_type: Xid
      Server_id: 1
    End_log_pos: 743
           Info: COMMIT /* xid=4311209 */
    *************************** 9. row ***************************
       Log_name: mysql-bin.000012
            Pos: 743
     Event_type: Anonymous_Gtid
      Server_id: 1
    End_log_pos: 808
           Info: SET @@SESSION.GTID_NEXT= 'ANONYMOUS'
    *************************** 10. row ***************************
       Log_name: mysql-bin.000012
            Pos: 808
     Event_type: Query
      Server_id: 1
    End_log_pos: 890
           Info: BEGIN
    *************************** 11. row ***************************
       Log_name: mysql-bin.000012
            Pos: 890
     Event_type: Rows_query
      Server_id: 1
    End_log_pos: 976
           Info: # UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%'
    *************************** 12. row ***************************
       Log_name: mysql-bin.000012
            Pos: 976
     Event_type: Table_map
      Server_id: 1
    End_log_pos: 1040
           Info: table_id: 149 (sample.user)
    *************************** 13. row ***************************
       Log_name: mysql-bin.000012
            Pos: 1040
     Event_type: Update_rows
      Server_id: 1
    End_log_pos: 1296
           Info: table_id: 149 flags: STMT_END_F
    *************************** 14. row ***************************
       Log_name: mysql-bin.000012
            Pos: 1296
     Event_type: Xid
      Server_id: 1
    End_log_pos: 1327
           Info: COMMIT /* xid=4311300 */
    14 rows in set (0.00 sec)


## 查看 ZooKeeper 数据

查看实例当前的主库同步位点信息：

    [root@centos ~]# docker exec -it zookeeper-cluster-zoo1-1 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null
    [zk: localhost:2181(CONNECTED) 0]
    [zk: localhost:2181(CONNECTED) 0] get /otter/canal/destinations/sample-instance-tables/1001/cursor
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
            "journalName": "mysql-bin.000012",
            "position": 1296,
            "serverId": 1,
            "timestamp": 1681715847000
        }
    }

当前的同步位点 `"position": 1296` 是主库的最后一个二进制日志事件的开始位置。

## 查看 RocketMQ 消息

### 消息00

    // 消息 ID
    7F0000010CD2150BF4F655AD98070000 | sample-tag | 2023-04-17 15:17:20
    
    // 对应 SQL
    INSERT INTO user(username, password, nickname, telephone, status) VALUES 
    ('admin3', '123456', '管理员3', 13512345678, 0),
    ('admin4', '123456', '管理员4', 13512345678, 0);
    
    {
        "data": [
            {
                "id": "5",
                "username": "admin3",
                "password": "123456",
                "nickname": "管理员3",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-17 15:17:19",
                "update_time": "2023-04-17 15:17:19"
            },
            {
                "id": "6",
                "username": "admin4",
                "password": "123456",
                "nickname": "管理员4",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-17 15:17:19",
                "update_time": "2023-04-17 15:17:19"
            }
        ],
        "database": "sample",
        "es": 1681715839000,
        "id": 2,
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
        "ts": 1681715839985,
        "type": "INSERT"
    }

### 消息01

    // 消息 ID
    7F0000010CD2150BF4F655ADB62A0001 | sample-tag | 2023-04-17 15:17:27
    
    // 对应 SQL
    UPDATE user SET password = 'abcd' WHERE username LIKE 'admin%';
    
    {
        "data": [
            {
                "id": "5",
                "username": "admin3",
                "password": "abcd",
                "nickname": "管理员3",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-17 15:17:19",
                "update_time": "2023-04-17 15:17:27"
            },
            {
                "id": "6",
                "username": "admin4",
                "password": "abcd",
                "nickname": "管理员4",
                "telephone": "13512345678",
                "status": "0",
                "create_time": "2023-04-17 15:17:19",
                "update_time": "2023-04-17 15:17:27"
            }
        ],
        "database": "sample",
        "es": 1681715847000,
        "id": 3,
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
                "update_time": "2023-04-17 15:17:19"
            },
            {
                "password": "123456",
                "update_time": "2023-04-17 15:17:19"
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
        "ts": 1681715847721,
        "type": "UPDATE"
    }


# 完