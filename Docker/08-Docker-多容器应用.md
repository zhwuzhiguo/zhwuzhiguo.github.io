# 08-Docker-多容器应用

容器在默认情况下是独立运行的，并不了解同一机器上的其他进程或容器。

那么如何允许一个容器与另一个容器对话呢?

答案就是`网络`。

`桥接网络`：
- `Docker` 使用`软件网桥`，允许连接到同一网桥网络的容器进行通信，同时提供与未连接到该网桥网络的容器的隔离。
- `Docker` 启动时，自动创建一个`默认网桥网络`，用户也可以`自定义网桥网络`，用户定义的网桥网络优先于默认网桥网络。
- `Docker` 网桥网络适用于 `Docker` 主机上运行的容器。

`用户自定义网桥`和`默认网桥`之间的区别：
- 用户定义网桥在容器之间提供自动 `DNS` 解析。
  - 默认网桥网络上的容器只能通过 `IP` 地址相互访问。
  - 用户自定义网桥网络上的容器可以通过`名称`或`别名`相互解析。
- 用户定义的网桥提供更好的隔离。
  - 所有未指定网络的容器都将连接到默认网桥网络，它们之间能够相互通信。
  - 用户定义的网络提供了一个作用域网络，只有连接到该网络的容器才能进行通信。
- 容器可以动态地从用户自定义的网络中附加和分离。
  - 在容器的生存期内，可以动态的与用户定义的网络连接或断开。
  - 从默认网桥网络中删除容器，需要停止该容器并使用不同的网络选项重新创建它。

## 创建网络

    // 创建网络
    // 默认是网桥网络
    docker network create network-name
    // 查看网络列表
    docker network ls
    // 删除网络
    docker network rm network-name

创建网络：

    [root@centos docker]# docker network create network-db
    7042ee709f56a7aef672ca01270aa68cc358ea898ca14f6f1de99ab241f421c5
    
    [root@centos docker]# docker network ls
    NETWORK ID     NAME         DRIVER    SCOPE
    3528c4b9b0c5   bridge       bridge    local
    c1baf3b0966d   host         host      local
    7042ee709f56   network-db   bridge    local
    2656d3bb9028   none         null      local
    
    // 查看网络信息
    [root@centos docker]# docker network inspect network-db
    [
        {
            "Name": "network-db",
            "Id": "7042ee709f56a7aef672ca01270aa68cc358ea898ca14f6f1de99ab241f421c5",
            "Created": "2023-03-05T12:53:19.004063337+08:00",
            "Scope": "local",
            "Driver": "bridge",
            "EnableIPv6": false,
            "IPAM": {
                "Driver": "default",
                "Options": {},
                "Config": [
                    {
                        "Subnet": "192.168.32.0/20",
                        "Gateway": "192.168.32.1"
                    }
                ]
            },
            "Internal": false,
            "Attachable": false,
            "Ingress": false,
            "ConfigFrom": {
                "Network": ""
            },
            "ConfigOnly": false,
            "Containers": {},
            "Options": {},
            "Labels": {}
        }
    ]

## 创建 MySQL 容器

    // 创建容器
    // --network 指定容器的网络
    // --network-alias 指定容器在网络中的别名
    docker run -d -p 33060:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql-57 --network network-db --network-alias mysql mysql:5.7

创建容器：

    [root@centos docker]# docker run -d -p 33060:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql-57 --network network-db --network-alias mysql mysql:5.7
    bf2f633f37adf3b842f1065ef69f647ddcd0161fa27ca30479b328bbb7442e3e
    
    [root@centos docker]# docker ps -a
    CONTAINER ID   IMAGE                           COMMAND                   CREATED          STATUS          PORTS                                                    NAMES
    bf2f633f37ad   mysql:5.7                       "docker-entrypoint.s…"   5 seconds ago    Up 4 seconds    33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   mysql-57
    0366238d416a   centos:centos7.9.2009.zh.jdk8   "/bin/bash"               40 minutes ago   Up 40 minutes                                                            centos-zh-jdk8
    14e9d2cc3400   centos:centos7.9.2009.zh        "/bin/bash"               15 hours ago     Up 15 hours                                                              centos-zh
    9feed4d0b8aa   centos:centos7.9.2009           "/bin/bash"               17 hours ago     Up 17 hours                                                              centos-init
    
    // 进入容器查看数据库
    [root@centos docker]# docker exec -it mysql-57 mysql -p
    Enter password:
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 2
    Server version: 5.7.41 MySQL Community Server (GPL)
    
    Copyright (c) 2000, 2023, Oracle and/or its affiliates.
    
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.
    
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    +--------------------+
    4 rows in set (0.00 sec)
    
    mysql> exit;
    Bye

创建示例数据库和表：

    CREATE DATABASE sample 
    CHARACTER SET 'utf8mb4' 
    COLLATE 'utf8mb4_general_ci';
    
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
      UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引',
      UNIQUE KEY uk_telephone (telephone) USING BTREE COMMENT '用户手机唯一索引'
    ) ENGINE=InnoDB COMMENT='用户';

## 创建 应用 容器

创建 `Spring Boot` 应用程序 `sample-web` 访问数据库，数据源配置使用 `mysql` 别名：

    ## 数据源配置
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.datasource.druid.url=jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull
    spring.datasource.druid.username=root
    spring.datasource.druid.password=123456

基于 `centos:centos7.9.2009.zh.jdk8` 构造 `sample-web` 镜像：

- 编写 `Dockerfile`

      [root@centos sample-web]# ll
      总用量 28992
      -rw-r--r-- 1 root root      211 3月   2 15:22 Dockerfile
      -rw-r--r-- 1 root root 29681534 3月   2 15:12 sample-web.jar
      
      # Dockerfile
      FROM centos:centos7.9.2009.zh.jdk8
      
      LABEL title="sample-web"
      LABEL author="wuzhiguo"
      LABEL email="wuzhiguo@163.com"
      
      RUN mkdir /root/app
      ADD sample-web.jar /root/app
      
      EXPOSE 8080
      
      WORKDIR /root/app
      CMD java -jar sample-web.jar

- 构建镜像

      [root@centos sample-web]# docker build -t sample-web .
      [+] Building 2.1s (9/9) FINISHED
       => [internal] load build definition from Dockerfile                                                                                                                                                                                     0.0s
       => => transferring dockerfile: 280B                                                                                                                                                                                                     0.0s
       => [internal] load .dockerignore                                                                                                                                                                                                        0.0s
       => => transferring context: 2B                                                                                                                                                                                                          0.0s
       => [internal] load metadata for docker.io/library/centos:centos7.9.2009.zh.jdk8                                                                                                                                                         0.0s
       => [1/4] FROM docker.io/library/centos:centos7.9.2009.zh.jdk8                                                                                                                                                                           0.1s
       => [internal] load build context                                                                                                                                                                                                        0.5s
       => => transferring context: 29.69MB                                                                                                                                                                                                     0.3s
       => [2/4] RUN mkdir /root/app                                                                                                                                                                                                            1.4s
       => [3/4] ADD sample-web.jar /root/app                                                                                                                                                                                                   0.4s
       => [4/4] WORKDIR /root/app                                                                                                                                                                                                              0.0s
       => exporting to image                                                                                                                                                                                                                   0.1s
       => => exporting layers                                                                                                                                                                                                                  0.1s
       => => writing image sha256:87f0d17c236562ba7a121b6a0d67989e600a9462076c843f533a5e66b2d6fd11                                                                                                                                             0.0s
       => => naming to docker.io/library/sample-web                                                                                                                                                                                            0.0s
      
      [root@centos sample-web]# docker images
      REPOSITORY   TAG                      IMAGE ID       CREATED             SIZE
      sample-web   latest                   87f0d17c2365   13 seconds ago      630MB
      centos       centos7.9.2009.zh.jdk8   1d8f07606c31   About an hour ago   601MB
      centos       centos7.9.2009.zh        2da052a37ba1   15 hours ago        204MB
      mysql        5.7                      be16cf2d832a   4 weeks ago         455MB
      centos       centos7.9.2009           eeb6ee3f44bd   17 months ago       204MB

- 运行镜像

      // 创建容器
      // --network 指定容器的网络
      [root@centos sample-web]# docker run -d -p 8888:8080 --name sample-web --network network-db sample-web
      2a7e478d7bf3cc112a6650c8da5ee3648b4e879a4fd9f97942609bc1b9e4439c
      
      [root@centos sample-web]# docker ps
      CONTAINER ID   IMAGE                           COMMAND                   CREATED             STATUS             PORTS                                                    NAMES
      2a7e478d7bf3   sample-web                      "/bin/sh -c 'java -j…"   7 seconds ago       Up 6 seconds       0.0.0.0:8888->8080/tcp, :::8888->8080/tcp                sample-web
      bf2f633f37ad   mysql:5.7                       "docker-entrypoint.s…"   26 minutes ago      Up 26 minutes      33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   mysql-57
      0366238d416a   centos:centos7.9.2009.zh.jdk8   "/bin/bash"               About an hour ago   Up About an hour                                                            centos-zh-jdk8
      14e9d2cc3400   centos:centos7.9.2009.zh        "/bin/bash"               15 hours ago        Up 15 hours                                                                 centos-zh
      9feed4d0b8aa   centos:centos7.9.2009           "/bin/bash"               17 hours ago        Up 17 hours                                                                 centos-init
      
      [root@centos sample-web]# docker exec -it sample-web /bin/bash
      [root@2a7e478d7bf3 app]# ll
      total 28992
      -rw-r--r-- 1 root root     2398 Mar  5 13:30 app.log
      -rw-r--r-- 1 root root 29681534 Mar  2 15:12 sample-web.jar
      
      // 容器内可以访问 mysql
      [root@2a7e478d7bf3 app]# ping mysql
      PING mysql (192.168.32.2) 56(84) bytes of data.
      64 bytes from mysql-57.network-db (192.168.32.2): icmp_seq=1 ttl=64 time=0.069 ms
      64 bytes from mysql-57.network-db (192.168.32.2): icmp_seq=2 ttl=64 time=0.057 ms
      64 bytes from mysql-57.network-db (192.168.32.2): icmp_seq=3 ttl=64 time=0.059 ms
      ...
      
      [root@2a7e478d7bf3 app]# exit
      exit
      
      // 查看网络信息
      // Containers里面是网络内容器信息
      [root@centos sample-web]# docker network inspect network-db
      [
          {
              "Name": "network-db",
              "Id": "7042ee709f56a7aef672ca01270aa68cc358ea898ca14f6f1de99ab241f421c5",
              "Created": "2023-03-05T12:53:19.004063337+08:00",
              "Scope": "local",
              "Driver": "bridge",
              "EnableIPv6": false,
              "IPAM": {
                  "Driver": "default",
                  "Options": {},
                  "Config": [
                      {
                          "Subnet": "192.168.32.0/20",
                          "Gateway": "192.168.32.1"
                      }
                  ]
              },
              "Internal": false,
              "Attachable": false,
              "Ingress": false,
              "ConfigFrom": {
                  "Network": ""
              },
              "ConfigOnly": false,
              "Containers": {
                  "2a7e478d7bf3cc112a6650c8da5ee3648b4e879a4fd9f97942609bc1b9e4439c": {
                      "Name": "sample-web",
                      "EndpointID": "e658b9e99a6befaa5d700d455d0ee582b6a79d9c783d9b2a075feea4f32a3659",
                      "MacAddress": "02:42:c0:a8:20:03",
                      "IPv4Address": "192.168.32.3/20",
                      "IPv6Address": ""
                  },
                  "bf2f633f37adf3b842f1065ef69f647ddcd0161fa27ca30479b328bbb7442e3e": {
                      "Name": "mysql-57",
                      "EndpointID": "61edb32060591b3201795de12f187813eb4a3c14be9ba55825c701560ec9207a",
                      "MacAddress": "02:42:c0:a8:20:02",
                      "IPv4Address": "192.168.32.2/20",
                      "IPv6Address": ""
                  }
              },
              "Options": {},
              "Labels": {}
          }
      ]

- 查看容器日志

      [root@centos sample-web]# docker logs sample-web
      
        .   ____          _            __ _ _
       /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
      ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
       \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
        '  |____| .__|_| |_|_| |_\__, | / / / /
       =========|_|==============|___/=/_/_/_/
       :: Spring Boot ::       (v2.3.12.RELEASE)
      
      [2023-03-05 13:30:06.477] [sample-web] [trace=] [token=] [background-preinit] INFO  o.h.validator.internal.util.Version - HV000001: Hibernate Validator 6.1.7.Final
      [2023-03-05 13:30:06.491] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Starting SampleWebApplication v1.0.0-SNAPSHOT on 2a7e478d7bf3 with PID 1 (/root/app/sample-web.jar started by root in /root/app)
      [2023-03-05 13:30:06.492] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - No active profile set, falling back to default profiles: default
      [2023-03-05 13:30:08.585] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat initialized with port(s): 8080 (http)
      [2023-03-05 13:30:08.599] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Initializing ProtocolHandler ["http-nio-8080"]
      [2023-03-05 13:30:08.600] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardService - Starting service [Tomcat]
      [2023-03-05 13:30:08.601] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardEngine - Starting Servlet engine: [Apache Tomcat/9.0.46]
      [2023-03-05 13:30:08.675] [sample-web] [trace=] [token=] [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring embedded WebApplicationContext
      [2023-03-05 13:30:08.675] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext - Root WebApplicationContext: initialization completed in 1999 ms
      [2023-03-05 13:30:08.897] [sample-web] [trace=] [token=] [main] INFO  c.a.d.s.b.a.DruidDataSourceAutoConfigure - Init DruidDataSource
      [2023-03-05 13:30:10.113] [sample-web] [trace=] [token=] [main] INFO  c.alibaba.druid.pool.DruidDataSource - {dataSource-1} inited
      [2023-03-05 13:30:10.421] [sample-web] [trace=] [token=] [main] INFO  o.s.s.c.ThreadPoolTaskExecutor - Initializing ExecutorService 'applicationTaskExecutor'
      [2023-03-05 13:30:10.675] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Starting ProtocolHandler ["http-nio-8080"]
      [2023-03-05 13:30:10.708] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port(s): 8080 (http) with context path ''
      [2023-03-05 13:30:10.723] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Started SampleWebApplication in 4.987 seconds (JVM running for 5.691)
      [2023-03-05 13:35:25.650] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring DispatcherServlet 'dispatcherServlet'
      [2023-03-05 13:35:25.651] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Initializing Servlet 'dispatcherServlet'
      [2023-03-05 13:35:25.661] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Completed initialization in 10 ms
      
      [2023-03-05 13:40:18.443] [sample-web] [trace=ff438d42-61ea-4264-b61d-54d4afade645] [token=] [http-nio-8080-exec-10] INFO  c.g.f.c.web.filter.HttpLogFilter - Received Request:
      POST /api/user/AddUser HTTP/1.1
      content-type: application/json
      user-agent: PostmanRuntime/7.30.1
      accept: */*
      postman-token: 6b45bf19-2a6f-4ff2-a984-7cc3eb55546a
      host: 39.107.235.147:8888
      accept-encoding: gzip, deflate, br
      connection: keep-alive
      content-length: 157
      
      {
          "username": "admin",
          "password": "e10adc3949ba59abbe56e057f20f883e",
          "nickname": "管理员",
          "telephone": "13512345678",
          "status": 0
      }
      
      [2023-03-05 13:40:18.918] [sample-web] [trace=ff438d42-61ea-4264-b61d-54d4afade645] [token=] [http-nio-8080-exec-10] INFO  c.g.f.c.web.filter.HttpLogFilter - Send Response:
      HTTP/1.1 200 XX
      Vary: Origin
      Vary: Origin
      Vary: Origin
      
      {"code":200,"message":"成功"}

# 完