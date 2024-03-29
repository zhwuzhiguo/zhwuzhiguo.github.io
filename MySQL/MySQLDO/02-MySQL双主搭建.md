# 02-MySQL双主搭建

使用 `docker` 搭建 `MySQL` 双主结构。

## 1 创建网络

    // 创建网络 network-33070
    [root@centos mysql]# docker network create network-33070
    cf5bfb58b37e3ba283d963d312c2cea144913d1fc79bc6bc5b47b90cd4b82332
    
    [root@centos mysql]# docker network ls
    NETWORK ID     NAME            DRIVER    SCOPE
    3528c4b9b0c5   bridge          bridge    local
    c1baf3b0966d   host            host      local
    ee30cd8524db   network-33060   bridge    local
    cf5bfb58b37e   network-33070   bridge    local
    2656d3bb9028   none            null      local

## 2 创建主实例

### 2.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33070/master/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33070/master/data

### 2.2 配置文件

    // 设置配置文件
    [root@centos mysql]# cat /root/mysql/mysql-33070/master/cnf/mysql.cnf
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
    ## 作为从实例时:
    ## 同步执行的主实例二进制日志
    ## 也写入本实例的二进制日志中
    ## 这样本实例的其他从实例能同步取到完整的二进制日志
    log-slave-updates=TRUE
    ## 本实例读写状态
    read-only=FALSE

    ## 中继日志
    relay-log=mysql-relay-bin
    ## 同步函数和存储过程
    log-bin-trust-function-creators=TRUE
    
    ## 其他配置
    character-set-server=utf8mb4
    collation-server=utf8mb4_general_ci
    
    ## 客户端配置
    [client]
    default-character-set=utf8mb4

### 2.3 创建并启动实例

    // 创建并启动实例
    docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    -p 33071:3306 \
    -v /root/mysql/mysql-33070/master/cnf:/etc/mysql/conf.d \
    -v /root/mysql/mysql-33070/master/data:/var/lib/mysql \
    --network network-33070 \
    --network-alias mysql-33071-master \
    --name mysql-33071-master \
    mysql:5.7.zh

    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33071:3306 \
    > -v /root/mysql/mysql-33070/master/cnf:/etc/mysql/conf.d \
    > -v /root/mysql/mysql-33070/master/data:/var/lib/mysql \
    > --network network-33070 \
    > --network-alias mysql-33071-master \
    > --name mysql-33071-master \
    > mysql:5.7.zh
    261ae0a960e711a27d308c29abe4b655af8c08a9f45f19ef3bd7cd7db8ce6ea8
    
    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE          COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
    261ae0a960e7   mysql:5.7.zh   "docker-entrypoint.s…"   9 seconds ago   Up 8 seconds   33060/tcp, 0.0.0.0:33071->3306/tcp, :::33071->3306/tcp   mysql-33071-master

### 2.4 添加复制数据的用户

    // 进入容器并连接MySQL
    [root@centos mysql]# docker exec -it mysql-33071-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 创建复制用户reader并赋予复制数据权限
    mysql> GRANT REPLICATION SLAVE ON *.* TO 'reader'@'%' IDENTIFIED BY '123456';
    Query OK, 0 rows affected, 1 warning (0.00 sec)
    
    // 刷新权限
    mysql> FLUSH PRIVILEGES;
    Query OK, 0 rows affected (0.00 sec)

## 3 创建从实例

### 3.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33070/slave/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33070/slave/data

### 3.2 配置文件

    // 设置配置文件
    [root@centos mysql]# cat /root/mysql/mysql-33070/slave/cnf/mysql.cnf
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
    ## 作为从实例时:
    ## 同步执行的主实例二进制日志
    ## 也写入本实例的二进制日志中
    ## 这样本实例的其他从实例能同步取到完整的二进制日志
    log-slave-updates=TRUE
    ## 本实例读写状态
    read-only=TRUE

    ## 中继日志
    relay-log=mysql-relay-bin
    ## 同步函数和存储过程
    log-bin-trust-function-creators=TRUE
    
    ## 其他配置
    character-set-server=utf8mb4
    collation-server=utf8mb4_general_ci
    
    ## 客户端配置
    [client]
    default-character-set=utf8mb4

### 3.3 创建并启动实例

    // 创建并启动实例
    docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    -p 33072:3306 \
    -v /root/mysql/mysql-33070/slave/cnf:/etc/mysql/conf.d \
    -v /root/mysql/mysql-33070/slave/data:/var/lib/mysql \
    --network network-33070 \
    --network-alias mysql-33072-slave \
    --name mysql-33072-slave \
    mysql:5.7.zh
    
    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33072:3306 \
    > -v /root/mysql/mysql-33070/slave/cnf:/etc/mysql/conf.d \
    > -v /root/mysql/mysql-33070/slave/data:/var/lib/mysql \
    > --network network-33070 \
    > --network-alias mysql-33072-slave \
    > --name mysql-33072-slave \
    > mysql:5.7.zh
    0331487d2f6d26883937015d920c04e4619daca289ecc380f39d32452e5a36f7
    
    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE          COMMAND                   CREATED          STATUS          PORTS                                                    NAMES
    0331487d2f6d   mysql:5.7.zh   "docker-entrypoint.s…"   6 seconds ago    Up 5 seconds    33060/tcp, 0.0.0.0:33072->3306/tcp, :::33072->3306/tcp   mysql-33072-slave
    261ae0a960e7   mysql:5.7.zh   "docker-entrypoint.s…"   12 minutes ago   Up 12 minutes   33060/tcp, 0.0.0.0:33071->3306/tcp, :::33071->3306/tcp   mysql-33071-master

### 3.4 添加复制数据的用户

    // 进入容器并连接MySQL
    [root@centos mysql]# docker exec -it mysql-33072-slave /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 创建复制用户reader并赋予复制数据权限
    mysql> GRANT REPLICATION SLAVE ON *.* TO 'reader'@'%' IDENTIFIED BY '123456';
    Query OK, 0 rows affected, 1 warning (0.00 sec)
    
    // 刷新权限
    mysql> FLUSH PRIVILEGES;
    Query OK, 0 rows affected (0.00 sec)

## 4 配置主实例和从实例互为备库

### 4.1 查看主实例和从实例的二进制日志位置信息

在`主实例`上查看 `MASTER_LOG_FILE` 和 `MASTER_LOG_POS` 两个参数：

    mysql> SHOW MASTER STATUS;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000003 |      591 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+

在`从实例`上查看 `MASTER_LOG_FILE` 和 `MASTER_LOG_POS` 两个参数：

    mysql> SHOW MASTER STATUS;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000003 |      591 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+

### 4.2 配置从实例连接主实例的信息

在`从实例`上进行`主实例`的连接信息的设置：

    CHANGE MASTER TO
    MASTER_HOST='mysql-33071-master',
    MASTER_PORT=3306,
    MASTER_USER='reader',
    MASTER_PASSWORD='123456',
    MASTER_LOG_FILE='mysql-bin.000003',
    MASTER_LOG_POS=591;

    // 设置连接信息
    mysql> CHANGE MASTER TO
        -> MASTER_HOST='mysql-33071-master',
        -> MASTER_PORT=3306,
        -> MASTER_USER='reader',
        -> MASTER_PASSWORD='123456',
        -> MASTER_LOG_FILE='mysql-bin.000003',
        -> MASTER_LOG_POS=591;
    Query OK, 0 rows affected, 2 warnings (0.01 sec)
    
    // 启动同步
    mysql> START SLAVE;
    Query OK, 0 rows affected (0.00 sec)
    
    // 查看同步状态
    mysql> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
                   Slave_IO_State: Waiting for master to send event
                      Master_Host: mysql-33071-master
                      Master_User: reader
                      Master_Port: 3306
                    Connect_Retry: 60
                  Master_Log_File: mysql-bin.000003
              Read_Master_Log_Pos: 591
                   Relay_Log_File: mysql-relay-bin.000002
                    Relay_Log_Pos: 320
            Relay_Master_Log_File: mysql-bin.000003
                 Slave_IO_Running: Yes
                Slave_SQL_Running: Yes
                  Replicate_Do_DB:
              Replicate_Ignore_DB:
               Replicate_Do_Table:
           Replicate_Ignore_Table:
          Replicate_Wild_Do_Table:
      Replicate_Wild_Ignore_Table:
                       Last_Errno: 0
                       Last_Error:
                     Skip_Counter: 0
              Exec_Master_Log_Pos: 591
                  Relay_Log_Space: 527
                  Until_Condition: None
                   Until_Log_File:
                    Until_Log_Pos: 0
               Master_SSL_Allowed: No
               Master_SSL_CA_File:
               Master_SSL_CA_Path:
                  Master_SSL_Cert:
                Master_SSL_Cipher:
                   Master_SSL_Key:
            Seconds_Behind_Master: 0
    Master_SSL_Verify_Server_Cert: No
                    Last_IO_Errno: 0
                    Last_IO_Error:
                   Last_SQL_Errno: 0
                   Last_SQL_Error:
      Replicate_Ignore_Server_Ids:
                 Master_Server_Id: 1
                      Master_UUID: 7b9b089c-c24c-11ed-90d4-0242c0a8b002
                 Master_Info_File: /var/lib/mysql/master.info
                        SQL_Delay: 0
              SQL_Remaining_Delay: NULL
          Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
               Master_Retry_Count: 86400
                      Master_Bind:
          Last_IO_Error_Timestamp:
         Last_SQL_Error_Timestamp:
                   Master_SSL_Crl:
               Master_SSL_Crlpath:
               Retrieved_Gtid_Set:
                Executed_Gtid_Set:
                    Auto_Position: 0
             Replicate_Rewrite_DB:
                     Channel_Name:
               Master_TLS_Version:
    1 row in set (0.00 sec)

### 4.3 配置主实例连接从实例的信息

在`主实例`上进行`从实例`的连接信息的设置：

    CHANGE MASTER TO
    MASTER_HOST='mysql-33072-slave',
    MASTER_PORT=3306,
    MASTER_USER='reader',
    MASTER_PASSWORD='123456',
    MASTER_LOG_FILE='mysql-bin.000003',
    MASTER_LOG_POS=591;
    
    // 设置连接信息
    mysql> CHANGE MASTER TO
        -> MASTER_HOST='mysql-33072-slave',
        -> MASTER_PORT=3306,
        -> MASTER_USER='reader',
        -> MASTER_PASSWORD='123456',
        -> MASTER_LOG_FILE='mysql-bin.000003',
        -> MASTER_LOG_POS=591;
    Query OK, 0 rows affected, 2 warnings (0.02 sec)
    
    // 启动同步
    mysql> START SLAVE;
    Query OK, 0 rows affected (0.00 sec)
    
    // 查看同步状态
    mysql> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
                   Slave_IO_State: Waiting for master to send event
                      Master_Host: mysql-33072-slave
                      Master_User: reader
                      Master_Port: 3306
                    Connect_Retry: 60
                  Master_Log_File: mysql-bin.000003
              Read_Master_Log_Pos: 591
                   Relay_Log_File: mysql-relay-bin.000002
                    Relay_Log_Pos: 320
            Relay_Master_Log_File: mysql-bin.000003
                 Slave_IO_Running: Yes
                Slave_SQL_Running: Yes
                  Replicate_Do_DB:
              Replicate_Ignore_DB:
               Replicate_Do_Table:
           Replicate_Ignore_Table:
          Replicate_Wild_Do_Table:
      Replicate_Wild_Ignore_Table:
                       Last_Errno: 0
                       Last_Error:
                     Skip_Counter: 0
              Exec_Master_Log_Pos: 591
                  Relay_Log_Space: 527
                  Until_Condition: None
                   Until_Log_File:
                    Until_Log_Pos: 0
               Master_SSL_Allowed: No
               Master_SSL_CA_File:
               Master_SSL_CA_Path:
                  Master_SSL_Cert:
                Master_SSL_Cipher:
                   Master_SSL_Key:
            Seconds_Behind_Master: 0
    Master_SSL_Verify_Server_Cert: No
                    Last_IO_Errno: 0
                    Last_IO_Error:
                   Last_SQL_Errno: 0
                   Last_SQL_Error:
      Replicate_Ignore_Server_Ids:
                 Master_Server_Id: 2
                      Master_UUID: 2e9ca4a3-c24e-11ed-a015-0242c0a8b003
                 Master_Info_File: /var/lib/mysql/master.info
                        SQL_Delay: 0
              SQL_Remaining_Delay: NULL
          Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
               Master_Retry_Count: 86400
                      Master_Bind:
          Last_IO_Error_Timestamp:
         Last_SQL_Error_Timestamp:
                   Master_SSL_Crl:
               Master_SSL_Crlpath:
               Retrieved_Gtid_Set:
                Executed_Gtid_Set:
                    Auto_Position: 0
             Replicate_Rewrite_DB:
                     Channel_Name:
               Master_TLS_Version:
    1 row in set (0.00 sec)

# 完