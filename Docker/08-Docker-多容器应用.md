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

    [root@centos ~]# docker network create network-db
    7a87bf0efc8281a40484bfd1ee7b049250ffebea62071cf057cc294b60724f69

    [root@centos ~]# docker network ls
    NETWORK ID     NAME         DRIVER    SCOPE
    3528c4b9b0c5   bridge       bridge    local
    c1baf3b0966d   host         host      local
    7a87bf0efc82   network-db   bridge    local
    2656d3bb9028   none         null      local

    // 查看网络信息
    [root@centos ~]# docker network inspect network-db
    [
        {
            "Name": "network-db",
            "Id": "7a87bf0efc8281a40484bfd1ee7b049250ffebea62071cf057cc294b60724f69",
            "Created": "2023-03-02T11:35:20.022277593+08:00",
            "Scope": "local",
            "Driver": "bridge",
            "EnableIPv6": false,
            "IPAM": {
                "Driver": "default",
                "Options": {},
                "Config": [
                    {
                        "Subnet": "172.21.0.0/16",
                        "Gateway": "172.21.0.1"
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
    docker run -d -p 33060:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql-33060 --network network-db --network-alias mysql mysql:5.7

实例：

    [root@centos ~]# docker run -d -p 33060:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql-33060 --network network-db --network-alias mysql mysql:5.7
    42c9ddcb6fe41f3b0ac2c5bd2ef092a9a54d1564f2626c14216cd2c02149c9d2

    [root@centos ~]# docker ps
    CONTAINER ID   IMAGE       COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
    42c9ddcb6fe4   mysql:5.7   "docker-entrypoint.s…"   5 seconds ago   Up 4 seconds   33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   mysql-33060

    // 进入容器查看数据库
    [root@centos ~]# docker exec -it mysql-33060 mysql -p
    Enter password:
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 6
    Server version: 5.7.41 MySQL Community Server (GPL)
    
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

    mysql> exit;
    Bye

创建示例数据库和表：

    CREATE DATABASE sample;
    
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

基于 `centos-jdk:8` 构造 `sample-web` 镜像：

- 编写 `Dockerfile`

      [root@centos docker]# cd sample-web/
      [root@centos sample-web]# ll
      总用量 28992
      -rw-r--r-- 1 root root      211 3月   2 15:22 Dockerfile
      -rw-r--r-- 1 root root 29681534 3月   2 15:12 sample-web.jar
      
      [root@centos sample-web]# cat Dockerfile
      FROM centos-jdk:8
      
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
      [+] Building 1.8s (9/9) FINISHED
       => [internal] load .dockerignore                                                                                                                                                                                                        0.1s
       => => transferring context: 2B                                                                                                                                                                                                          0.0s
       => [internal] load build definition from Dockerfile                                                                                                                                                                                     0.1s
       => => transferring dockerfile: 250B                                                                                                                                                                                                     0.0s
       => [internal] load metadata for docker.io/library/centos-jdk:8                                                                                                                                                                          0.0s
       => [internal] load build context                                                                                                                                                                                                        0.4s
       => => transferring context: 29.69MB                                                                                                                                                                                                     0.4s
       => [1/4] FROM docker.io/library/centos-jdk:8                                                                                                                                                                                            0.0s
       => [2/4] RUN mkdir /root/app                                                                                                                                                                                                            1.1s
       => [3/4] ADD sample-web.jar /root/app                                                                                                                                                                                                   0.4s
       => [4/4] WORKDIR /root/app                                                                                                                                                                                                              0.0s
       => exporting to image                                                                                                                                                                                                                   0.1s
       => => exporting layers                                                                                                                                                                                                                  0.1s
       => => writing image sha256:f7ae2026bacca8f39b3bc9753fa855d68a4116c5e76dab74fcffdc824a42fdbc                                                                                                                                             0.0s
       => => naming to docker.io/library/sample-web                                                                                                                                                                                            0.0s
      
      [root@centos sample-web]# docker images
      REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
      sample-web   latest    f7ae2026bacc   13 seconds ago   658MB
      centos-jdk   8         a8d7d9004c62   6 days ago       628MB
      mysql        5.7       be16cf2d832a   4 weeks ago      455MB
      centos       centos8   5d0da3dc9764   17 months ago    231MB

- 运行镜像

      // 创建容器
      // --network 指定容器的网络
      [root@centos sample-web]# docker run -d -p 8888:8080 --name sample-web-8888 --network network-db sample-web
      d385ba15df8999bc01897f656c8f5e1e2c7a1df2a20a62a205229c59a7e1fc33
      
      [root@centos sample-web]# docker ps
      CONTAINER ID   IMAGE        COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
      d385ba15df89   sample-web   "/bin/sh -c 'java -j…"   4 seconds ago   Up 3 seconds   0.0.0.0:8888->8080/tcp, :::8888->8080/tcp                sample-web-8888
      42c9ddcb6fe4   mysql:5.7    "docker-entrypoint.s…"   2 hours ago     Up 2 hours     33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   mysql-33060
      
      [root@centos sample-web]# docker exec -it d385ba15df89 /bin/bash
      [root@d385ba15df89 app]# ping mysql
      PING mysql (172.21.0.2) 56(84) bytes of data.
      64 bytes from mysql-33060.network-db (172.21.0.2): icmp_seq=1 ttl=64 time=0.057 ms
      64 bytes from mysql-33060.network-db (172.21.0.2): icmp_seq=2 ttl=64 time=0.076 ms
      64 bytes from mysql-33060.network-db (172.21.0.2): icmp_seq=3 ttl=64 time=0.057 ms

      [root@d385ba15df89 app]# ls
      app.log  sample-web.jar
      [root@d385ba15df89 app]# exit
      exit

      // 查看网络信息
      // Containers里面是网络内容器信息
      [root@centos sample-web]# docker network inspect network-db
      [
          {
              "Name": "network-db",
              "Id": "7a87bf0efc8281a40484bfd1ee7b049250ffebea62071cf057cc294b60724f69",
              "Created": "2023-03-02T11:35:20.022277593+08:00",
              "Scope": "local",
              "Driver": "bridge",
              "EnableIPv6": false,
              "IPAM": {
                  "Driver": "default",
                  "Options": {},
                  "Config": [
                      {
                          "Subnet": "172.21.0.0/16",
                          "Gateway": "172.21.0.1"
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
                  "42c9ddcb6fe41f3b0ac2c5bd2ef092a9a54d1564f2626c14216cd2c02149c9d2": {
                      "Name": "mysql-33060",
                      "EndpointID": "78b2fede3ca0f83ef1530ef4e9b8ae64af3855aa40a3bce7c7f6ea7a68fffc4a",
                      "MacAddress": "02:42:ac:15:00:02",
                      "IPv4Address": "172.21.0.2/16",
                      "IPv6Address": ""
                  },
                  "d385ba15df8999bc01897f656c8f5e1e2c7a1df2a20a62a205229c59a7e1fc33": {
                      "Name": "sample-web-8888",
                      "EndpointID": "989f3e388c4598714f90a56a846f1b8b000c97eb759e43776ee4c7e1caef2f79",
                      "MacAddress": "02:42:ac:15:00:03",
                      "IPv4Address": "172.21.0.3/16",
                      "IPv6Address": ""
                  }
              },
              "Options": {},
              "Labels": {}
          }
      ]

- 查看容器日志

      [root@centos sample-web]# docker logs d385ba15df89
      
        .   ____          _            __ _ _
       /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
      ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
       \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
        '  |____| .__|_| |_|_| |_\__, | / / / /
       =========|_|==============|___/=/_/_/_/
       :: Spring Boot ::       (v2.3.12.RELEASE)
      
      [2023-03-02 07:29:12.988] [sample-web] [trace=] [token=] [background-preinit] INFO  o.h.validator.internal.util.Version - HV000001: Hibernate Validator 6.1.7.Final
      [2023-03-02 07:29:13.026] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Starting SampleWebApplication v1.0.0-SNAPSHOT on d385ba15df89 with PID 1 (/root/app/sample-web.jar started by root in /root/app)
      [2023-03-02 07:29:13.027] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - No active profile set, falling back to default profiles: default
      [2023-03-02 07:29:15.299] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat initialized with port(s): 8080 (http)
      [2023-03-02 07:29:15.316] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Initializing ProtocolHandler ["http-nio-8080"]
      [2023-03-02 07:29:15.317] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardService - Starting service [Tomcat]
      [2023-03-02 07:29:15.317] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardEngine - Starting Servlet engine: [Apache Tomcat/9.0.46]
      [2023-03-02 07:29:15.384] [sample-web] [trace=] [token=] [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring embedded WebApplicationContext
      [2023-03-02 07:29:15.384] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext - Root WebApplicationContext: initialization completed in 2256 ms
      [2023-03-02 07:29:15.586] [sample-web] [trace=] [token=] [main] INFO  c.a.d.s.b.a.DruidDataSourceAutoConfigure - Init DruidDataSource
      [2023-03-02 07:29:16.631] [sample-web] [trace=] [token=] [main] INFO  c.alibaba.druid.pool.DruidDataSource - {dataSource-1} inited
      [2023-03-02 07:29:16.945] [sample-web] [trace=] [token=] [main] INFO  o.s.s.c.ThreadPoolTaskExecutor - Initializing ExecutorService 'applicationTaskExecutor'
      [2023-03-02 07:29:17.162] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Starting ProtocolHandler ["http-nio-8080"]
      [2023-03-02 07:29:17.185] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port(s): 8080 (http) with context path ''
      [2023-03-02 07:29:17.199] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Started SampleWebApplication in 4.844 seconds (JVM running for 5.456)

# 完