# 01-MySQL主从搭建

`docker` 搭建 `MySQL` 主从结构。

## 1 创建网络

    // 创建网络 network-33060
    [root@centos mysql]# docker network create network-33060
    ee30cd8524db2272c4f5ee47457cd98f66ab0980b8437d2db72486e70c289143
    
    [root@centos mysql]# docker network ls
    NETWORK ID     NAME            DRIVER    SCOPE
    3528c4b9b0c5   bridge          bridge    local
    c1baf3b0966d   host            host      local
    ee30cd8524db   network-33060   bridge    local
    2656d3bb9028   none            null      local

## 2 主实例

### 2.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33060/master/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33060/master/data


### 2.2 配置文件

    // 设置配置文件
    [root@centos mysql]# cat /root/mysql/mysql-33060/master/cnf/mysql.cnf
    [mysqld]
    ## 主实例服务ID
    server-id=1
    ## 主实例开启二进制日志
    log-bin=mysql-master-bin
    ## 主实例二进制日志格式
    binlog-format=ROW
    ## 主实例二进制日志缓存大小
    binlog-cache-size=1M
    ## 主实例二进制日志保留天数
    expire-logs-days=10
    ## 主实例读写
    read-only=FALSE
    
    ## 其他配置
    character-set-server=utf8mb4
    collation-server=utf8mb4_general_ci
    
    ## 客户端配置
    [client]
    default-character-set=utf8mb4
    

### 2.3 创建并启动实例

    // 创建并启动实例
    docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    -p 33061:3306 \
    -v /root/mysql/mysql-33060/master/cnf:/etc/mysql/conf.d \
    -v /root/mysql/mysql-33060/master/data:/var/lib/mysql \
    --network network-33060 \
    --network-alias mysql-33061-master \
    --name mysql-33061-master \
    mysql:5.7.zh

    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33061:3306 \
    > -v /root/mysql/mysql-33060/master/cnf:/etc/mysql/conf.d \
    > -v /root/mysql/mysql-33060/master/data:/var/lib/mysql \
    > --network network-33060 \
    > --network-alias mysql-33061-master \
    > --name mysql-33061-master \
    > mysql:5.7.zh
    11a88d6e8e6fa78c416e0863a7e7aa17976947e4c441774db6054903a762342f
    
    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE          COMMAND                   CREATED          STATUS         PORTS                                                    NAMES
    11a88d6e8e6f   mysql:5.7.zh   "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds   33060/tcp, 0.0.0.0:33061->3306/tcp, :::33061->3306/tcp   mysql-33061-master

### 2.4 添加供从实例使用的复制数据的用户

    // 进入容器并连接MySQL
    [root@centos mysql]# docker exec -it mysql-33061-master /bin/bash
    bash-4.2# mysql -u root -p123456
    mysql: [Warning] Using a password on the command line interface can be insecure.
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 2
    Server version: 5.7.41-log MySQL Community Server (GPL)
    
    Copyright (c) 2000, 2023, Oracle and/or its affiliates.
    
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.
    
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    
    // 创建复制用户reader并赋予复制数据权限
    mysql> GRANT REPLICATION SLAVE ON *.* TO 'reader'@'%' IDENTIFIED BY '123456';
    Query OK, 0 rows affected, 1 warning (0.00 sec)
    
    // 刷新权限
    mysql> FLUSH PRIVILEGES;
    Query OK, 0 rows affected (0.00 sec)
    
    mysql> quit
    Bye
    bash-4.2# exit
    exit

## 3 从实例

### 3.1 创建目录

    // 配置目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33060/slave/cnf
    // 数据目录
    [root@centos mysql]# mkdir -p /root/mysql/mysql-33060/slave/data


### 3.2 配置文件

    // 设置配置文件
    [root@centos mysql]# cat /root/mysql/mysql-33060/slave/cnf/mysql.cnf
    [mysqld]
    ## 从实例服务ID
    server-id=2
    ## 从实例开启二进制日志
    log-bin=mysql-slave-bin
    ## 从实例二进制日志格式
    binlog-format=ROW
    ## 从实例二进制日志缓存大小
    binlog-cache-size=1M
    ## 从实例二进制日志保留天数
    expire-logs-days=10
    ## 从实例只读
    read-only=TRUE
    
    ## 从实例中继日志
    relay-log=mysql-relay-bin
    ## 从实例同步函数和存储过程
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
    -p 33062:3306 \
    -v /root/mysql/mysql-33060/slave/cnf:/etc/mysql/conf.d \
    -v /root/mysql/mysql-33060/slave/data:/var/lib/mysql \
    --network network-33060 \
    --network-alias mysql-33062-slave \
    --name mysql-33062-slave \
    mysql:5.7.zh
    
    // 实例
    [root@centos mysql]# docker run -d -e MYSQL_ROOT_PASSWORD=123456 \
    > -p 33062:3306 \
    > -v /root/mysql/mysql-33060/slave/cnf:/etc/mysql/conf.d \
    > -v /root/mysql/mysql-33060/slave/data:/var/lib/mysql \
    > --network network-33060 \
    > --network-alias mysql-33062-slave \
    > --name mysql-33062-slave \
    > mysql:5.7.zh
    b65807454784461fcfd0fcf972da6a87da0bd9345989c586bd45aa125fba5984
    
    [root@centos mysql]# docker ps
    CONTAINER ID   IMAGE          COMMAND                   CREATED          STATUS          PORTS                                                    NAMES
    b65807454784   mysql:5.7.zh   "docker-entrypoint.s…"   23 seconds ago   Up 23 seconds   33060/tcp, 0.0.0.0:33062->3306/tcp, :::33062->3306/tcp   mysql-33062-slave
    11a88d6e8e6f   mysql:5.7.zh   "docker-entrypoint.s…"   7 minutes ago    Up 7 minutes    33060/tcp, 0.0.0.0:33061->3306/tcp, :::33061->3306/tcp   mysql-33061-master

### 3.4 配置连接主实例的信息

首先在`主实例`上查看 `MASTER_LOG_FILE` 和 `MASTER_LOG_POS` 两个参数：

    // 进入容器并连接MySQL
    [root@centos mysql]# docker exec -it mysql-33061-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 查看主实例状态
    mysql> SHOW MASTER STATUS;
    +-------------------------+----------+--------------+------------------+-------------------+
    | File                    | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +-------------------------+----------+--------------+------------------+-------------------+
    | mysql-master-bin.000003 |      591 |              |                  |                   |
    +-------------------------+----------+--------------+------------------+-------------------+

如果没有单独创建网络，可以这样查看`主实例`容器的`ip`地址(本例使用`网络别名`访问连接`主实例`)：

    docker inspect --format={{.NetworkSettings.IPAddress}} mysql-33061-master

然后在`从实例`上进行`主实例`的连接信息的设置：

    CHANGE MASTER TO
    MASTER_HOST='mysql-33061-master',
    MASTER_PORT=3306,
    MASTER_USER='reader',
    MASTER_PASSWORD='123456',
    MASTER_LOG_FILE='mysql-master-bin.000003',
    MASTER_LOG_POS=591;

    // 进入容器并连接MySQL
    [root@centos mysql]# docker exec -it mysql-33062-slave /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 设置主实例连接信息
    mysql> CHANGE MASTER TO
        -> MASTER_HOST='mysql-33061-master',
        -> MASTER_PORT=3306,
        -> MASTER_USER='reader',
        -> MASTER_PASSWORD='123456',
        -> MASTER_LOG_FILE='mysql-master-bin.000003',
        -> MASTER_LOG_POS=591;
    Query OK, 0 rows affected, 2 warnings (0.02 sec)
    
    // 启动从实例同步
    mysql> START SLAVE;
    Query OK, 0 rows affected (0.00 sec)
    
    // 查看从实例状态
    // 其中：
    // ----------------------
    // Slave_IO_Running: Yes
    // Slave_SQL_Running: Yes
    // 即表示启动成功
    // ----------------------
    // Last_Errno: 0
    // Last_Error:
    // Last_IO_Errno: 0
    // Last_IO_Error:
    // Last_SQL_Errno: 0
    // Last_SQL_Error:
    // 表示最近错误信息
    // ----------------------
    mysql> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
                   Slave_IO_State: Waiting for master to send event
                      Master_Host: mysql-33061-master
                      Master_User: reader
                      Master_Port: 3306
                    Connect_Retry: 60
                  Master_Log_File: mysql-master-bin.000003
              Read_Master_Log_Pos: 591
                   Relay_Log_File: mysql-relay-bin.000002
                    Relay_Log_Pos: 327
            Relay_Master_Log_File: mysql-master-bin.000003
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
                  Relay_Log_Space: 534
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
                      Master_UUID: 37d01f41-c175-11ed-807e-0242c0a8a002
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


## 4 停止从实例并重新连接主实例

首先在`从实例`停止和`主实例`的同步：

    // 进入从实例容器
    [root@centos mysql]# docker exec -it mysql-33062-slave /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 停止从实例同步
    mysql> STOP SLAVE;
    Query OK, 0 rows affected (0.02 sec)
    
    // 查看从实例状态
    // 其中：
    // ----------------------
    // Slave_IO_Running: No
    // Slave_SQL_Running: No
    // 表示已停止同步
    // ----------------------
    mysql> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
                   Slave_IO_State:
                      Master_Host: mysql-33061-master
                      Master_User: reader
                      Master_Port: 3306
                    Connect_Retry: 60
                  Master_Log_File: mysql-master-bin.000003
              Read_Master_Log_Pos: 2144
                   Relay_Log_File: mysql-relay-bin.000002
                    Relay_Log_Pos: 1880
            Relay_Master_Log_File: mysql-master-bin.000003
                 Slave_IO_Running: No
                Slave_SQL_Running: No
                  Replicate_Do_DB:
              Replicate_Ignore_DB:
               Replicate_Do_Table:
           Replicate_Ignore_Table:
          Replicate_Wild_Do_Table:
      Replicate_Wild_Ignore_Table:
                       Last_Errno: 0
                       Last_Error:
                     Skip_Counter: 0
              Exec_Master_Log_Pos: 2144
                  Relay_Log_Space: 2087
                  Until_Condition: None
                   Until_Log_File:
                    Until_Log_Pos: 0
               Master_SSL_Allowed: No
               Master_SSL_CA_File:
               Master_SSL_CA_Path:
                  Master_SSL_Cert:
                Master_SSL_Cipher:
                   Master_SSL_Key:
            Seconds_Behind_Master: NULL
    Master_SSL_Verify_Server_Cert: No
                    Last_IO_Errno: 0
                    Last_IO_Error:
                   Last_SQL_Errno: 0
                   Last_SQL_Error:
      Replicate_Ignore_Server_Ids:
                 Master_Server_Id: 1
                      Master_UUID: 37d01f41-c175-11ed-807e-0242c0a8a002
                 Master_Info_File: /var/lib/mysql/master.info
                        SQL_Delay: 0
              SQL_Remaining_Delay: NULL
          Slave_SQL_Running_State:
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

查看`主实例`最新的 `MASTER_LOG_FILE` 和 `MASTER_LOG_POS` 两个参数：

    // 进入主实例容器
    [root@centos ~]# docker exec -it mysql-33061-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    // 查看主实例状态
    // 现在主实例的二进制日志位置还是停止从实例时同步的位置
    mysql> SHOW MASTER STATUS;
    +-------------------------+----------+--------------+------------------+-------------------+
    | File                    | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +-------------------------+----------+--------------+------------------+-------------------+
    | mysql-master-bin.000003 |     2144 |              |                  |                   |
    +-------------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)
    
    // 在主实例新增一条记录
    // 查看主实例状态
    // 现在主实例的二进制日志位置已更新
    mysql> SHOW MASTER STATUS;
    +-------------------------+----------+--------------+------------------+-------------------+
    | File                    | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +-------------------------+----------+--------------+------------------+-------------------+
    | mysql-master-bin.000003 |     2473 |              |                  |                   |
    +-------------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

重新在`从实例`上进行`主实例`的连接信息的设置：

    // 设置主实例连接信息
    mysql> CHANGE MASTER TO
        -> MASTER_HOST='mysql-33061-master',
        -> MASTER_PORT=3306,
        -> MASTER_USER='reader',
        -> MASTER_PASSWORD='123456',
        -> MASTER_LOG_FILE='mysql-master-bin.000003',
        -> MASTER_LOG_POS=2473;
    Query OK, 0 rows affected, 2 warnings (0.01 sec)
    
    // 启动从实例同步
    mysql> START SLAVE;
    Query OK, 0 rows affected (0.00 sec)
    
    // 查看从实例状态
    mysql> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
                   Slave_IO_State: Waiting for master to send event
                      Master_Host: mysql-33061-master
                      Master_User: reader
                      Master_Port: 3306
                    Connect_Retry: 60
                  Master_Log_File: mysql-master-bin.000003
              Read_Master_Log_Pos: 2473
                   Relay_Log_File: mysql-relay-bin.000002
                    Relay_Log_Pos: 327
            Relay_Master_Log_File: mysql-master-bin.000003
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
              Exec_Master_Log_Pos: 2473
                  Relay_Log_Space: 534
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
                      Master_UUID: 37d01f41-c175-11ed-807e-0242c0a8a002
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