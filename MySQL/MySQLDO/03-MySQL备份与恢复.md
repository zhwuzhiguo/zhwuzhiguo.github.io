# 03-MySQL备份与恢复

删库删表操作可以通过数据库全量备份和增量二进制日志恢复：
- `drop database`
- `drop table`
- `truncate table`

下面通过`主实例主库`的`全量备份`和`二进制增量日志`恢复`从实例备库`。

## 1 创建网络

    [root@centos mysql]# docker network create network-33080
    b05ced53d58dcef4de2b5fb8861ec2b508cb87a6818ff94810efcc47e36faae2

    [root@centos mysql]# docker network ls
    NETWORK ID     NAME            DRIVER    SCOPE
    3528c4b9b0c5   bridge          bridge    local
    c1baf3b0966d   host            host      local
    b05ced53d58d   network-33080   bridge    local
    2656d3bb9028   none            null      local

## 2 创建主实例

### 2.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33080/master/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33080/master/data

### 2.2 配置文件

    // 设置配置文件
    [root@centos mysql]# cat /root/mysql/mysql-33080/master/cnf/mysql.cnf
    [mysqld]
    ## 服务ID
    server-id=1
    ## 开启二进制日志
    log-bin=mysql-bin
    ## 二进制日志格式
    binlog-format=ROW
    ## 二进制日志缓存大小
    binlog-cache-size=1M
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
    -v /root/mysql/mysql-33080/master/cnf:/etc/mysql/conf.d \
    -v /root/mysql/mysql-33080/master/data:/var/lib/mysql \
    --network network-33080 \
    --network-alias mysql-33081-master \
    --name mysql-33081-master \
    mysql:5.7.zh

    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33081:3306 \
    > -v /root/mysql/mysql-33080/master/cnf:/etc/mysql/conf.d \
    > -v /root/mysql/mysql-33080/master/data:/var/lib/mysql \
    > --network network-33080 \
    > --network-alias mysql-33081-master \
    > --name mysql-33081-master \
    > mysql:5.7.zh
    87f10374788f587eafa561dc9ff92c92815f95b678367dc9caede0d87d98dc72

    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE          COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
    87f10374788f   mysql:5.7.zh   "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   33060/tcp, 0.0.0.0:33081->3306/tcp, :::33081->3306/tcp   mysql-33081-master

## 3 创建从实例

### 3.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33080/slave/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33080/slave/data

### 3.2 配置文件

    // 设置配置文件
    [root@centos mysql]# cat /root/mysql/mysql-33080/slave/cnf/mysql.cnf
    [mysqld]
    ## 服务ID
    server-id=2
    ## 开启二进制日志
    log-bin=mysql-bin
    ## 二进制日志格式
    binlog-format=ROW
    ## 二进制日志缓存大小
    binlog-cache-size=1M
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
    -v /root/mysql/mysql-33080/slave/cnf:/etc/mysql/conf.d \
    -v /root/mysql/mysql-33080/slave/data:/var/lib/mysql \
    --network network-33080 \
    --network-alias mysql-33082-slave \
    --name mysql-33082-slave \
    mysql:5.7.zh
    
    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33082:3306 \
    > -v /root/mysql/mysql-33080/slave/cnf:/etc/mysql/conf.d \
    > -v /root/mysql/mysql-33080/slave/data:/var/lib/mysql \
    > --network network-33080 \
    > --network-alias mysql-33082-slave \
    > --name mysql-33082-slave \
    > mysql:5.7.zh
    842b704b58158fbe45ab624834bcf7e547f7a7436dbd057f5540903fadc27186

    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE          COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
    842b704b5815   mysql:5.7.zh   "docker-entrypoint.s…"   5 seconds ago   Up 3 seconds   33060/tcp, 0.0.0.0:33082->3306/tcp, :::33082->3306/tcp   mysql-33082-slave
    87f10374788f   mysql:5.7.zh   "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   33060/tcp, 0.0.0.0:33081->3306/tcp, :::33081->3306/tcp   mysql-33081-master

## 4 主实例备份

### 4.1 创建数据库并插入数据

    // 进入容器
    [root@centos mysql]# docker exec -it mysql-33081-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 创建数据库
    mysql> create database sample;
    Query OK, 1 row affected (0.00 sec)
    
    // 创建表
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
        ->   UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引',
        ->   KEY idx_status (status) USING BTREE COMMENT '用户状态索引'
        -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';
    Query OK, 0 rows affected (0.03 sec)
    
    // 插入数据
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES
        -> ('aaaaa1', '123456', '全量用户1', 13512345678, 0),
        -> ('aaaaa2', '123456', '全量用户2', 13512345678, 0),
        -> ('aaaaa3', '123456', '全量用户3', 13512345678, 0),
        -> ('aaaaa4', '123456', '全量用户4', 13512345678, 0),
        -> ('aaaaa5', '123456', '全量用户5', 13512345678, 0);
    Query OK, 5 rows affected (0.01 sec)
    Records: 5  Duplicates: 0  Warnings: 0
    
    // 当前数据
    mysql> select * from user;
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname      | telephone   | status | create_time         | update_time         |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    |  1 | aaaaa1   | 123456   | 全量用户1     | 13512345678 |      0 | 2023-03-21 15:25:39 | 2023-03-21 15:25:39 |
    |  2 | aaaaa2   | 123456   | 全量用户2     | 13512345678 |      0 | 2023-03-21 15:25:39 | 2023-03-21 15:25:39 |
    |  3 | aaaaa3   | 123456   | 全量用户3     | 13512345678 |      0 | 2023-03-21 15:25:39 | 2023-03-21 15:25:39 |
    |  4 | aaaaa4   | 123456   | 全量用户4     | 13512345678 |      0 | 2023-03-21 15:25:39 | 2023-03-21 15:25:39 |
    |  5 | aaaaa5   | 123456   | 全量用户5     | 13512345678 |      0 | 2023-03-21 15:25:39 | 2023-03-21 15:25:39 |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    5 rows in set (0.00 sec)
    
    // 当前二进制日志位置
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000003 |     1855 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    // 当前二进制日志文件
    mysql> show master logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   2940738 |
    | mysql-bin.000003 |      1855 |
    +------------------+-----------+
    3 rows in set (0.00 sec)

### 4.2 全量备份主库

    // 指定单个数据库，不生成创建数据库脚本
    mysqldump [OPTIONS] database [tables]
    // 指定多个数据库，会生成创建数据库脚本
    mysqldump [OPTIONS] --databases [OPTIONS] DB1 [DB2 DB3...]
    mysqldump [OPTIONS] --all-databases [OPTIONS]

备份数据库：

    mysqldump \
    --host=127.0.0.1 \
    --port=33081 \
    --user=root \
    --password=123456 \
    --master-data=2 \
    --single-transaction \
    --flush-logs \
    --databases sample > sample.sql

其中：
- `--master-data=2` - 在备份文件中生成带注释的当前二进制日志位置信息。
- `--single-transaction` - 启动事务进行备份，保证数据一致性。
- `--flush-logs` - 启动备份前刷新二进制日志。
- `--databases` - 使用 databases 指定数据库会生成创建数据库脚本。

实例：

    [root@centos backup]# mysqldump \
    > --host=127.0.0.1 \
    > --port=33081 \
    > --user=root \
    > --password=123456 \
    > --master-data=2 \
    > --single-transaction \
    > --flush-logs \
    > --databases sample > sample.sql
    mysqldump: [Warning] Using a password on the command line interface can be insecure.

备份文件 `sample.sql` 中记录了当前二进制日志位置信息：

    ...
    -- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000004', MASTER_LOG_POS=154;
    ...

再次查看二进制日志信息：

    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000004 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    
    mysql> show master logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   2940738 |
    | mysql-bin.000003 |      1902 |
    | mysql-bin.000004 |       154 |
    +------------------+-----------+

### 4.3 创建另一个数据库并插入数据

模拟增量二进制日志中还有其他数据库的操作记录：

    mysql> create database temp;
    Query OK, 1 row affected (0.01 sec)
    
    mysql> use temp;
    Database changed
    mysql> CREATE TABLE employee (
        ->   id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
        ->   username varchar(32) NOT NULL COMMENT '用户名',
        ->   password varchar(32) NOT NULL COMMENT '用户密码',
        ->   nickname varchar(32) NOT NULL COMMENT '用户昵称',
        ->   telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
        ->   status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
        ->   create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        ->   update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        ->   PRIMARY KEY (id) USING BTREE,
        ->   UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引',
        ->   KEY idx_status (status) USING BTREE COMMENT '用户状态索引'
        -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工';
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> INSERT INTO employee(username, password, nickname, telephone, status) VALUES
        -> ('eeeee1', '123456', '员工1', 13512345678, 0),
        -> ('eeeee2', '123456', '员工2', 13512345678, 0),
        -> ('eeeee3', '123456', '员工3', 13512345678, 0);
    Query OK, 3 rows affected (0.01 sec)
    Records: 3  Duplicates: 0  Warnings: 0
    
    mysql> select * from employee;
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname | telephone   | status | create_time         | update_time         |
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    |  1 | eeeee1   | 123456   | 员工1    | 13512345678 |      0 | 2023-03-22 18:57:37 | 2023-03-22 18:57:37 |
    |  2 | eeeee2   | 123456   | 员工2    | 13512345678 |      0 | 2023-03-22 18:57:37 | 2023-03-22 18:57:37 |
    |  3 | eeeee3   | 123456   | 员工3    | 13512345678 |      0 | 2023-03-22 18:57:37 | 2023-03-22 18:57:37 |
    +----+----------+----------+----------+-------------+--------+---------------------+---------------------+
    3 rows in set (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000004 |     1713 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    mysql> show master logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   2940738 |
    | mysql-bin.000003 |      1902 |
    | mysql-bin.000004 |      1713 |
    +------------------+-----------+
    4 rows in set (0.00 sec)

### 4.4 继续插入数据并模拟误删数据

    // 继续插入数据
    mysql> use sample;
    Database changed
    
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES ('bbbbb1', '123456', '增量用户1', 13512345678, 0);
    Query OK, 1 row affected (0.01 sec)
    
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES ('bbbbb2', '123456', '增量用户2', 13512345678, 0);
    Query OK, 1 row affected (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000004 |     2385 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    mysql> show master logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   2940738 |
    | mysql-bin.000003 |      1902 |
    | mysql-bin.000004 |      2385 |
    +------------------+-----------+
    4 rows in set (0.00 sec)
    
    // 刷新二进制日志使用新文件
    // 模拟增量恢复需要从多个二进制文件恢复的情况
    mysql> flush logs;
    Query OK, 0 rows affected (0.00 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000005 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    mysql> show master logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   2940738 |
    | mysql-bin.000003 |      1902 |
    | mysql-bin.000004 |      2432 |
    | mysql-bin.000005 |       154 |
    +------------------+-----------+
    5 rows in set (0.00 sec)
    
    // 继续插入数据
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES ('bbbbb3', '123456', '增量用户3', 13512345678, 0);
    Query OK, 1 row affected (0.00 sec)
    
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES ('bbbbb4', '123456', '增量用户4', 13512345678, 0);
    Query OK, 1 row affected (0.01 sec)
    
    mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES ('bbbbb5', '123456', '增量用户5', 13512345678, 0);
    Query OK, 1 row affected (0.00 sec)
    
    // 同时更新数据
    mysql> update user set password = 'xxxxxx' where id = 1;
    Query OK, 1 row affected (0.00 sec)
    Rows matched: 1  Changed: 1  Warnings: 0
    
    // 当前数据
    mysql> select * from user;
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname      | telephone   | status | create_time         | update_time         |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    |  1 | aaaaa1   | xxxxxx   | 全量用户1     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 19:10:07 |
    |  2 | aaaaa2   | 123456   | 全量用户2     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  3 | aaaaa3   | 123456   | 全量用户3     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  4 | aaaaa4   | 123456   | 全量用户4     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  5 | aaaaa5   | 123456   | 全量用户5     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  6 | bbbbb1   | 123456   | 增量用户1     | 13512345678 |      0 | 2023-03-22 19:04:45 | 2023-03-22 19:04:45 |
    |  7 | bbbbb2   | 123456   | 增量用户2     | 13512345678 |      0 | 2023-03-22 19:05:07 | 2023-03-22 19:05:07 |
    |  8 | bbbbb3   | 123456   | 增量用户3     | 13512345678 |      0 | 2023-03-22 19:08:48 | 2023-03-22 19:08:48 |
    |  9 | bbbbb4   | 123456   | 增量用户4     | 13512345678 |      0 | 2023-03-22 19:08:56 | 2023-03-22 19:08:56 |
    | 10 | bbbbb5   | 123456   | 增量用户5     | 13512345678 |      0 | 2023-03-22 19:09:04 | 2023-03-22 19:09:04 |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    10 rows in set (0.00 sec)
    
    // 误操作截断表
    mysql> truncate user;
    Query OK, 0 rows affected (0.02 sec)
    
    mysql> select * from user;
    Empty set (0.00 sec)
    
    // 当前二进制日志位置
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000005 |     1705 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    // 当前二进制日志文件
    mysql> show master logs;
    +------------------+-----------+
    | Log_name         | File_size |
    +------------------+-----------+
    | mysql-bin.000001 |       177 |
    | mysql-bin.000002 |   2940738 |
    | mysql-bin.000003 |      1902 |
    | mysql-bin.000004 |      2432 |
    | mysql-bin.000005 |      1705 |
    +------------------+-----------+
    5 rows in set (0.00 sec)

## 5 从实例恢复

### 5.1 准备全量备份日志和增量二进制日志：

    [root@centos backup]# ll
    总用量 2896
    -rw-r----- 1 root root     177 3月  22 19:13 mysql-bin.000001
    -rw-r----- 1 root root 2940738 3月  22 19:13 mysql-bin.000002
    -rw-r----- 1 root root    1902 3月  22 19:13 mysql-bin.000003
    -rw-r----- 1 root root    2432 3月  22 19:13 mysql-bin.000004
    -rw-r----- 1 root root    1705 3月  22 19:13 mysql-bin.000005
    -rw-r----- 1 root root      95 3月  22 19:13 mysql-bin.index
    -rw-r--r-- 1 root root    3329 3月  22 18:44 sample.sql

### 5.2 恢复全量备份数据

恢复全量备份：

    mysql [OPTIONS] [database]

    // 全量备份不包含创建数据库脚本
    // 执行前需要先手动创建库
    mysql --host=127.0.0.1 --port=33082 --user=root --password=123456 sample < sample.sql

    // 全量备份包含创建数据库脚本
    // 执行前不需要手动创建库
    mysql --host=127.0.0.1 --port=33082 --user=root --password=123456 < sample.sql

    // 实例
    [root@centos backup]# mysql --host=127.0.0.1 --port=33082 --user=root --password=123456 < sample.sql
    mysql: [Warning] Using a password on the command line interface can be insecure.

查看数据：

    [root@centos backup]# docker exec -it mysql-33082-slave /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sample             |
    | sys                |
    +--------------------+
    5 rows in set (0.00 sec)
    
    mysql> use sample;
    Database changed
    
    mysql> show tables;
    +------------------+
    | Tables_in_sample |
    +------------------+
    | user             |
    +------------------+
    1 row in set (0.00 sec)
    
    mysql> select * from user;
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname      | telephone   | status | create_time         | update_time         |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    |  1 | aaaaa1   | 123456   | 全量用户1     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  2 | aaaaa2   | 123456   | 全量用户2     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  3 | aaaaa3   | 123456   | 全量用户3     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  4 | aaaaa4   | 123456   | 全量用户4     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  5 | aaaaa5   | 123456   | 全量用户5     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    5 rows in set (0.00 sec)

### 5.3 恢复增量备份数据

    mysqlbinlog [options] log-files

输出二进制日志，可用于查看或通过管道输出给 `MySQL` 命令行客户端：
- `--database=name` - 指定输出某数据库的二进制日志，不指定输出全部。
- `--verbose` - 构造行事件的伪`SQL`语句。
- `--start-position=#` - 开始读二进制日志的位置，应用在命令行参数中的第一个二进制日志文件。
- `--stop-position=#` -  停止读二进制日志的位置，应用在命令行参数中的最后一个二进制日志文件。   
- `--start-datetime='2004-12-25 11:25:56'` - 开始读二进制日志的时间点，从等于或大于该时间点的第一个事件开始。
- `--stop-datetime='2004-12-25 11:25:56'` -  停止读二进制日志的时间点，到等于或大于该时间点的第一个事件停止。

查看二进制日志：

    // 找出误操作 truncate user 执行的位置:
    // mysql-bin.000005
    // 1623
    [root@centos backup]# mysqlbinlog --verbose --database=sample mysql-bin.000004 | grep -C 10 'truncate user'
    WARNING: The option --database has been used. It may filter parts of transactions, but will include the GTIDs in any case. If you want to exclude or include transactions, you should use the options --exclude-gtids or --include-gtids, respectively, instead.
    
    [root@centos backup]# mysqlbinlog --verbose --database=sample mysql-bin.000005 | grep -C 10 'truncate user'
    WARNING: The option --database has been used. It may filter parts of transactions, but will include the GTIDs in any case. If you want to exclude or include transactions, you should use the options --exclude-gtids or --include-gtids, respectively, instead.
    # at 1527
    #230322 19:10:07 server id 1  end_log_pos 1558 CRC32 0x1b95f28f 	Xid = 74
    COMMIT/*!*/;
    # at 1558
    #230322 19:10:41 server id 1  end_log_pos 1623 CRC32 0xcb527c82 	Anonymous_GTID	last_committed=4	sequence_number=5	rbr_only=no
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 1623
    #230322 19:10:41 server id 1  end_log_pos 1705 CRC32 0x53e22053 	Query	thread_id=2	exec_time=0	error_code=0
    use `sample`/*!*/;
    SET TIMESTAMP=1679483441/*!*/;
    truncate user
    /*!*/;
    SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
    DELIMITER ;
    # End of log file
    /*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=0*/;

恢复二进制日志：

    // 恢复数据库 sample 的二进制日志
    // 开始位置:
    // 从全量备份时的位置: 
    // mysql-bin.000004
    // 154
    // 结束位置:
    // 执行 truncate user 的位置
    // mysql-bin.000005
    // 1623
    [root@centos backup]# mysqlbinlog --database=sample --start-position=154 --stop-position=1623 mysql-bin.000004 mysql-bin.000005 | mysql --host=127.0.0.1 --port=33082 --user=root --password=123456
    WARNING: The option --database has been used. It may filter parts of transactions, but will include the GTIDs in any case. If you want to exclude or include transactions, you should use the options --exclude-gtids or --include-gtids, respectively, instead.
    mysql: [Warning] Using a password on the command line interface can be insecure.

查看数据：

    [root@centos backup]# docker exec -it mysql-33082-slave /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sample             |
    | sys                |
    +--------------------+
    5 rows in set (0.00 sec)
    
    mysql> use sample;
    Database changed
    mysql> show tables;
    +------------------+
    | Tables_in_sample |
    +------------------+
    | user             |
    +------------------+
    1 row in set (0.00 sec)
    
    mysql> select * from user;
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname      | telephone   | status | create_time         | update_time         |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    |  1 | aaaaa1   | xxxxxx   | 全量用户1     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 19:10:07 |
    |  2 | aaaaa2   | 123456   | 全量用户2     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  3 | aaaaa3   | 123456   | 全量用户3     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  4 | aaaaa4   | 123456   | 全量用户4     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  5 | aaaaa5   | 123456   | 全量用户5     | 13512345678 |      0 | 2023-03-22 18:41:05 | 2023-03-22 18:41:05 |
    |  6 | bbbbb1   | 123456   | 增量用户1     | 13512345678 |      0 | 2023-03-22 19:04:45 | 2023-03-22 19:04:45 |
    |  7 | bbbbb2   | 123456   | 增量用户2     | 13512345678 |      0 | 2023-03-22 19:05:07 | 2023-03-22 19:05:07 |
    |  8 | bbbbb3   | 123456   | 增量用户3     | 13512345678 |      0 | 2023-03-22 19:08:48 | 2023-03-22 19:08:48 |
    |  9 | bbbbb4   | 123456   | 增量用户4     | 13512345678 |      0 | 2023-03-22 19:08:56 | 2023-03-22 19:08:56 |
    | 10 | bbbbb5   | 123456   | 增量用户5     | 13512345678 |      0 | 2023-03-22 19:09:04 | 2023-03-22 19:09:04 |
    +----+----------+----------+---------------+-------------+--------+---------------------+---------------------+
    10 rows in set (0.00 sec)

# 完

# 附
- [sample.sql](./03-MySQL备份与恢复/sample.sql.md)
- [mysql-bin.000003](./03-MySQL备份与恢复/mysql-bin.000003.md)
- [mysql-bin.000004](./03-MySQL备份与恢复/mysql-bin.000004.md)
- [mysql-bin.000005](./03-MySQL备份与恢复/mysql-bin.000005.md)
