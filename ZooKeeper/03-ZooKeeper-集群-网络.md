# 03-ZooKeeper-集群-网络

使用已存在的 `docker` 网络创建集群。

## 创建网络

    [root@centos zookeeper-cluster]# docker network create network0
    355cc9de7da38c23f3db2157cfd7e71f0605794c8f52ed3a6f926309391abe91
    
    [root@centos zookeeper-cluster]# docker network ls
    NETWORK ID     NAME       DRIVER    SCOPE
    0c7f3765f44e   bridge     bridge    local
    c1baf3b0966d   host       host      local
    355cc9de7da3   network0   bridge    local
    2656d3bb9028   none       null      local
    
    [root@centos zookeeper-cluster]# docker network inspect network0
    [
        {
            "Name": "network0",
            "Id": "355cc9de7da38c23f3db2157cfd7e71f0605794c8f52ed3a6f926309391abe91",
            "Created": "2023-03-30T17:38:04.425997158+08:00",
            "Scope": "local",
            "Driver": "bridge",
            "EnableIPv6": false,
            "IPAM": {
                "Driver": "default",
                "Options": {},
                "Config": [
                    {
                        "Subnet": "172.25.0.0/16",
                        "Gateway": "172.25.0.1"
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

## Docker Compose 文件

使用环境变量 `JVMFLAGS` 指定最大内存。

    [root@centos zookeeper-cluster]# cat docker-compose.yml
    services:
      zoo1:
        image: zookeeper:3.7.1-temurin
        restart: always
        hostname: zoo1
        ports:
          - 2181:2181
          - 21810:8080
        environment:
          ZOO_MY_ID: 1
          ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181
          ZOO_TICK_TIME: 2000
          ZOO_INIT_LIMIT: 5
          ZOO_SYNC_LIMIT: 2
          ZOO_ADMINSERVER_ENABLED: true
          ZOO_LOG4J_PROP: INFO,ROLLINGFILE
          JVMFLAGS: -Xmx256m
          TZ: Asia/Shanghai
        volumes:
          - zoo1-conf:/conf
          - zoo1-data:/data
          - zoo1-datalog:/datalog
          - zoo1-logs:/logs
    
      zoo2:
        image: zookeeper:3.7.1-temurin
        restart: always
        hostname: zoo2
        ports:
          - 2182:2181
          - 21820:8080
        environment:
          ZOO_MY_ID: 2
          ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181
          ZOO_TICK_TIME: 2000
          ZOO_INIT_LIMIT: 5
          ZOO_SYNC_LIMIT: 2
          ZOO_ADMINSERVER_ENABLED: true
          ZOO_LOG4J_PROP: INFO,ROLLINGFILE
          JVMFLAGS: -Xmx256m
          TZ: Asia/Shanghai
        volumes:
          - zoo2-conf:/conf
          - zoo2-data:/data
          - zoo2-datalog:/datalog
          - zoo2-logs:/logs
    
      zoo3:
        image: zookeeper:3.7.1-temurin
        restart: always
        hostname: zoo3
        ports:
          - 2183:2181
          - 21830:8080
        environment:
          ZOO_MY_ID: 3
          ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181
          ZOO_TICK_TIME: 2000
          ZOO_INIT_LIMIT: 5
          ZOO_SYNC_LIMIT: 2
          ZOO_ADMINSERVER_ENABLED: true
          ZOO_LOG4J_PROP: INFO,ROLLINGFILE
          JVMFLAGS: -Xmx256m
          TZ: Asia/Shanghai
        volumes:
          - zoo3-conf:/conf
          - zoo3-data:/data
          - zoo3-datalog:/datalog
          - zoo3-logs:/logs
    
    volumes:
      # zoo1
      zoo1-conf:
      zoo1-data:
      zoo1-datalog:
      zoo1-logs:
      # zoo2
      zoo2-conf:
      zoo2-data:
      zoo2-datalog:
      zoo2-logs:
      # zoo3
      zoo3-conf:
      zoo3-data:
      zoo3-datalog:
      zoo3-logs:
    
    # 使用外部网络
    networks:
      default:
        name: network0
        external: true
    

## 创建并启动服务

    [root@centos zookeeper-cluster]# docker compose up -d
    [+] Running 15/15
     ⠿ Volume "zookeeper-cluster_zoo1-logs"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-conf"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-datalog"  Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-logs"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo1-conf"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-logs"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-data"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-conf"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo1-data"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo1-datalog"  Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-data"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-datalog"  Created                                                                                                                                                                                      0.0s
     ⠿ Container zookeeper-cluster-zoo2-1       Started                                                                                                                                                                                      0.7s
     ⠿ Container zookeeper-cluster-zoo1-1       Started                                                                                                                                                                                      0.8s
     ⠿ Container zookeeper-cluster-zoo3-1       Started                                                                                                                                                                                      0.8s

## 查看服务

    [root@centos zookeeper-cluster]# docker compose ps
    NAME                       IMAGE                     COMMAND                  SERVICE             CREATED             STATUS              PORTS
    zookeeper-cluster-zoo1-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo1                13 seconds ago      Up 12 seconds       2888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp, 3888/tcp, 0.0.0.0:21810->8080/tcp, :::21810->8080/tcp
    zookeeper-cluster-zoo2-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo2                13 seconds ago      Up 12 seconds       2888/tcp, 3888/tcp, 0.0.0.0:2182->2181/tcp, :::2182->2181/tcp, 0.0.0.0:21820->8080/tcp, :::21820->8080/tcp
    zookeeper-cluster-zoo3-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo3                13 seconds ago      Up 12 seconds       2888/tcp, 3888/tcp, 0.0.0.0:2183->2181/tcp, :::2183->2181/tcp, 0.0.0.0:21830->8080/tcp, :::21830->8080/tcp

## 查看网络中的容器

    [root@centos zookeeper-cluster]# docker network inspect network0
    [
        {
            "Name": "network0",
            "Id": "355cc9de7da38c23f3db2157cfd7e71f0605794c8f52ed3a6f926309391abe91",
            "Created": "2023-03-30T17:38:04.425997158+08:00",
            "Scope": "local",
            "Driver": "bridge",
            "EnableIPv6": false,
            "IPAM": {
                "Driver": "default",
                "Options": {},
                "Config": [
                    {
                        "Subnet": "172.25.0.0/16",
                        "Gateway": "172.25.0.1"
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
                "0bf4fce71dac17114bc326d6bee0fcff8c953881db5148ec0fb19c1388967788": {
                    "Name": "zookeeper-cluster-zoo1-1",
                    "EndpointID": "84fba743cacbf513d2c3c803331c70b94cc6a1cd9a050530deb67f8520bfc8f4",
                    "MacAddress": "02:42:ac:19:00:03",
                    "IPv4Address": "172.25.0.3/16",
                    "IPv6Address": ""
                },
                "b1f79214e313157a2e6ded5b7448e96122f1a4755424c12d7f8f5ddaf21f0834": {
                    "Name": "zookeeper-cluster-zoo2-1",
                    "EndpointID": "733211c9095aecd453ff7ae33b5131738830961bdd3c52298f80311b51ed1d1f",
                    "MacAddress": "02:42:ac:19:00:02",
                    "IPv4Address": "172.25.0.2/16",
                    "IPv6Address": ""
                },
                "d25d4cbbb2f82063c7f917e144319b737ba8c1a6851e427f3861369f9c1f3827": {
                    "Name": "zookeeper-cluster-zoo3-1",
                    "EndpointID": "d29735e535e0ed5e2087ad90617b76da85790322154618988faca156de84cd4d",
                    "MacAddress": "02:42:ac:19:00:04",
                    "IPv4Address": "172.25.0.4/16",
                    "IPv6Address": ""
                }
            },
            "Options": {},
            "Labels": {}
        }
    ]

可以看到网络中包含刚创建的 `3` 个容器。

## 完
