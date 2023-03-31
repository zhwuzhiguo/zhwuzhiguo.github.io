# 03-MySQL备份与恢复-网络

使用 `docker` 搭建 `MySQL` 主库 和 备库 ，容器加入指定网络，方便在同一网络内访问。

## 1 查看网络

    // 查看网络 network0
    [root@centos mysql]# docker network ls
    NETWORK ID     NAME       DRIVER    SCOPE
    0c7f3765f44e   bridge     bridge    local
    c1baf3b0966d   host       host      local
    355cc9de7da3   network0   bridge    local
    2656d3bb9028   none       null      local

## 2 创建主实例

### 2.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/docker/mysql/mysql-33080/master/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/docker/mysql/mysql-33080/master/data

### 2.2 配置文件

    // 设置配置文件
    [root@centos mysql]# vim /root/docker/mysql/mysql-33080/master/cnf/mysql.cnf
    [root@centos mysql]# cat /root/docker/mysql/mysql-33080/master/cnf/mysql.cnf
    [mysqld]
    ## 服务ID
    server-id=1
    ## 开启二进制日志
    log-bin=mysql-bin
    ## 二进制日志格式
    binlog-format=ROW
    ## 二进制日志缓存大小
    binlog-cache-size=1M
    ## 二进制日志文件最大尺寸
    max-binlog-size=512M
    ## ROW模式输出SQL
    binlog-rows-query-log-events=TRUE
    ## 二进制日志保留天数
    expire-logs-days=10

    ## 其他配置
    character-set-server=utf8mb4
    collation-server=utf8mb4_general_ci
    
    ## 客户端配置
    [client]
    default-character-set=utf8mb4
    

### 2.3 创建并启动实例

    // 创建并启动实例
    docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    -p 33081:3306 \
    -v /root/docker/mysql/mysql-33080/master/cnf:/etc/mysql/conf.d \
    -v /root/docker/mysql/mysql-33080/master/data:/var/lib/mysql \
    --network network0 \
    --network-alias mysql-33081-master \
    --name mysql-33081-master \
    mysql:5.7.zh

    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33081:3306 \
    > -v /root/docker/mysql/mysql-33080/master/cnf:/etc/mysql/conf.d \
    > -v /root/docker/mysql/mysql-33080/master/data:/var/lib/mysql \
    > --network network0 \
    > --network-alias mysql-33081-master \
    > --name mysql-33081-master \
    > mysql:5.7.zh
    1e1be6e39fb7714e52d440ac9a77db8d923948de5cd78bdc0ffefb1ed0b93cff
    
    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE                     COMMAND                   CREATED         STATUS         PORTS                                                                                                        NAMES
    1e1be6e39fb7   mysql:5.7.zh              "docker-entrypoint.s…"   8 seconds ago   Up 7 seconds   33060/tcp, 0.0.0.0:33081->3306/tcp, :::33081->3306/tcp                                                       mysql-33081-master
    a7650129089f   mysql:5.7.zh              "docker-entrypoint.s…"   20 hours ago    Up 4 hours     33060/tcp, 0.0.0.0:33072->3306/tcp, :::33072->3306/tcp                                                       mysql-33072-slave
    b6fd417cb1b1   mysql:5.7.zh              "docker-entrypoint.s…"   21 hours ago    Up 4 hours     33060/tcp, 0.0.0.0:33071->3306/tcp, :::33071->3306/tcp                                                       mysql-33071-master
    b1f79214e313   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   22 hours ago    Up 5 hours     2888/tcp, 3888/tcp, 0.0.0.0:2182->2181/tcp, :::2182->2181/tcp, 0.0.0.0:21820->8080/tcp, :::21820->8080/tcp   zookeeper-cluster-zoo2-1
    0bf4fce71dac   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   22 hours ago    Up 5 hours     2888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp, 3888/tcp, 0.0.0.0:21810->8080/tcp, :::21810->8080/tcp   zookeeper-cluster-zoo1-1
    d25d4cbbb2f8   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   22 hours ago    Up 5 hours     2888/tcp, 3888/tcp, 0.0.0.0:2183->2181/tcp, :::2183->2181/tcp, 0.0.0.0:21830->8080/tcp, :::21830->8080/tcp   zookeeper-cluster-zoo3-1

## 3 创建从实例

### 3.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/docker/mysql/mysql-33080/slave/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/docker/mysql/mysql-33080/slave/data

### 3.2 配置文件

    // 设置配置文件
    [root@centos mysql]# vim /root/docker/mysql/mysql-33080/slave/cnf/mysql.cnf
    [root@centos mysql]# cat /root/docker/mysql/mysql-33080/slave/cnf/mysql.cnf
    [mysqld]
    ## 服务ID
    server-id=2
    ## 开启二进制日志
    log-bin=mysql-bin
    ## 二进制日志格式
    binlog-format=ROW
    ## 二进制日志缓存大小
    binlog-cache-size=1M
    ## 二进制日志文件最大尺寸
    max-binlog-size=512M
    ## ROW模式输出SQL
    binlog-rows-query-log-events=TRUE
    ## 二进制日志保留天数
    expire-logs-days=10

    ## 其他配置
    character-set-server=utf8mb4
    collation-server=utf8mb4_general_ci
    
    ## 客户端配置
    [client]
    default-character-set=utf8mb4


### 3.3 创建并启动实例

    // 创建并启动实例
    docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    -p 33082:3306 \
    -v /root/docker/mysql/mysql-33080/slave/cnf:/etc/mysql/conf.d \
    -v /root/docker/mysql/mysql-33080/slave/data:/var/lib/mysql \
    --network network0 \
    --network-alias mysql-33082-slave \
    --name mysql-33082-slave \
    mysql:5.7.zh
    
    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33082:3306 \
    > -v /root/docker/mysql/mysql-33080/slave/cnf:/etc/mysql/conf.d \
    > -v /root/docker/mysql/mysql-33080/slave/data:/var/lib/mysql \
    > --network network0 \
    > --network-alias mysql-33082-slave \
    > --name mysql-33082-slave \
    > mysql:5.7.zh
    f82cc81ec98e6b339d81b42d0c56ef681d405372a8270f24c7456a066b794237
    
    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE                     COMMAND                   CREATED         STATUS         PORTS                                                                                                        NAMES
    f82cc81ec98e   mysql:5.7.zh              "docker-entrypoint.s…"   4 seconds ago   Up 2 seconds   33060/tcp, 0.0.0.0:33082->3306/tcp, :::33082->3306/tcp                                                       mysql-33082-slave
    1e1be6e39fb7   mysql:5.7.zh              "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   33060/tcp, 0.0.0.0:33081->3306/tcp, :::33081->3306/tcp                                                       mysql-33081-master
    a7650129089f   mysql:5.7.zh              "docker-entrypoint.s…"   20 hours ago    Up 4 hours     33060/tcp, 0.0.0.0:33072->3306/tcp, :::33072->3306/tcp                                                       mysql-33072-slave
    b6fd417cb1b1   mysql:5.7.zh              "docker-entrypoint.s…"   21 hours ago    Up 4 hours     33060/tcp, 0.0.0.0:33071->3306/tcp, :::33071->3306/tcp                                                       mysql-33071-master
    b1f79214e313   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   22 hours ago    Up 5 hours     2888/tcp, 3888/tcp, 0.0.0.0:2182->2181/tcp, :::2182->2181/tcp, 0.0.0.0:21820->8080/tcp, :::21820->8080/tcp   zookeeper-cluster-zoo2-1
    0bf4fce71dac   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   22 hours ago    Up 5 hours     2888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp, 3888/tcp, 0.0.0.0:21810->8080/tcp, :::21810->8080/tcp   zookeeper-cluster-zoo1-1
    d25d4cbbb2f8   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   22 hours ago    Up 5 hours     2888/tcp, 3888/tcp, 0.0.0.0:2183->2181/tcp, :::2183->2181/tcp, 0.0.0.0:21830->8080/tcp, :::21830->8080/tcp   zookeeper-cluster-zoo3-1

# 完

# 补充

## 查看二进制日志

打开开关 `binlog-rows-query-log-events=TRUE` 可以查看二进制日志执行的原始`SQL`语句。

进入容器：

    [root@centos mysql]# docker exec -it mysql-33081-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...

查看当前二进制日志位置信息：

    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000003 |     2546 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

查看二进制日志列表：

    mysql> show binary logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   7828591 |
    | mysql-bin.000003 |      2546 |
    +------------------+-----------+
    3 rows in set (0.00 sec)

看某二进制日志文件中的事件列表：

    mysql> show binlog events in 'mysql-bin.000003';
    +------------------+------+----------------+-----------+-------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
    | Log_name         | Pos  | Event_type     | Server_id | End_log_pos | Info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    +------------------+------+----------------+-----------+-------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
    | mysql-bin.000003 |    4 | Format_desc    |         1 |         123 | Server ver: 5.7.41-log, Binlog ver: 4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | mysql-bin.000003 |  123 | Previous_gtids |         1 |         154 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | mysql-bin.000003 |  154 | Anonymous_Gtid |         1 |         219 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | mysql-bin.000003 |  219 | Query          |         1 |         321 | CREATE DATABASE `sample`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | mysql-bin.000003 |  321 | Anonymous_Gtid |         1 |         386 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | mysql-bin.000003 |  386 | Query          |         1 |        1241 | use `sample`; CREATE TABLE `user` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户'                                         |
    | mysql-bin.000003 | 1241 | Anonymous_Gtid |         1 |        1306 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | mysql-bin.000003 | 1306 | Query          |         1 |        1388 | BEGIN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | mysql-bin.000003 | 1388 | Rows_query     |         1 |        1538 | # INSERT INTO `sample`.`user`(`username`, `password`, `nickname`, `telephone`) VALUES ('admin', '123456', '张三', 13512345678)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | mysql-bin.000003 | 1538 | Table_map      |         1 |        1602 | table_id: 110 (sample.user)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | mysql-bin.000003 | 1602 | Write_rows     |         1 |        1688 | table_id: 110 flags: STMT_END_F                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | mysql-bin.000003 | 1688 | Xid            |         1 |        1719 | COMMIT /* xid=70 */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | mysql-bin.000003 | 1719 | Anonymous_Gtid |         1 |        1784 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | mysql-bin.000003 | 1784 | Query          |         1 |        1866 | BEGIN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | mysql-bin.000003 | 1866 | Rows_query     |         1 |        1953 | # UPDATE `sample`.`user` SET `password` = 'abcdef' WHERE `id` = 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | mysql-bin.000003 | 1953 | Table_map      |         1 |        2017 | table_id: 110 (sample.user)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | mysql-bin.000003 | 2017 | Update_rows    |         1 |        2155 | table_id: 110 flags: STMT_END_F                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | mysql-bin.000003 | 2155 | Xid            |         1 |        2186 | COMMIT /* xid=73 */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | mysql-bin.000003 | 2186 | Anonymous_Gtid |         1 |        2251 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | mysql-bin.000003 | 2251 | Query          |         1 |        2325 | BEGIN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | mysql-bin.000003 | 2325 | Rows_query     |         1 |        2365 | # delete from user                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | mysql-bin.000003 | 2365 | Table_map      |         1 |        2429 | table_id: 110 (sample.user)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | mysql-bin.000003 | 2429 | Delete_rows    |         1 |        2515 | table_id: 110 flags: STMT_END_F                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | mysql-bin.000003 | 2515 | Xid            |         1 |        2546 | COMMIT /* xid=104 */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    +------------------+------+----------------+-----------+-------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
    24 rows in set (0.00 sec)

查看某二进制日志文件中的事件列表-指定开始位置：

    mysql> show binlog events in 'mysql-bin.000003' from 1388;
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    | Log_name         | Pos  | Event_type     | Server_id | End_log_pos | Info                                                                                                                             |
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    | mysql-bin.000003 | 1388 | Rows_query     |         1 |        1538 | # INSERT INTO `sample`.`user`(`username`, `password`, `nickname`, `telephone`) VALUES ('admin', '123456', '张三', 13512345678)   |
    | mysql-bin.000003 | 1538 | Table_map      |         1 |        1602 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 1602 | Write_rows     |         1 |        1688 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 1688 | Xid            |         1 |        1719 | COMMIT /* xid=70 */                                                                                                              |
    | mysql-bin.000003 | 1719 | Anonymous_Gtid |         1 |        1784 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                             |
    | mysql-bin.000003 | 1784 | Query          |         1 |        1866 | BEGIN                                                                                                                            |
    | mysql-bin.000003 | 1866 | Rows_query     |         1 |        1953 | # UPDATE `sample`.`user` SET `password` = 'abcdef' WHERE `id` = 1                                                                |
    | mysql-bin.000003 | 1953 | Table_map      |         1 |        2017 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 2017 | Update_rows    |         1 |        2155 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 2155 | Xid            |         1 |        2186 | COMMIT /* xid=73 */                                                                                                              |
    | mysql-bin.000003 | 2186 | Anonymous_Gtid |         1 |        2251 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                             |
    | mysql-bin.000003 | 2251 | Query          |         1 |        2325 | BEGIN                                                                                                                            |
    | mysql-bin.000003 | 2325 | Rows_query     |         1 |        2365 | # delete from user                                                                                                               |
    | mysql-bin.000003 | 2365 | Table_map      |         1 |        2429 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 2429 | Delete_rows    |         1 |        2515 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 2515 | Xid            |         1 |        2546 | COMMIT /* xid=104 */                                                                                                             |
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    16 rows in set (0.00 sec)

查看某二进制日志文件中的事件列表-指定开始位置并限制显示条数：

    mysql> show binlog events in 'mysql-bin.000003' from 1388 limit 15;
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    | Log_name         | Pos  | Event_type     | Server_id | End_log_pos | Info                                                                                                                             |
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    | mysql-bin.000003 | 1388 | Rows_query     |         1 |        1538 | # INSERT INTO `sample`.`user`(`username`, `password`, `nickname`, `telephone`) VALUES ('admin', '123456', '张三', 13512345678)   |
    | mysql-bin.000003 | 1538 | Table_map      |         1 |        1602 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 1602 | Write_rows     |         1 |        1688 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 1688 | Xid            |         1 |        1719 | COMMIT /* xid=70 */                                                                                                              |
    | mysql-bin.000003 | 1719 | Anonymous_Gtid |         1 |        1784 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                             |
    | mysql-bin.000003 | 1784 | Query          |         1 |        1866 | BEGIN                                                                                                                            |
    | mysql-bin.000003 | 1866 | Rows_query     |         1 |        1953 | # UPDATE `sample`.`user` SET `password` = 'abcdef' WHERE `id` = 1                                                                |
    | mysql-bin.000003 | 1953 | Table_map      |         1 |        2017 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 2017 | Update_rows    |         1 |        2155 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 2155 | Xid            |         1 |        2186 | COMMIT /* xid=73 */                                                                                                              |
    | mysql-bin.000003 | 2186 | Anonymous_Gtid |         1 |        2251 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                             |
    | mysql-bin.000003 | 2251 | Query          |         1 |        2325 | BEGIN                                                                                                                            |
    | mysql-bin.000003 | 2325 | Rows_query     |         1 |        2365 | # delete from user                                                                                                               |
    | mysql-bin.000003 | 2365 | Table_map      |         1 |        2429 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 2429 | Delete_rows    |         1 |        2515 | table_id: 110 flags: STMT_END_F                                                                                                  |
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    15 rows in set (0.00 sec)

查看某二进制日志文件中的事件列表-从头开始并限制显示条数：

    mysql> show binlog events in 'mysql-bin.000003' limit 4;
    +------------------+-----+----------------+-----------+-------------+---------------------------------------+
    | Log_name         | Pos | Event_type     | Server_id | End_log_pos | Info                                  |
    +------------------+-----+----------------+-----------+-------------+---------------------------------------+
    | mysql-bin.000003 |   4 | Format_desc    |         1 |         123 | Server ver: 5.7.41-log, Binlog ver: 4 |
    | mysql-bin.000003 | 123 | Previous_gtids |         1 |         154 |                                       |
    | mysql-bin.000003 | 154 | Anonymous_Gtid |         1 |         219 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'  |
    | mysql-bin.000003 | 219 | Query          |         1 |         321 | CREATE DATABASE `sample`              |
    +------------------+-----+----------------+-----------+-------------+---------------------------------------+
    4 rows in set (0.00 sec)

查看某二进制日志文件中的事件列表-指定从第几条开始并限制显示条数：

    mysql> show binlog events in 'mysql-bin.000003' limit 8, 15;
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    | Log_name         | Pos  | Event_type     | Server_id | End_log_pos | Info                                                                                                                             |
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    | mysql-bin.000003 | 1388 | Rows_query     |         1 |        1538 | # INSERT INTO `sample`.`user`(`username`, `password`, `nickname`, `telephone`) VALUES ('admin', '123456', '张三', 13512345678)   |
    | mysql-bin.000003 | 1538 | Table_map      |         1 |        1602 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 1602 | Write_rows     |         1 |        1688 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 1688 | Xid            |         1 |        1719 | COMMIT /* xid=70 */                                                                                                              |
    | mysql-bin.000003 | 1719 | Anonymous_Gtid |         1 |        1784 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                             |
    | mysql-bin.000003 | 1784 | Query          |         1 |        1866 | BEGIN                                                                                                                            |
    | mysql-bin.000003 | 1866 | Rows_query     |         1 |        1953 | # UPDATE `sample`.`user` SET `password` = 'abcdef' WHERE `id` = 1                                                                |
    | mysql-bin.000003 | 1953 | Table_map      |         1 |        2017 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 2017 | Update_rows    |         1 |        2155 | table_id: 110 flags: STMT_END_F                                                                                                  |
    | mysql-bin.000003 | 2155 | Xid            |         1 |        2186 | COMMIT /* xid=73 */                                                                                                              |
    | mysql-bin.000003 | 2186 | Anonymous_Gtid |         1 |        2251 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'                                                                                             |
    | mysql-bin.000003 | 2251 | Query          |         1 |        2325 | BEGIN                                                                                                                            |
    | mysql-bin.000003 | 2325 | Rows_query     |         1 |        2365 | # delete from user                                                                                                               |
    | mysql-bin.000003 | 2365 | Table_map      |         1 |        2429 | table_id: 110 (sample.user)                                                                                                      |
    | mysql-bin.000003 | 2429 | Delete_rows    |         1 |        2515 | table_id: 110 flags: STMT_END_F                                                                                                  |
    +------------------+------+----------------+-----------+-------------+----------------------------------------------------------------------------------------------------------------------------------+
    15 rows in set (0.00 sec)

通过这些信息就可以知道某条误操作`SQL`的执行位置，为使用 `mysqlbinlog` 恢复数据提供位置信息。