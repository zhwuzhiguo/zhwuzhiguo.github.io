# 02-Canal-集群

## 查看网络

    // 查看网络 network0
    [root@centos mysql]# docker network ls
    NETWORK ID     NAME       DRIVER    SCOPE
    0c7f3765f44e   bridge     bridge    local
    c1baf3b0966d   host       host      local
    355cc9de7da3   network0   bridge    local
    2656d3bb9028   none       null      local

## 创建容器

创建如下容器并设置网络`network0`：
- `canal-admin`
- `canal-server-master`
- `canal-server-slave`

创建脚本：

    // canal-admin
    docker run -di -p 8888:8089 \
    --network network0 \
    --network-alias canal-admin \
    --name canal-admin \
    centos:centos7.9.2009.zh.jdk8
    
    // canal-server-master
    docker run -di \
    --network network0 \
    --network-alias canal-server-master \
    --name canal-server-master \
    centos:centos7.9.2009.zh.jdk8
    
    // canal-server-slave
    docker run -di \
    --network network0 \
    --network-alias canal-server-slave \
    --name canal-server-slave \
    centos:centos7.9.2009.zh.jdk8

实例：

    [root@centos canal]# docker run -di -p 8888:8089 \
    > --network network0 \
    > --network-alias canal-admin \
    > --name canal-admin \
    > centos:centos7.9.2009.zh.jdk8
    c3f32057315193e1f290229535d260228edfa1f857958feaffde3fdd866091d9
    
    [root@centos canal]# docker run -di \
    > --network network0 \
    > --network-alias canal-server-master \
    > --name canal-server-master \
    > centos:centos7.9.2009.zh.jdk8
    f49a7448fc7fec7b3aba92f28158cafc5661cf7442e09c0c73a0c47760820c25
    
    [root@centos canal]# docker run -di \
    > --network network0 \
    > --network-alias canal-server-slave \
    > --name canal-server-slave \
    > centos:centos7.9.2009.zh.jdk8
    8307b9e2591607774db973c80fba533ab7a13d4e50055a41d79eb5e9cb1e2a6c
    
    [root@centos canal]# docker ps
    CONTAINER ID   IMAGE                                    COMMAND                   CREATED          STATUS          PORTS                                                                                                                                                   NAMES
    8307b9e25916   centos:centos7.9.2009.zh.jdk8            "/bin/bash"               12 seconds ago   Up 11 seconds                                                                                                                                                           canal-server-slave
    f49a7448fc7f   centos:centos7.9.2009.zh.jdk8            "/bin/bash"               22 seconds ago   Up 21 seconds                                                                                                                                                           canal-server-master
    c3f320573151   centos:centos7.9.2009.zh.jdk8            "/bin/bash"               33 seconds ago   Up 32 seconds   0.0.0.0:8888->8089/tcp, :::8888->8089/tcp                                                                                                               canal-admin
    e712a6e113b3   mysql:5.7.zh                             "docker-entrypoint.s…"   4 minutes ago    Up 4 minutes    33060/tcp, 0.0.0.0:33082->3306/tcp, :::33082->3306/tcp                                                                                                  mysql-33082-slave
    c5a9b4d284c9   mysql:5.7.zh                             "docker-entrypoint.s…"   6 minutes ago    Up 6 minutes    33060/tcp, 0.0.0.0:33081->3306/tcp, :::33081->3306/tcp                                                                                                  mysql-33081-master
    03f1fa803990   mysql:5.7.zh                             "docker-entrypoint.s…"   14 minutes ago   Up 14 minutes   33060/tcp, 0.0.0.0:33072->3306/tcp, :::33072->3306/tcp                                                                                                  mysql-33072-slave
    81d478f3c33b   mysql:5.7.zh                             "docker-entrypoint.s…"   17 minutes ago   Up 16 minutes   33060/tcp, 0.0.0.0:33071->3306/tcp, :::33071->3306/tcp                                                                                                  mysql-33071-master
    868b0ec07bc3   apache/rocketmq-dashboard:1.0.0-centos   "java -jar bin/rocke…"   23 minutes ago   Up 23 minutes   0.0.0.0:9000->8080/tcp, :::9000->8080/tcp                                                                                                               rocketmq-cluster-rocketmq-dashboard-1
    7f4ff3520ad7   apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   23 minutes ago   Up 23 minutes   9876/tcp, 0.0.0.0:20909->10909/tcp, :::20909->10909/tcp, 0.0.0.0:20911->10911/tcp, :::20911->10911/tcp, 0.0.0.0:20912->10912/tcp, :::20912->10912/tcp   rocketmq-cluster-rocketmq-broker-b-1
    0b73c5153a6f   apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   23 minutes ago   Up 23 minutes   0.0.0.0:10909->10909/tcp, :::10909->10909/tcp, 9876/tcp, 0.0.0.0:10911-10912->10911-10912/tcp, :::10911-10912->10911-10912/tcp                          rocketmq-cluster-rocketmq-broker-a-1
    6c22d1f87d23   apache/rocketmq:5.1.0                    "sh mqnamesrv"            23 minutes ago   Up 23 minutes   10909/tcp, 0.0.0.0:9876->9876/tcp, :::9876->9876/tcp, 10911-10912/tcp                                                                                   rocketmq-cluster-rocketmq-name-1
    d7f1f4b62c0c   zookeeper:3.7.1-temurin                  "/docker-entrypoint.…"   25 minutes ago   Up 25 minutes   2888/tcp, 3888/tcp, 0.0.0.0:2183->2181/tcp, :::2183->2181/tcp, 0.0.0.0:21830->8080/tcp, :::21830->8080/tcp                                              zookeeper-cluster-zoo3-1
    dda63f2b3c09   zookeeper:3.7.1-temurin                  "/docker-entrypoint.…"   25 minutes ago   Up 25 minutes   2888/tcp, 3888/tcp, 0.0.0.0:2182->2181/tcp, :::2182->2181/tcp, 0.0.0.0:21820->8080/tcp, :::21820->8080/tcp                                              zookeeper-cluster-zoo2-1
    2e11da3928af   zookeeper:3.7.1-temurin                  "/docker-entrypoint.…"   25 minutes ago   Up 25 minutes   2888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp, 3888/tcp, 0.0.0.0:21810->8080/tcp, :::21810->8080/tcp                                              zookeeper-cluster-zoo1-1

## canal-admin

### 部署服务

在容器外拷贝程序包到容器内目录：

    [root@centos canal]# docker cp ./canal.admin-1.1.5.tar.gz canal-admin:/root
    Successfully copied 38.37MB to canal-admin:/root

进入容器创建目录：

    [root@centos canal]# docker exec -it canal-admin /bin/bash
    [root@c3f320573151 /]# mkdir -p /root/canal-admin

解压到创建的目录：

    [root@c3f320573151 /]# cd /root
    [root@c3f320573151 ~]# tar -zxf canal.admin-1.1.5.tar.gz -C canal-admin/

查看解压目录：

    [root@c3f320573151 ~]# ll canal-admin/
    total 8
    drwxr-xr-x 2 root root   76 Apr 12 17:44 bin
    drwxr-xr-x 3 root root  156 Apr 12 17:44 conf
    drwxr-xr-x 2 root root 4096 Apr 12 17:44 lib
    drwxrwxrwx 2 root root    6 Apr 19  2021 logs


### 修改配置

初始化元数据库：

在数据库 `mysql-33071-master` 执行 `canal-admin/conf/canal_manager.sql` 脚本创建 `Canal Admin` 的元数据库 `canal_manager` 。

    mysql> use canal_manager;
    mysql> select * from canal_user;
    +----+----------+------------------------------------------+---------------+-------+--------------+--------+---------------------+
    | id | username | password                                 | name          | roles | introduction | avatar | creation_date       |
    +----+----------+------------------------------------------+---------------+-------+--------------+--------+---------------------+
    |  1 | admin    | 6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9 | Canal Manager | admin | NULL         | NULL   | 2019-07-14 00:05:28 |
    +----+----------+------------------------------------------+---------------+-------+--------------+--------+---------------------+
    
    // 默认密码 123456
    mysql> select password('123456');
    +-------------------------------------------+
    | password('123456')                        |
    +-------------------------------------------+
    | *6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9 |
    +-------------------------------------------+

修改配置文件：

    [root@c3f320573151 canal-admin]# vi conf/application.yml
    [root@c3f320573151 canal-admin]# cat conf/application.yml
    # Canal Admin Web 界面端口
    server:
      port: 8089
    spring:
      jackson:
        date-format: yyyy-MM-dd HH:mm:ss
        time-zone: GMT+8
    
    # Canal Admin 元数据库连接信息
    spring.datasource:
      address: mysql-33071-master:3306
      database: canal_manager
      username: root
      password: 123456
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://${spring.datasource.address}/${spring.datasource.database}?useUnicode=true&characterEncoding=UTF-8&useSSL=false
      hikari:
        maximum-pool-size: 30
        minimum-idle: 1
    
    # Canal Server 加入 Canal Admin 使用的账号密码
    canal:
      adminUser: admin
      adminPasswd: admin
    
### 启动服务

修改启动脚本设置内存占用小一点：

    [root@c3f320573151 canal-admin]# vi bin/startup.sh
    [root@c3f320573151 canal-admin]# cat bin/startup.sh
    #!/bin/bash
    ...
    
    str=`file -L $JAVA | grep 64-bit`
    if [ -n "$str" ]; then
    	JAVA_OPTS="-server -Xms2048m -Xmx3072m"
    else
    	JAVA_OPTS="-server -Xms1024m -Xmx1024m"
    fi
    
    # 把内存占用调小一点
    JAVA_OPTS="-server -Xms256m -Xmx256m"
    
    ...

启动服务：

    [root@c3f320573151 canal-admin]# sh bin/startup.sh
    bin/startup.sh: line 59: file: command not found
    cd to /root/canal-admin/bin for workaround relative path
    CLASSPATH :/root/canal-admin/bin/../conf:/root/canal-admin/bin/../lib/zookeeper-3.4.5.jar:...
    cd to /root/canal-admin for continue
    
    [root@c3f320573151 canal-admin]# jps -lvm
    132 sun.tools.jps.Jps -lvm -Denv.class.path=.:/usr/local/java/jdk1.8.0_201/lib:/usr/local/java/jdk1.8.0_201/jre/lib -Dapplication.home=/usr/local/java/jdk1.8.0_201 -Xms8m
    86 com.alibaba.otter.canal.admin.CanalAdminApplication -Xms256m -Xmx256m -XX:+UseG1GC -XX:MaxGCPauseMillis=250 -XX:+UseGCOverheadLimit -XX:+ExplicitGCInvokesConcurrent -XX:+PrintAdaptiveSizePolicy -XX:+PrintTenuringDistribution -Djava.awt.headless=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -DappName=canal-admin

在浏览器输入 `http://39.107.235.147:8888` 访问 `Canal Admin` 管理界面，默认用户名 `admin` 密码 `123456`。

创建集群：

在 `Canal Admin` 管理界面创建集群：

集群名称：

    canal-cluster-1

ZK地址：

    zoo1:2181,zoo2:2181,zoo3:2181


接着打开集群的 `主配置` 界面，点击 `载入模板` 加载默认配置，直接保存。

## canal-server

### 部署服务

#### canal-server-master

    // 在容器外拷贝程序包到容器内目录
    [root@centos canal]# docker cp ./canal.deployer-1.1.5.tar.gz canal-server-master:/root
    Successfully copied 60.21MB to canal-server-master:/root
    
    // 进入容器创建目录
    [root@centos canal]# docker exec -it canal-server-master /bin/bash
    [root@f49a7448fc7f /]# mkdir -p /root/canal-deployer
    
    // 解压到创建的目录
    [root@f49a7448fc7f /]# cd /root/
    [root@f49a7448fc7f ~]# tar -zxf canal.deployer-1.1.5.tar.gz -C canal-deployer/
    
    // 查看解压目录
    [root@f49a7448fc7f ~]# ll canal-deployer/
    total 4
    drwxr-xr-x 2 root root   76 Apr 12 18:08 bin
    drwxr-xr-x 5 root root  123 Apr 12 18:08 conf
    drwxr-xr-x 2 root root 4096 Apr 12 18:08 lib
    drwxrwxrwx 2 root root    6 Apr 19  2021 logs
    drwxrwxrwx 2 root root  177 Apr 19  2021 plugin

#### canal-server-slave

    // 在容器外拷贝程序包到容器内目录
    [root@centos canal]# docker cp ./canal.deployer-1.1.5.tar.gz canal-server-slave:/root
    Successfully copied 60.21MB to canal-server-slave:/root
    
    // 进入容器创建目录
    [root@centos canal]# docker exec -it canal-server-slave /bin/bash
    [root@8307b9e25916 /]# mkdir -p /root/canal-deployer
    
    // 解压到创建的目录
    [root@8307b9e25916 /]# cd /root/
    [root@8307b9e25916 ~]# tar -zxf canal.deployer-1.1.5.tar.gz -C canal-deployer/
    
    // 查看解压目录
    [root@8307b9e25916 ~]# ll canal-deployer/
    total 4
    drwxr-xr-x 2 root root   76 Apr 12 18:10 bin
    drwxr-xr-x 5 root root  123 Apr 12 18:10 conf
    drwxr-xr-x 2 root root 4096 Apr 12 18:10 lib
    drwxrwxrwx 2 root root    6 Apr 19  2021 logs
    drwxrwxrwx 2 root root  177 Apr 19  2021 plugin

### 修改配置

使用 `Canal Admin` 部署集群，所以 `Canal Server` 节点只需要配置 `Canal Admin` 的连接信息即可，真正的配置文件通过 `Canal Admin` 界面来管理。

#### canal-server-master

    [root@f49a7448fc7f canal-deployer]# vi conf/canal_local.properties
    [root@f49a7448fc7f canal-deployer]# cat conf/canal_local.properties
    # register ip
    canal.register.ip = canal-server-master
    
    # canal admin config
    canal.admin.manager = canal-admin:8089
    canal.admin.port = 11110
    canal.admin.user = admin
    canal.admin.passwd = 4ACFE3202A5FF5CF467898FC58AAB1D615029441
    # admin auto register
    canal.admin.register.auto = true
    canal.admin.register.cluster = canal-cluster-1
    canal.admin.register.name = canal-server-master
    

#### canal-server-slave

    [root@8307b9e25916 canal-deployer]# vi conf/canal_local.properties
    [root@8307b9e25916 canal-deployer]# cat conf/canal_local.properties
    # register ip
    canal.register.ip = canal-server-slave
    
    # canal admin config
    canal.admin.manager = canal-admin:8089
    canal.admin.port = 11110
    canal.admin.user = admin
    canal.admin.passwd = 4ACFE3202A5FF5CF467898FC58AAB1D615029441
    # admin auto register
    canal.admin.register.auto = true
    canal.admin.register.cluster = canal-cluster-1
    canal.admin.register.name = canal-server-slave
    

### 启动服务

#### canal-server-master

修改启动脚本设置内存占用小一点：

    [root@f49a7448fc7f canal-deployer]# vi bin/startup.sh
    [root@f49a7448fc7f canal-deployer]# cat bin/startup.sh
    #!/bin/bash
    ...
    
    # 把内存占用调小一点
    JAVA_OPTS="-server -Xms256m -Xmx256m"
    
    ...

启动服务：

    [root@f49a7448fc7f canal-deployer]# sh bin/startup.sh local
    bin/startup.sh: line 82: file: command not found
    cd to /root/canal-deployer/bin for workaround relative path
    LOG CONFIGURATION : /root/canal-deployer/bin/../conf/logback.xml
    canal conf : /root/canal-deployer/bin/../conf/canal_local.properties
    CLASSPATH :/root/canal-deployer/bin/../conf:/root/canal-deployer/bin/../lib/zookeeper-3.4.5.jar:...
    cd to /root/canal-deployer for continue
    
    [root@f49a7448fc7f canal-deployer]# jps -lvm
    87 com.alibaba.otter.canal.deployer.CanalLauncher -Xms256m -Xmx256m -Djava.awt.headless=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -DappName=otter-canal -Dlogback.configurationFile=/root/canal-deployer/bin/../conf/logback.xml -Dcanal.conf=/root/canal-deployer/bin/../conf/canal_local.properties
    121 sun.tools.jps.Jps -lvm -Denv.class.path=.:/usr/local/java/jdk1.8.0_201/lib:/usr/local/java/jdk1.8.0_201/jre/lib -Dapplication.home=/usr/local/java/jdk1.8.0_201 -Xms8m

#### canal-server-slave

修改启动脚本设置内存占用小一点：

    [root@8307b9e25916 canal-deployer]# vi bin/startup.sh
    [root@8307b9e25916 canal-deployer]# cat bin/startup.sh
    #!/bin/bash
    ...
    
    # 把内存占用调小一点
    JAVA_OPTS="-server -Xms256m -Xmx256m"
    
    ...

启动服务：

    [root@8307b9e25916 canal-deployer]# sh bin/startup.sh local
    bin/startup.sh: line 82: file: command not found
    cd to /root/canal-deployer/bin for workaround relative path
    LOG CONFIGURATION : /root/canal-deployer/bin/../conf/logback.xml
    canal conf : /root/canal-deployer/bin/../conf/canal_local.properties
    CLASSPATH :/root/canal-deployer/bin/../conf:/root/canal-deployer/bin/../lib/zookeeper-3.4.5.jar:...
    cd to /root/canal-deployer for continue
    
    [root@8307b9e25916 canal-deployer]# jps -lvm
    76 com.alibaba.otter.canal.deployer.CanalLauncher -Xms256m -Xmx256m -Djava.awt.headless=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -DappName=otter-canal -Dlogback.configurationFile=/root/canal-deployer/bin/../conf/logback.xml -Dcanal.conf=/root/canal-deployer/bin/../conf/canal_local.properties
    110 sun.tools.jps.Jps -lvm -Denv.class.path=.:/usr/local/java/jdk1.8.0_201/lib:/usr/local/java/jdk1.8.0_201/jre/lib -Dapplication.home=/usr/local/java/jdk1.8.0_201 -Xms8m

现在可以在 `Canal Admin` 上看到自动注册的 `2` 个 `Canal Server` 了。

## 配置 Canal Server 

在 `Canal Admin` 管理界面打开集群 `canal-cluster-1` 的 `主配置` 界面对 `Canal Server` 的 `canal.properties` 进行配置。

`Canal Server` 默认把源库对表结构修改的记录存储在本地 `H2` 数据库中。  
`Canal Server` 主备切换后会导致新的 `Canal Server` 无法正常同步数据。  
因此修改 `TSDB` 的设置将外部 `MySQL` 数据库作为 `Canal Server` 存储表结构变更信息的库。

在数据库实例 `mysql-33071-master` 上创建 `TSDB` 库：

    create database canal_tsdb;

因为要将同步数据发送到 `RocketMQ` 所以先建一个 `TOPIC`： 

    sample-topic

配置调整内容：

    #################################################
    #########   common argument  #############
    #################################################
    ## ZK配置
    canal.zkServers = zoo1:2181,zoo2:2181,zoo3:2181
    ## 数据更新ZK频率(毫秒)
    canal.zookeeper.flush.period = 1000
    canal.withoutNetty = false
    
    ## 服务模式
    ## tcp
    ## kafka
    ## rocketMQ
    ## rabbitMQ
    canal.serverMode = rocketMQ
    
    ## 内存配置
    ## canal内存store中可缓存buffer记录数(需要为2的指数)
    canal.instance.memory.buffer.size = 16384
    ## canal内存store中内存记录的单位大小(默认1KB)
    canal.instance.memory.buffer.memunit = 1024
    ## canal内存store中数据缓存模式
    ## ITEMSIZE: 根据 buffer.size 进行限制，只限制记录的数量
    ## MEMSIZE: 根据 buffer.size * buffer.memunit 的大小进行限制，限制缓存记录的大小
    canal.instance.memory.batch.mode = MEMSIZE
    canal.instance.memory.rawEntry = true
    
    ## 是否开启心跳检查
    canal.instance.detecting.enable = false
    canal.instance.detecting.sql = select 1
    canal.instance.detecting.interval.time = 3
    canal.instance.detecting.retry.threshold = 3
    ## 心跳检查失败后是否开启自动mysql切换
    canal.instance.detecting.heartbeatHaEnable = false
    
    ## 最大事务完整解析的长度
    ## 超过该长度后一个事务可能会被拆分，无法保证事务的完整可见性
    canal.instance.transaction.size = 1024
    ## 发生主从切换时在新库上查找二进制日志时需要往前查找的时间(秒)
    canal.instance.fallbackIntervalInSeconds = 60
    
    ## 网络配置
    canal.instance.network.receiveBufferSize = 16384
    canal.instance.network.sendBufferSize = 16384
    canal.instance.network.soTimeout = 30
    
    ## 二进制日志过滤配置
    ## 是否使用druid处理所有的ddl解析来获取库和表名
    canal.instance.filter.druid.ddl = true
    ## 是否忽略dcl语句
    canal.instance.filter.query.dcl = false
    ## 是否忽略MySQL如下配置为TRUE时dml操作生成的query类型的日志
    ## binlog-rows-query-log-events=TRUE
    canal.instance.filter.query.dml = true
    ## 是否忽略ddl语句
    canal.instance.filter.query.ddl = false
    ## 是否忽略binlog表结构获取失败的异常
    ## 解决回溯binlog时对应表已被删除或者表结构和binlog不一致的情况
    canal.instance.filter.table.error = false
    ## 是否忽略dml的数据变更日志(insert update delete)
    canal.instance.filter.rows = false
    ## 是否忽略事务头和尾
    ## 针对写入kakfa的消息时不写入TransactionBegin/TransactionEnd事件
    canal.instance.filter.transaction.entry = false
    ## 是否忽略dml的insert操作
    ## 是否忽略dml的update操作
    ## 是否忽略dml的delete操作
    canal.instance.filter.dml.insert = false
    canal.instance.filter.dml.update = false
    canal.instance.filter.dml.delete = false
    
    ## 二进制日志支持格式
    canal.instance.binlog.format = ROW,STATEMENT,MIXED 
    canal.instance.binlog.image = FULL,MINIMAL,NOBLOB
    
    ## DDL语句是否单独一个batch返回
    ## 下游dml/ddl如果做batch内无序并发处理会导致结构不一致
    canal.instance.get.ddl.isolation = false
    
    ## 并行解析
    ## 是否开启binlog并行解析模式
    canal.instance.parser.parallel = true
    ## binlog并行解析的异步ringbuffer队列(需要为2的指数)
    canal.instance.parser.parallelBufferSize = 256
    
    ## TSDB
    canal.instance.tsdb.enable = true
    canal.instance.tsdb.url = jdbc:mysql://mysql-33071-master:3306/canal_tsdb
    canal.instance.tsdb.dbUsername = root
    canal.instance.tsdb.dbPassword = 123456
    ## 快照生成间隔(小时)
    canal.instance.tsdb.snapshot.interval = 24
    ## 快照过期时间(小时)
    canal.instance.tsdb.snapshot.expire = 360
    canal.instance.tsdb.spring.xml = classpath:spring/tsdb/mysql-tsdb.xml
    
    #################################################
    #########   destinations  #############
    #################################################
    canal.destinations = 
    canal.conf.dir = ../conf
    canal.auto.scan = true
    canal.auto.scan.interval = 5
    ## 是否找不到同步位置设置最新位置
    canal.auto.reset.latest.pos.mode = false
    
    ## 全局配置加载方式
    canal.instance.global.mode = manager
    canal.instance.global.lazy = false
    canal.instance.global.manager.address = ${canal.admin.manager}
    canal.instance.global.spring.xml = classpath:spring/default-instance.xml
    
    ##################################################
    #########        MQ Properties      #############
    ##################################################
    ## 阿里云 ak/sk
    canal.aliyun.accessKey = 
    canal.aliyun.secretKey = 
    canal.aliyun.uid = 
    
    ## 消息是否为json格式
    canal.mq.flatMessage = true
    ## 获取数据的批次大小(KB)
    canal.mq.canalBatchSize = 50
    ## 获取数据的超时时间(毫秒)
    canal.mq.canalGetTimeout = 100
    ## cloud - 打开阿里云消息跟踪
    canal.mq.accessChannel = local
    
    ## 是否开启database混淆hash
    ## 确保不同库的数据可以均匀分散
    canal.mq.database.hash = true
    ## MQ消息发送并行度
    canal.mq.send.thread.size = 30
    ## MQ消息构建并行度
    canal.mq.build.thread.size = 8
    
    ##################################################
    #########       RocketMQ      #############
    ##################################################
    rocketmq.producer.group = sample-group
    rocketmq.enable.message.trace = false
    rocketmq.customized.trace.topic = 
    rocketmq.namespace = 
    rocketmq.namesrv.addr = rocketmq-name:9876
    rocketmq.retry.times.when.send.failed = 0
    rocketmq.vip.channel.enabled = false
    rocketmq.tag = sample-tag
    

## 配置 Canal Instance

查看源数据库的二进制日志位置信息：

    [root@centos ~]# docker exec -it mysql-33071-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    mysql> flush logs;
    Query OK, 0 rows affected (0.01 sec)
    
    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000008 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)


在 `Canal Admin` 的 `Instance` 界面新建集群 `canal-cluster-1` 的名为 `sample-instance` 的 `Instance`。

`Instance` 表示一个 `MySQL` 的订阅队列，需要指定源库的连接信息以及需要同步的表以及同步点位。

    ## 主库同步点位
    canal.instance.gtidon = false
    canal.instance.master.address = mysql-33071-master:3306
    canal.instance.master.journal.name = mysql-bin.000008
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
    canal.instance.filter.regex = sample\\..*
    canal.instance.filter.black.regex = 
    
    ## 同步消息队列
    canal.mq.topic = sample-topic
    ## 消息队列分区
    ## 保证消息消费的顺序性
    canal.mq.partition = 0
    

现在整个集群就跑起来了。

## 查看主库信息

查看从库列表：

    mysql> show slave hosts;
    +------------+-------------+-------+-----------+--------------------------------------+
    | Server_id  | Host        | Port  | Master_id | Slave_UUID                           |
    +------------+-------------+-------+-----------+--------------------------------------+
    | 1478033422 | 172.25.0.14 | 39362 |         1 | 9397d58c-dcd0-11ed-84bc-0242ac190009 |
    |          2 |             |  3306 |         1 | 12d80a18-d914-11ed-9ce4-0242ac19000a |
    +------------+-------------+-------+-----------+--------------------------------------+
    2 rows in set (0.00 sec)

查看连接列表：

    mysql> show processlist;
    +------+-------------+-------------------+---------------+-------------+--------+---------------------------------------------------------------+------------------+
    | Id   | User        | Host              | db            | Command     | Time   | State                                                         | Info             |
    +------+-------------+-------------------+---------------+-------------+--------+---------------------------------------------------------------+------------------+
    |    4 | system user |                   | NULL          | Connect     | 410858 | Waiting for master to send event                              | NULL             |
    |    5 | system user |                   | NULL          | Connect     | 246760 | Slave has read all relay log; waiting for more updates        | NULL             |
    | 5820 | reader      | 172.25.0.10:51844 | NULL          | Binlog Dump | 233354 | Master has sent all binlog to slave; waiting for more updates | NULL             |
    | 6093 | root        | 172.25.0.13:34464 | canal_manager | Sleep       |      2 |                                                               | NULL             |
    | 6094 | root        | 172.25.0.13:34472 | canal_manager | Sleep       |      2 |                                                               | NULL             |
    | 6096 | root        | localhost         | NULL          | Query       |      0 | starting                                                      | show processlist |
    | 6097 | root        | 172.25.0.14:39352 | canal_tsdb    | Sleep       |    197 |                                                               | NULL             |
    | 6098 | reader      | 172.25.0.14:39354 | NULL          | Sleep       |    197 |                                                               | NULL             |
    | 6102 | reader      | 172.25.0.14:39362 | NULL          | Binlog Dump |    197 | Master has sent all binlog to slave; waiting for more updates | NULL             |
    +------+-------------+-------------------+---------------+-------------+--------+---------------------------------------------------------------+------------------+
    10 rows in set (0.00 sec)

查看现在源数据库的二进制日志位置信息：

    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000008 |     5572 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)

## 查看 ZooKeeper 数据

打开 ZooKeeper 客户端：

    [root@centos ~]# docker exec -it zookeeper-cluster-zoo1-1 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null

查看当前目录结构：

    [zk: localhost:2181(CONNECTED) 0] ls -R /
    /
    /otter
    /zookeeper
    /otter/canal
    /otter/canal/cluster
    /otter/canal/destinations
    /otter/canal/cluster/canal-server-master:11111
    /otter/canal/cluster/canal-server-slave:11111
    /otter/canal/destinations/sample-instance
    /otter/canal/destinations/sample-instance/1001
    /otter/canal/destinations/sample-instance/cluster
    /otter/canal/destinations/sample-instance/running
    /otter/canal/destinations/sample-instance/1001/cursor
    /otter/canal/destinations/sample-instance/cluster/canal-server-master:11111
    /otter/canal/destinations/sample-instance/cluster/canal-server-slave:11111
    /zookeeper/config
    /zookeeper/quota

查看集群下的服务：

    [zk: localhost:2181(CONNECTED) 1] ls /otter/canal/cluster
    [canal-server-master:11111, canal-server-slave:11111]

查看某一实例下结构：

    [zk: localhost:2181(CONNECTED) 2] ls /otter/canal/destinations/sample-instance
    [1001, cluster, running]

查看实例可运行的服务：

    [zk: localhost:2181(CONNECTED) 4] ls /otter/canal/destinations/sample-instance/cluster
    [canal-server-master:11111, canal-server-slave:11111]

查看实例当前的主库同步位点信息：

    [zk: localhost:2181(CONNECTED) 5] get /otter/canal/destinations/sample-instance/1001/cursor
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
            "journalName": "mysql-bin.000008",
            "position": 5541,
            "serverId": 1,
            "timestamp": 1681702390000
        }
    }

查看实例当前运行在哪个容器：

    [zk: localhost:2181(CONNECTED) 6] get /otter/canal/destinations/sample-instance/running
    {"active":true,"address":"canal-server-master:11111"}

# 完