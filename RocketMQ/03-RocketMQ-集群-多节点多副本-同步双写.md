# 03-RocketMQ-集群-多节点多副本-同步双写

[参考官网](https://rocketmq.apache.org/zh/docs/deploymentOperations/01deploy)

## 手动创建镜像

下载 `rocketmq-docker` 项目创建镜像：

    [root@centos rocketmq-docker]# cd image-build
    [root@centos image-build]# sh build-image.sh 5.1.0 centos
    [root@centos image-build]# sh build-image-dashboard.sh 1.0.0 centos
    [root@centos image-build]# docker images
    REPOSITORY                  TAG                      IMAGE ID       CREATED         SIZE
    apache/rocketmq-dashboard   1.0.0-centos             e7c520a7cd18   2 minutes ago   821MB
    apache/rocketmq             5.1.0                    24ca67624db9   2 hours ago     599MB

## 创建 Docker Compose 文件

    // 编辑 Docker Compose
    [root@centos rocketmq-cluster]# vim docker-compose.yml
    [root@centos rocketmq-cluster]# cat docker-compose.yml
    services:
      rocketmq-name-1:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-name-1
        restart: always
        ports:
          - 9876:9876
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
        command: sh mqnamesrv
    
      rocketmq-name-2:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-name-2
        restart: always
        ports:
          - 9877:9876
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
        command: sh mqnamesrv
    
      rocketmq-broker-a:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-broker-a
        restart: always
        ports:
          - 10909:10909
          - 10911:10911
          - 10912:10912
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
          NAMESRV_ADDR: "rocketmq-name-1:9876;rocketmq-name-2:9876"
        command: sh mqbroker -c ../conf/2m-2s-sync/broker-a.properties --enable-proxy
        depends_on:
          - rocketmq-name-1
          - rocketmq-name-2
    
      rocketmq-broker-a-s:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-broker-a-s
        restart: always
        ports:
          - 20909:10909
          - 20911:10911
          - 20912:10912
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
          NAMESRV_ADDR: "rocketmq-name-1:9876;rocketmq-name-2:9876"
        command: sh mqbroker -c ../conf/2m-2s-sync/broker-a-s.properties --enable-proxy
        depends_on:
          - rocketmq-name-1
          - rocketmq-name-2
    
      rocketmq-broker-b:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-broker-b
        restart: always
        ports:
          - 30909:10909
          - 30911:10911
          - 30912:10912
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
          NAMESRV_ADDR: "rocketmq-name-1:9876;rocketmq-name-2:9876"
        command: sh mqbroker -c ../conf/2m-2s-sync/broker-b.properties --enable-proxy
        depends_on:
          - rocketmq-name-1
          - rocketmq-name-2
    
      rocketmq-broker-b-s:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-broker-b-s
        restart: always
        ports:
          - 40909:10909
          - 40911:10911
          - 40912:10912
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
          NAMESRV_ADDR: "rocketmq-name-1:9876;rocketmq-name-2:9876"
        command: sh mqbroker -c ../conf/2m-2s-sync/broker-b-s.properties --enable-proxy
        depends_on:
          - rocketmq-name-1
          - rocketmq-name-2
    
    # 外部网络
    networks:
      default:
        name: network0
        external: true
    
## 创建并启动服务

创建并启动服务：

    [root@centos rocketmq-cluster]# docker compose up -d
    [+] Running 6/6
     ⠿ Container rocketmq-cluster-rocketmq-name-1-1      Started        0.7s
     ⠿ Container rocketmq-cluster-rocketmq-name-2-1      Started        0.7s
     ⠿ Container rocketmq-cluster-rocketmq-broker-b-s-1  Started        2.3s
     ⠿ Container rocketmq-cluster-rocketmq-broker-a-s-1  Started        2.3s
     ⠿ Container rocketmq-cluster-rocketmq-broker-b-1    Started        2.0s
     ⠿ Container rocketmq-cluster-rocketmq-broker-a-1    Started        2.0s

查看服务：

    [root@centos rocketmq-cluster]# docker compose ps
    NAME                                     IMAGE                   COMMAND                  SERVICE               CREATED             STATUS              PORTS
    rocketmq-cluster-rocketmq-broker-a-1     apache/rocketmq:5.1.0   "sh mqbroker -c ../c…"   rocketmq-broker-a     10 seconds ago      Up 8 seconds        0.0.0.0:10909->10909/tcp, :::10909->10909/tcp, 9876/tcp, 0.0.0.0:10911-10912->10911-10912/tcp, :::10911-10912->10911-10912/tcp
    rocketmq-cluster-rocketmq-broker-a-s-1   apache/rocketmq:5.1.0   "sh mqbroker -c ../c…"   rocketmq-broker-a-s   10 seconds ago      Up 8 seconds        9876/tcp, 0.0.0.0:20909->10909/tcp, :::20909->10909/tcp, 0.0.0.0:20911->10911/tcp, :::20911->10911/tcp, 0.0.0.0:20912->10912/tcp, :::20912->10912/tcp
    rocketmq-cluster-rocketmq-broker-b-1     apache/rocketmq:5.1.0   "sh mqbroker -c ../c…"   rocketmq-broker-b     10 seconds ago      Up 9 seconds        9876/tcp, 0.0.0.0:30909->10909/tcp, :::30909->10909/tcp, 0.0.0.0:30911->10911/tcp, :::30911->10911/tcp, 0.0.0.0:30912->10912/tcp, :::30912->10912/tcp
    rocketmq-cluster-rocketmq-broker-b-s-1   apache/rocketmq:5.1.0   "sh mqbroker -c ../c…"   rocketmq-broker-b-s   10 seconds ago      Up 8 seconds        9876/tcp, 0.0.0.0:40909->10909/tcp, :::40909->10909/tcp, 0.0.0.0:40911->10911/tcp, :::40911->10911/tcp, 0.0.0.0:40912->10912/tcp, :::40912->10912/tcp
    rocketmq-cluster-rocketmq-name-1-1       apache/rocketmq:5.1.0   "sh mqnamesrv"           rocketmq-name-1       11 seconds ago      Up 10 seconds       10909/tcp, 0.0.0.0:9876->9876/tcp, :::9876->9876/tcp, 10911-10912/tcp
    rocketmq-cluster-rocketmq-name-2-1       apache/rocketmq:5.1.0   "sh mqnamesrv"           rocketmq-name-2       11 seconds ago      Up 10 seconds       10909/tcp, 10911-10912/tcp, 0.0.0.0:9877->9876/tcp, :::9877->9876/tcp

## RocketMQ Dashboard

创建并启动服务：

    [root@centos rocketmq-cluster]# docker run -d -p 9000:8080 --network network0 --name rocketmq-dashboard apache/rocketmq-dashboard:1.0.0-centos
    391a75c6388b73149745219fae97b7997cdc02cf6986dc489a987657bb429466

查看服务：

    [root@centos rocketmq-cluster]# docker ps
    CONTAINER ID   IMAGE                                    COMMAND                   CREATED         STATUS         PORTS                                                                                                                                                   NAMES
    391a75c6388b   apache/rocketmq-dashboard:1.0.0-centos   "java -jar bin/rocke…"   3 seconds ago   Up 3 seconds   0.0.0.0:9000->8080/tcp, :::9000->8080/tcp                                                                                                               rocketmq-dashboard
    db7a141d0737   apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   5 hours ago     Up 5 hours     9876/tcp, 0.0.0.0:30909->10909/tcp, :::30909->10909/tcp, 0.0.0.0:30911->10911/tcp, :::30911->10911/tcp, 0.0.0.0:30912->10912/tcp, :::30912->10912/tcp   rocketmq-cluster-rocketmq-broker-b-1
    dd4af1f782b8   apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   5 hours ago     Up 5 hours     9876/tcp, 0.0.0.0:20909->10909/tcp, :::20909->10909/tcp, 0.0.0.0:20911->10911/tcp, :::20911->10911/tcp, 0.0.0.0:20912->10912/tcp, :::20912->10912/tcp   rocketmq-cluster-rocketmq-broker-a-s-1
    36dea6e4de42   apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   5 hours ago     Up 5 hours     0.0.0.0:10909->10909/tcp, :::10909->10909/tcp, 9876/tcp, 0.0.0.0:10911-10912->10911-10912/tcp, :::10911-10912->10911-10912/tcp                          rocketmq-cluster-rocketmq-broker-a-1
    93df3897cba0   apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   5 hours ago     Up 5 hours     9876/tcp, 0.0.0.0:40909->10909/tcp, :::40909->10909/tcp, 0.0.0.0:40911->10911/tcp, :::40911->10911/tcp, 0.0.0.0:40912->10912/tcp, :::40912->10912/tcp   rocketmq-cluster-rocketmq-broker-b-s-1
    a9ec42d8400e   apache/rocketmq:5.1.0                    "sh mqnamesrv"            5 hours ago     Up 5 hours     10909/tcp, 10911-10912/tcp, 0.0.0.0:9877->9876/tcp, :::9877->9876/tcp                                                                                   rocketmq-cluster-rocketmq-name-2-1
    83c99f3d5bbf   apache/rocketmq:5.1.0                    "sh mqnamesrv"            5 hours ago     Up 5 hours     10909/tcp, 0.0.0.0:9876->9876/tcp, :::9876->9876/tcp, 10911-10912/tcp                                                                                   rocketmq-cluster-rocketmq-name-1-1
    4b2b3527cf74   centos:centos7.9.2009.zh.jdk8            "/bin/bash"               5 days ago      Up 5 days                                                                                                                                                              canal-server-slave
    45496a969f8c   centos:centos7.9.2009.zh.jdk8            "/bin/bash"               5 days ago      Up 5 days                                                                                                                                                              canal-server-master
    29653653786b   centos:centos7.9.2009.zh.jdk8            "/bin/bash"               5 days ago      Up 4 days      0.0.0.0:8888->8089/tcp, :::8888->8089/tcp                                                                                                               canal-admin
    f82cc81ec98e   mysql:5.7.zh                             "docker-entrypoint.s…"   6 days ago      Up 6 days      33060/tcp, 0.0.0.0:33082->3306/tcp, :::33082->3306/tcp                                                                                                  mysql-33082-slave
    1e1be6e39fb7   mysql:5.7.zh                             "docker-entrypoint.s…"   6 days ago      Up 6 days      33060/tcp, 0.0.0.0:33081->3306/tcp, :::33081->3306/tcp                                                                                                  mysql-33081-master
    a7650129089f   mysql:5.7.zh                             "docker-entrypoint.s…"   6 days ago      Up 6 days      33060/tcp, 0.0.0.0:33072->3306/tcp, :::33072->3306/tcp                                                                                                  mysql-33072-slave
    b6fd417cb1b1   mysql:5.7.zh                             "docker-entrypoint.s…"   6 days ago      Up 6 days      33060/tcp, 0.0.0.0:33071->3306/tcp, :::33071->3306/tcp                                                                                                  mysql-33071-master
    b1f79214e313   zookeeper:3.7.1-temurin                  "/docker-entrypoint.…"   6 days ago      Up 6 days      2888/tcp, 3888/tcp, 0.0.0.0:2182->2181/tcp, :::2182->2181/tcp, 0.0.0.0:21820->8080/tcp, :::21820->8080/tcp                                              zookeeper-cluster-zoo2-1
    0bf4fce71dac   zookeeper:3.7.1-temurin                  "/docker-entrypoint.…"   6 days ago      Up 6 days      2888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp, 3888/tcp, 0.0.0.0:21810->8080/tcp, :::21810->8080/tcp                                              zookeeper-cluster-zoo1-1
    d25d4cbbb2f8   zookeeper:3.7.1-temurin                  "/docker-entrypoint.…"   6 days ago      Up 6 days      2888/tcp, 3888/tcp, 0.0.0.0:2183->2181/tcp, :::2183->2181/tcp, 0.0.0.0:21830->8080/tcp, :::21830->8080/tcp                                              zookeeper-cluster-zoo3-1

打开 `http://39.107.235.147:9000` 在 `运维` 下面的 `NameServerAddressList` 输入 `rocketmq-name-1:9876;rocketmq-name-2:9876` 就可以使用了。

# 完