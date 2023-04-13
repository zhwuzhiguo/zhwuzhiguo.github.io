# 03-RocketMQ-集群-多节点单副本

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
      rocketmq-name:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-name
        restart: always
        ports:
          - 9876:9876
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
          NAMESRV_ADDR: "rocketmq-name:9876"
        command: sh mqbroker -c ../conf/2m-noslave/broker-a.properties --enable-proxy
        depends_on:
          - rocketmq-name
    
      rocketmq-broker-b:
        image: apache/rocketmq:5.1.0
        hostname: rocketmq-broker-b
        restart: always
        ports:
          - 20909:10909
          - 20911:10911
          - 20912:10912
        environment:
          TZ: Asia/Shanghai
          JAVA_OPT_EXT: "-server -Xms256M -Xmx256M -Xmn128M"
          NAMESRV_ADDR: "rocketmq-name:9876"
        command: sh mqbroker -c ../conf/2m-noslave/broker-b.properties --enable-proxy
        depends_on:
          - rocketmq-name
    
      rocketmq-dashboard:
        image: apache/rocketmq-dashboard:1.0.0-centos
        hostname: rocketmq-dashboard
        restart: always
        ports:
          - 9000:8080
        environment:
          TZ: Asia/Shanghai
        depends_on:
          - rocketmq-name
          - rocketmq-broker-a
          - rocketmq-broker-b
    
    # 外部网络
    networks:
      default:
        name: network0
        external: true
    
   
## 创建并启动服务

创建并启动服务：

    [root@centos rocketmq-cluster]# docker compose up -d
    [+] Running 4/4
     ⠿ Container rocketmq-cluster-rocketmq-name-1       Started        0.4s
     ⠿ Container rocketmq-cluster-rocketmq-broker-b-1   Started        1.2s
     ⠿ Container rocketmq-cluster-rocketmq-broker-a-1   Started        1.3s
     ⠿ Container rocketmq-cluster-rocketmq-dashboard-1  Started        2.0s


查看服务：

    [root@centos rocketmq-cluster]# docker compose ps
    NAME                                    IMAGE                                    COMMAND                  SERVICE              CREATED             STATUS              PORTS
    rocketmq-cluster-rocketmq-broker-a-1    apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   rocketmq-broker-a    10 seconds ago      Up 8 seconds        0.0.0.0:10909->10909/tcp, :::10909->10909/tcp, 9876/tcp, 0.0.0.0:10911-10912->10911-10912/tcp, :::10911-10912->10911-10912/tcp
    rocketmq-cluster-rocketmq-broker-b-1    apache/rocketmq:5.1.0                    "sh mqbroker -c ../c…"   rocketmq-broker-b    10 seconds ago      Up 9 seconds        9876/tcp, 0.0.0.0:20909->10909/tcp, :::20909->10909/tcp, 0.0.0.0:20911->10911/tcp, :::20911->10911/tcp, 0.0.0.0:20912->10912/tcp, :::20912->10912/tcp
    rocketmq-cluster-rocketmq-dashboard-1   apache/rocketmq-dashboard:1.0.0-centos   "java -jar bin/rocke…"   rocketmq-dashboard   10 seconds ago      Up 8 seconds        0.0.0.0:9000->8080/tcp, :::9000->8080/tcp
    rocketmq-cluster-rocketmq-name-1        apache/rocketmq:5.1.0                    "sh mqnamesrv"           rocketmq-name        10 seconds ago      Up 9 seconds        10909/tcp, 0.0.0.0:9876->9876/tcp, :::9876->9876/tcp, 10911-10912/tcp

## RocketMQ Dashboard

打开 `http://39.107.235.147:9000` 在 `运维` 下面的 `NameServerAddressList` 输入 `rocketmq-name:9876` 就可以使用了。

# 完
