# 03-ZooKeeper-集群

在 docker 中启动 3 个 ZooKeeper 实例组成集群：

    // 使用镜像 zookeeper:3.7.1-temurin
    [root@centos zookeeper-cluster]# docker images
    REPOSITORY   TAG                      IMAGE ID       CREATED         SIZE
    zookeeper    3.7.1-temurin            e63555007bdf   11 days ago     299MB
    ...

## 创建 Docker Compose 文件

    // 编辑 Docker Compose
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
    
## 创建并启动服务

创建并启动服务：

    [root@centos zookeeper-cluster]# docker compose up -d
    [+] Running 16/16
     ⠿ Network zookeeper-cluster_default        Created                                                                                                                                                                                      0.1s
     ⠿ Volume "zookeeper-cluster_zoo1-datalog"  Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-datalog"  Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-data"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-datalog"  Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-logs"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-conf"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-data"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo1-data"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo2-conf"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo3-logs"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo1-conf"     Created                                                                                                                                                                                      0.0s
     ⠿ Volume "zookeeper-cluster_zoo1-logs"     Created                                                                                                                                                                                      0.0s
     ⠿ Container zookeeper-cluster-zoo2-1       Started                                                                                                                                                                                      0.8s
     ⠿ Container zookeeper-cluster-zoo3-1       Started                                                                                                                                                                                      0.8s
     ⠿ Container zookeeper-cluster-zoo1-1       Started                                                                                                                                                                                      0.9s

查看服务：

    [root@centos zookeeper-cluster]# docker compose ps
    NAME                       IMAGE                     COMMAND                  SERVICE             CREATED             STATUS              PORTS
    zookeeper-cluster-zoo1-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo1                32 seconds ago      Up 31 seconds       2888/tcp, 0.0.0.0:2181->2181/tcp, :::2181->2181/tcp, 3888/tcp, 0.0.0.0:21810->8080/tcp, :::21810->8080/tcp
    zookeeper-cluster-zoo2-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo2                32 seconds ago      Up 31 seconds       2888/tcp, 3888/tcp, 0.0.0.0:2182->2181/tcp, :::2182->2181/tcp, 0.0.0.0:21820->8080/tcp, :::21820->8080/tcp
    zookeeper-cluster-zoo3-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo3                32 seconds ago      Up 31 seconds       2888/tcp, 3888/tcp, 0.0.0.0:2183->2181/tcp, :::2183->2181/tcp, 0.0.0.0:21830->8080/tcp, :::21830->8080/tcp

查看网络：

    [root@centos zookeeper-cluster]# docker network ls
    NETWORK ID     NAME                        DRIVER    SCOPE
    0c7f3765f44e   bridge                      bridge    local
    c1baf3b0966d   host                        host      local
    b05ced53d58d   network-33080               bridge    local
    2656d3bb9028   none                        null      local
    8072ef9bead5   zookeeper-cluster_default   bridge    local

查看卷：

    [root@centos zookeeper-cluster]# docker volume ls
    DRIVER    VOLUME NAME
    local     zookeeper-cluster_zoo1-conf
    local     zookeeper-cluster_zoo1-data
    local     zookeeper-cluster_zoo1-datalog
    local     zookeeper-cluster_zoo1-logs
    local     zookeeper-cluster_zoo2-conf
    local     zookeeper-cluster_zoo2-data
    local     zookeeper-cluster_zoo2-datalog
    local     zookeeper-cluster_zoo2-logs
    local     zookeeper-cluster_zoo3-conf
    local     zookeeper-cluster_zoo3-data
    local     zookeeper-cluster_zoo3-datalog
    local     zookeeper-cluster_zoo3-logs

查看卷目录：

    [root@centos zookeeper-cluster]# cd /var/lib/docker/volumes/
    [root@centos volumes]# ll
    总用量 40
    brw------- 1 root root 253, 3 3月  27 16:57 backingFsBlockDev
    -rw------- 1 root root  65536 3月  27 19:09 metadata.db
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo1-conf
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo1-data
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo1-datalog
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo1-logs
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo2-conf
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo2-data
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo2-datalog
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo2-logs
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo3-conf
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo3-data
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo3-datalog
    drwx-----x 3 root root     19 3月  27 19:09 zookeeper-cluster_zoo3-logs

查看卷目录结构：

    [root@centos volumes]# tree .
    .
    ├── backingFsBlockDev
    ├── metadata.db
    ├── zookeeper-cluster_zoo1-conf
    │   └── _data
    │       ├── configuration.xsl
    │       ├── log4j.properties
    │       ├── zoo.cfg
    │       └── zoo_sample.cfg
    ├── zookeeper-cluster_zoo1-data
    │   └── _data
    │       ├── myid
    │       └── version-2
    │           ├── acceptedEpoch
    │           ├── currentEpoch
    │           └── snapshot.0
    ├── zookeeper-cluster_zoo1-datalog
    │   └── _data
    │       └── version-2
    ├── zookeeper-cluster_zoo1-logs
    │   └── _data
    │       ├── zookeeper_audit.log
    │       └── zookeeper--server-zoo1.log
    ├── zookeeper-cluster_zoo2-conf
    │   └── _data
    │       ├── configuration.xsl
    │       ├── log4j.properties
    │       ├── zoo.cfg
    │       └── zoo_sample.cfg
    ├── zookeeper-cluster_zoo2-data
    │   └── _data
    │       ├── myid
    │       └── version-2
    │           ├── acceptedEpoch
    │           ├── currentEpoch
    │           └── snapshot.0
    ├── zookeeper-cluster_zoo2-datalog
    │   └── _data
    │       └── version-2
    ├── zookeeper-cluster_zoo2-logs
    │   └── _data
    │       ├── zookeeper_audit.log
    │       └── zookeeper--server-zoo2.log
    ├── zookeeper-cluster_zoo3-conf
    │   └── _data
    │       ├── configuration.xsl
    │       ├── log4j.properties
    │       ├── zoo.cfg
    │       └── zoo_sample.cfg
    ├── zookeeper-cluster_zoo3-data
    │   └── _data
    │       ├── myid
    │       └── version-2
    │           ├── acceptedEpoch
    │           ├── currentEpoch
    │           └── snapshot.0
    ├── zookeeper-cluster_zoo3-datalog
    │   └── _data
    │       └── version-2
    └── zookeeper-cluster_zoo3-logs
        └── _data
            ├── zookeeper_audit.log
            └── zookeeper--server-zoo3.log

查看配置文件：

    [root@centos _data]# cat zoo.cfg
    dataDir=/data
    dataLogDir=/datalog
    tickTime=2000
    initLimit=5
    syncLimit=2
    autopurge.snapRetainCount=3
    autopurge.purgeInterval=0
    maxClientCnxns=60
    standaloneEnabled=true
    admin.enableServer=true
    server.1=zoo1:2888:3888;2181
    server.2=zoo2:2888:3888;2181
    server.3=zoo3:2888:3888;2181

查看启动日志：

    [root@centos _data]# cat zookeeper--server-zoo1.log
    2023-03-27 11:09:45,890 [myid:] - INFO  [main:QuorumPeerConfig@174] - Reading configuration from: /conf/zoo.cfg
    2023-03-27 11:09:45,906 [myid:] - INFO  [main:QuorumPeerConfig@435] - clientPort is not set
    2023-03-27 11:09:45,907 [myid:] - INFO  [main:QuorumPeerConfig@448] - secureClientPort is not set
    2023-03-27 11:09:45,907 [myid:] - INFO  [main:QuorumPeerConfig@464] - observerMasterPort is not set
    2023-03-27 11:09:45,908 [myid:] - INFO  [main:QuorumPeerConfig@481] - metricsProvider.className is org.apache.zookeeper.metrics.impl.DefaultMetricsProvider
    2023-03-27 11:09:45,970 [myid:1] - INFO  [main:DatadirCleanupManager@78] - autopurge.snapRetainCount set to 3
    2023-03-27 11:09:45,970 [myid:1] - INFO  [main:DatadirCleanupManager@79] - autopurge.purgeInterval set to 0
    2023-03-27 11:09:45,970 [myid:1] - INFO  [main:DatadirCleanupManager@101] - Purge task is not scheduled.
    2023-03-27 11:09:45,971 [myid:1] - INFO  [main:ManagedUtil@46] - Log4j 1.2 jmx support not found; jmx disabled.
    2023-03-27 11:09:45,971 [myid:1] - INFO  [main:QuorumPeerMain@152] - Starting quorum peer, myid=1
    2023-03-27 11:09:46,038 [myid:1] - INFO  [main:ServerMetrics@62] - ServerMetrics initialized with provider org.apache.zookeeper.metrics.impl.DefaultMetricsProvider@5ad851c9
    2023-03-27 11:09:46,046 [myid:1] - INFO  [main:DigestAuthenticationProvider@47] - ACL digest algorithm is: SHA1
    2023-03-27 11:09:46,046 [myid:1] - INFO  [main:DigestAuthenticationProvider@61] - zookeeper.DigestAuthenticationProvider.enabled = true
    2023-03-27 11:09:46,061 [myid:1] - INFO  [main:ServerCnxnFactory@169] - Using org.apache.zookeeper.server.NIOServerCnxnFactory as server connection factory
    2023-03-27 11:09:46,069 [myid:1] - WARN  [main:ServerCnxnFactory@309] - maxCnxns is not configured, using default value 0.
    2023-03-27 11:09:46,080 [myid:1] - INFO  [main:NIOServerCnxnFactory@652] - Configuring NIO connection handler with 10s sessionless connection timeout, 1 selector thread(s), 4 worker threads, and 64 kB direct buffers.
    2023-03-27 11:09:46,105 [myid:1] - INFO  [main:NIOServerCnxnFactory@660] - binding to port /0.0.0.0:2181
    2023-03-27 11:09:46,119 [myid:1] - INFO  [main:QuorumPeer@797] - zookeeper.quorumCnxnTimeoutMs=-1
    2023-03-27 11:09:46,179 [myid:1] - INFO  [main:Log@170] - Logging initialized @1550ms to org.eclipse.jetty.util.log.Slf4jLog
    2023-03-27 11:09:46,380 [myid:1] - WARN  [main:ContextHandler@1656] - o.e.j.s.ServletContextHandler@6c40365c{/,null,STOPPED} contextPath ends with /*
    2023-03-27 11:09:46,380 [myid:1] - WARN  [main:ContextHandler@1667] - Empty contextPath
    2023-03-27 11:09:46,426 [myid:1] - INFO  [main:X509Util@77] - Setting -D jdk.tls.rejectClientInitiatedRenegotiation=true to disable client-initiated TLS renegotiation
    2023-03-27 11:09:46,428 [myid:1] - INFO  [main:FileTxnSnapLog@124] - zookeeper.snapshot.trust.empty : false
    2023-03-27 11:09:46,436 [myid:1] - INFO  [main:QuorumPeer@1747] - Local sessions disabled
    2023-03-27 11:09:46,436 [myid:1] - INFO  [main:QuorumPeer@1758] - Local session upgrading disabled
    2023-03-27 11:09:46,436 [myid:1] - INFO  [main:QuorumPeer@1725] - tickTime set to 2000
    2023-03-27 11:09:46,437 [myid:1] - INFO  [main:QuorumPeer@1769] - minSessionTimeout set to 4000
    2023-03-27 11:09:46,437 [myid:1] - INFO  [main:QuorumPeer@1780] - maxSessionTimeout set to 40000
    2023-03-27 11:09:46,437 [myid:1] - INFO  [main:QuorumPeer@1805] - initLimit set to 5
    2023-03-27 11:09:46,437 [myid:1] - INFO  [main:QuorumPeer@1992] - syncLimit set to 2
    2023-03-27 11:09:46,437 [myid:1] - INFO  [main:QuorumPeer@2007] - connectToLearnerMasterLimit set to 0
    2023-03-27 11:09:46,465 [myid:1] - INFO  [main:ZookeeperBanner@42] -
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -   ______                  _
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -  |___  /                 | |
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -     / /    ___     ___   | | __   ___    ___   _ __     ___   _ __
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -    / /    / _ \   / _ \  | |/ /  / _ \  / _ \ | '_ \   / _ \ | '__|
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -   / /__  | (_) | | (_) | |   <  |  __/ |  __/ | |_) | |  __/ | |
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -  /_____|  \___/   \___/  |_|\_\  \___|  \___| | .__/   \___| |_|
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -                                               | |
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -                                               |_|
    2023-03-27 11:09:46,466 [myid:1] - INFO  [main:ZookeeperBanner@42] -
    2023-03-27 11:09:46,467 [myid:1] - INFO  [main:Environment@98] - Server environment:zookeeper.version=3.7.1-a2fb57c55f8e59cdd76c34b357ad5181df1258d5, built on 2022-05-07 06:45 UTC
    2023-03-27 11:09:46,467 [myid:1] - INFO  [main:Environment@98] - Server environment:host.name=zoo1
    2023-03-27 11:09:46,467 [myid:1] - INFO  [main:Environment@98] - Server environment:java.version=11.0.18
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:java.vendor=Eclipse Adoptium
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:java.home=/opt/java/openjdk
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:java.class.path=/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/target/classes:/apache-zookeeper-3.7.1-bin/bin/../build/classes:/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/target/lib/*.jar:/apache-zookeeper-3.7.1-bin/bin/../build/lib/*.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-prometheus-metrics-3.7.1.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-jute-3.7.1.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-3.7.1.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/snappy-java-1.1.7.7.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/slf4j-reload4j-1.7.35.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/slf4j-api-1.7.35.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_servlet-0.9.0.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_hotspot-0.9.0.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_common-0.9.0.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient-0.9.0.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/reload4j-1.2.19.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-native-unix-common-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-native-epoll-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-classes-epoll-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-resolver-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-handler-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-common-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-codec-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/netty-buffer-4.1.76.Final.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/metrics-core-4.1.12.1.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jline-2.14.6.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-util-ajax-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-util-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-servlet-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-server-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-security-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-io-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-http-9.4.43.v20210629.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/javax.servlet-api-3.1.0.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-databind-2.13.2.1.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-core-2.13.2.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-annotations-2.13.2.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/commons-cli-1.4.jar:/apache-zookeeper-3.7.1-bin/bin/../lib/audience-annotations-0.12.0.jar:/apache-zookeeper-3.7.1-bin/bin/../zookeeper-*.jar:/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/src/main/resources/lib/*.jar:/conf:
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:java.library.path=/usr/java/packages/lib:/usr/lib64:/lib64:/lib:/usr/lib
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:java.io.tmpdir=/tmp
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:java.compiler=<NA>
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:os.name=Linux
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:os.arch=amd64
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:os.version=4.18.0-348.7.1.el8_5.x86_64
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:user.name=zookeeper
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:user.home=/home/zookeeper
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:user.dir=/apache-zookeeper-3.7.1-bin
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:os.memory.free=16MB
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:os.memory.max=966MB
    2023-03-27 11:09:46,468 [myid:1] - INFO  [main:Environment@98] - Server environment:os.memory.total=27MB
    2023-03-27 11:09:46,469 [myid:1] - INFO  [main:ZooKeeperServer@138] - zookeeper.enableEagerACLCheck = false
    2023-03-27 11:09:46,486 [myid:1] - INFO  [main:ZooKeeperServer@151] - zookeeper.digest.enabled = true
    2023-03-27 11:09:46,487 [myid:1] - INFO  [main:ZooKeeperServer@155] - zookeeper.closeSessionTxn.enabled = true
    2023-03-27 11:09:46,487 [myid:1] - INFO  [main:ZooKeeperServer@1505] - zookeeper.flushDelay=0
    2023-03-27 11:09:46,487 [myid:1] - INFO  [main:ZooKeeperServer@1514] - zookeeper.maxWriteQueuePollTime=0
    2023-03-27 11:09:46,487 [myid:1] - INFO  [main:ZooKeeperServer@1523] - zookeeper.maxBatchSize=1000
    2023-03-27 11:09:46,487 [myid:1] - INFO  [main:ZooKeeperServer@260] - zookeeper.intBufferStartingSizeBytes = 1024
    2023-03-27 11:09:46,520 [myid:1] - INFO  [main:WatchManagerFactory@42] - Using org.apache.zookeeper.server.watch.WatchManager as watch manager
    2023-03-27 11:09:46,520 [myid:1] - INFO  [main:WatchManagerFactory@42] - Using org.apache.zookeeper.server.watch.WatchManager as watch manager
    2023-03-27 11:09:46,521 [myid:1] - INFO  [main:ZKDatabase@133] - zookeeper.snapshotSizeFactor = 0.33
    2023-03-27 11:09:46,522 [myid:1] - INFO  [main:ZKDatabase@153] - zookeeper.commitLogCount=500
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@2071] - Using insecure (non-TLS) quorum communication
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@2077] - Port unification disabled
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@180] - multiAddress.enabled set to false
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@205] - multiAddress.reachabilityCheckEnabled set to true
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@192] - multiAddress.reachabilityCheckTimeoutMs set to 1000
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@2532] - QuorumPeer communication is not secured! (SASL auth disabled)
    2023-03-27 11:09:46,576 [myid:1] - INFO  [main:QuorumPeer@2557] - quorum.cnxn.threads.size set to 20
    2023-03-27 11:09:46,587 [myid:1] - INFO  [main:SnapStream@61] - zookeeper.snapshot.compression.method = CHECKED
    2023-03-27 11:09:46,587 [myid:1] - INFO  [main:FileTxnSnapLog@479] - Snapshotting: 0x0 to /data/version-2/snapshot.0
    2023-03-27 11:09:46,600 [myid:1] - INFO  [main:ZKDatabase@290] - Snapshot loaded in 24 ms, highest zxid is 0x0, digest is 1371985504
    2023-03-27 11:09:46,602 [myid:1] - INFO  [main:QuorumPeer@1157] - currentEpoch not found! Creating with a reasonable default of 0. This should only happen when you are upgrading your installation
    2023-03-27 11:09:46,615 [myid:1] - INFO  [main:QuorumPeer@1185] - acceptedEpoch not found! Creating with a reasonable default of 0. This should only happen when you are upgrading your installation
    2023-03-27 11:09:46,638 [myid:1] - INFO  [main:Server@375] - jetty-9.4.43.v20210629; built: 2021-06-30T11:07:22.254Z; git: 526006ecfa3af7f1a27ef3a288e2bef7ea9dd7e8; jvm 11.0.18+10
    2023-03-27 11:09:46,723 [myid:1] - INFO  [main:DefaultSessionIdManager@334] - DefaultSessionIdManager workerName=node0
    2023-03-27 11:09:46,723 [myid:1] - INFO  [main:DefaultSessionIdManager@339] - No SessionScavenger set, using defaults
    2023-03-27 11:09:46,730 [myid:1] - INFO  [main:HouseKeeper@132] - node0 Scavenging every 600000ms
    2023-03-27 11:09:46,745 [myid:1] - WARN  [main:ConstraintSecurityHandler@759] - ServletContext@o.e.j.s.ServletContextHandler@6c40365c{/,null,STARTING} has uncovered http methods for path: /*
    2023-03-27 11:09:46,758 [myid:1] - INFO  [main:ContextHandler@915] - Started o.e.j.s.ServletContextHandler@6c40365c{/,null,AVAILABLE}
    2023-03-27 11:09:46,786 [myid:1] - INFO  [main:AbstractConnector@331] - Started ServerConnector@55182842{HTTP/1.1, (http/1.1)}{0.0.0.0:8080}
    2023-03-27 11:09:46,786 [myid:1] - INFO  [main:Server@415] - Started @2163ms
    2023-03-27 11:09:46,787 [myid:1] - INFO  [main:JettyAdminServer@190] - Started AdminServer on address 0.0.0.0, port 8080 and command URL /commands
    2023-03-27 11:09:46,787 [myid:1] - INFO  [main:QuorumPeer@2574] - Using 4000ms as the quorum cnxn socket timeout
    2023-03-27 11:09:46,801 [myid:1] - INFO  [main:QuorumCnxManager$Listener@924] - Election port bind maximum retries is 3
    2023-03-27 11:09:46,803 [myid:1] - INFO  [main:FastLeaderElection@89] - zookeeper.fastleader.minNotificationInterval=200
    2023-03-27 11:09:46,804 [myid:1] - INFO  [main:FastLeaderElection@91] - zookeeper.fastleader.maxNotificationInterval=60000
    2023-03-27 11:09:46,808 [myid:1] - INFO  [main:ZKAuditProvider@42] - ZooKeeper audit is disabled.
    2023-03-27 11:09:46,831 [myid:1] - INFO  [ListenerHandler-zoo1/172.21.0.3:3888:QuorumCnxManager$Listener$ListenerHandler@1071] - 1 is accepting connections now, my election bind port: zoo1/172.21.0.3:3888
    2023-03-27 11:09:46,854 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@1438] - LOOKING
    2023-03-27 11:09:46,860 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):FastLeaderElection@945] - New election. My id = 1, proposed zxid=0x0
    2023-03-27 11:09:46,879 [myid:1] - INFO  [WorkerReceiver[myid=1]:FastLeaderElection$Messenger$WorkerReceiver@390] - Notification: my state:LOOKING; n.sid:1, n.state:LOOKING, n.leader:1, n.round:0x1, n.peerEpoch:0x0, n.zxid:0x0, message format version:0x2, n.config version:0x0
    2023-03-27 11:09:46,882 [myid:1] - WARN  [QuorumConnectionThread-[myid=1]-1:QuorumCnxManager@401] - Cannot open channel to 2 at election address zoo2/172.21.0.2:3888
    java.net.ConnectException: Connection refused (Connection refused)
    	at java.base/java.net.PlainSocketImpl.socketConnect(Native Method)
    	at java.base/java.net.AbstractPlainSocketImpl.doConnect(Unknown Source)
    	at java.base/java.net.AbstractPlainSocketImpl.connectToAddress(Unknown Source)
    	at java.base/java.net.AbstractPlainSocketImpl.connect(Unknown Source)
    	at java.base/java.net.SocksSocketImpl.connect(Unknown Source)
    	at java.base/java.net.Socket.connect(Unknown Source)
    	at org.apache.zookeeper.server.quorum.QuorumCnxManager.initiateConnection(QuorumCnxManager.java:384)
    	at org.apache.zookeeper.server.quorum.QuorumCnxManager$QuorumConnectionReqThread.run(QuorumCnxManager.java:458)
    	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source)
    	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source)
    	at java.base/java.lang.Thread.run(Unknown Source)
    2023-03-27 11:09:46,889 [myid:1] - INFO  [ListenerHandler-zoo1/172.21.0.3:3888:QuorumCnxManager$Listener$ListenerHandler@1076] - Received connection request from /172.21.0.4:35472
    2023-03-27 11:09:46,889 [myid:1] - INFO  [QuorumConnectionThread-[myid=1]-2:QuorumCnxManager@514] - Have smaller server identifier, so dropping the connection: (myId:1 --> sid:3)
    2023-03-27 11:09:46,907 [myid:1] - INFO  [WorkerReceiver[myid=1]:FastLeaderElection$Messenger$WorkerReceiver@390] - Notification: my state:LOOKING; n.sid:3, n.state:LOOKING, n.leader:3, n.round:0x1, n.peerEpoch:0x0, n.zxid:0x0, message format version:0x2, n.config version:0x0
    2023-03-27 11:09:46,917 [myid:1] - INFO  [WorkerReceiver[myid=1]:FastLeaderElection$Messenger$WorkerReceiver@390] - Notification: my state:LOOKING; n.sid:1, n.state:LOOKING, n.leader:3, n.round:0x1, n.peerEpoch:0x0, n.zxid:0x0, message format version:0x2, n.config version:0x0
    2023-03-27 11:09:46,917 [myid:1] - INFO  [QuorumConnectionThread-[myid=1]-3:QuorumCnxManager@514] - Have smaller server identifier, so dropping the connection: (myId:1 --> sid:2)
    2023-03-27 11:09:46,923 [myid:1] - INFO  [ListenerHandler-zoo1/172.21.0.3:3888:QuorumCnxManager$Listener$ListenerHandler@1076] - Received connection request from /172.21.0.2:42526
    2023-03-27 11:09:46,934 [myid:1] - INFO  [WorkerReceiver[myid=1]:FastLeaderElection$Messenger$WorkerReceiver@390] - Notification: my state:LOOKING; n.sid:2, n.state:LOOKING, n.leader:2, n.round:0x1, n.peerEpoch:0x0, n.zxid:0x0, message format version:0x2, n.config version:0x0
    2023-03-27 11:09:46,939 [myid:1] - INFO  [WorkerReceiver[myid=1]:FastLeaderElection$Messenger$WorkerReceiver@390] - Notification: my state:LOOKING; n.sid:2, n.state:LOOKING, n.leader:3, n.round:0x1, n.peerEpoch:0x0, n.zxid:0x0, message format version:0x2, n.config version:0x0
    2023-03-27 11:09:47,139 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@902] - Peer state changed: following
    2023-03-27 11:09:47,140 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@1520] - FOLLOWING
    2023-03-27 11:09:47,157 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@130] - leaderConnectDelayDuringRetryMs: 100
    2023-03-27 11:09:47,157 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@131] - TCP NoDelay set to: true
    2023-03-27 11:09:47,157 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@132] - zookeeper.learner.asyncSending = false
    2023-03-27 11:09:47,157 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@133] - zookeeper.learner.closeSocketAsync = false
    2023-03-27 11:09:47,158 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):BlueThrottle@141] - Weighed connection throttling is disabled
    2023-03-27 11:09:47,159 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ZooKeeperServer@1306] - minSessionTimeout set to 4000
    2023-03-27 11:09:47,161 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ZooKeeperServer@1315] - maxSessionTimeout set to 40000
    2023-03-27 11:09:47,167 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ResponseCache@45] - getData response cache size is initialized with value 400.
    2023-03-27 11:09:47,167 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ResponseCache@45] - getChildren response cache size is initialized with value 400.
    2023-03-27 11:09:47,168 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestPathMetricsCollector@109] - zookeeper.pathStats.slotCapacity = 60
    2023-03-27 11:09:47,168 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestPathMetricsCollector@110] - zookeeper.pathStats.slotDuration = 15
    2023-03-27 11:09:47,168 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestPathMetricsCollector@111] - zookeeper.pathStats.maxDepth = 6
    2023-03-27 11:09:47,168 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestPathMetricsCollector@112] - zookeeper.pathStats.initialDelay = 5
    2023-03-27 11:09:47,168 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestPathMetricsCollector@113] - zookeeper.pathStats.delay = 5
    2023-03-27 11:09:47,168 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestPathMetricsCollector@114] - zookeeper.pathStats.enabled = false
    2023-03-27 11:09:47,170 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ZooKeeperServer@1542] - The max bytes for all large requests are set to 104857600
    2023-03-27 11:09:47,170 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ZooKeeperServer@1556] - The large request threshold is set to -1
    2023-03-27 11:09:47,170 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):AuthenticationHelper@66] - zookeeper.enforce.auth.enabled = false
    2023-03-27 11:09:47,171 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):AuthenticationHelper@67] - zookeeper.enforce.auth.schemes = []
    2023-03-27 11:09:47,171 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):ZooKeeperServer@361] - Created server with tickTime 2000 minSessionTimeout 4000 maxSessionTimeout 40000 clientPortListenBacklog -1 datadir /datalog/version-2 snapdir /data/version-2
    2023-03-27 11:09:47,171 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Follower@77] - FOLLOWING - LEADER ELECTION TOOK - 311 MS
    2023-03-27 11:09:47,173 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@916] - Peer state changed: following - discovery
    2023-03-27 11:09:47,178 [myid:1] - INFO  [LeaderConnector-zoo3/172.21.0.4:2888:Learner$LeaderConnector@384] - Successfully connected to leader, using address: zoo3/172.21.0.4:2888
    2023-03-27 11:09:47,201 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@916] - Peer state changed: following - synchronization
    2023-03-27 11:09:47,209 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@565] - Getting a diff from the leader 0x0
    2023-03-27 11:09:47,209 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@921] - Peer state changed: following - synchronization - diff
    2023-03-27 11:09:47,216 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@737] - Learner received NEWLEADER message
    2023-03-27 11:09:47,216 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@1875] - Dynamic reconfig is disabled, we don't store the last seen config.
    2023-03-27 11:09:47,217 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@921] - Peer state changed: following - synchronization
    2023-03-27 11:09:47,221 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):CommitProcessor@491] - Configuring CommitProcessor with readBatchSize -1 commitBatchSize 1
    2023-03-27 11:09:47,221 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):CommitProcessor@452] - Configuring CommitProcessor with 2 worker threads.
    2023-03-27 11:09:47,222 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):FollowerRequestProcessor@59] - Initialized FollowerRequestProcessor with zookeeper.follower.skipLearnerRequestToNextProcessor as false
    2023-03-27 11:09:47,224 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):RequestThrottler@75] - zookeeper.request_throttler.shutdownTimeout = 10000
    2023-03-27 11:09:47,269 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):Learner@721] - Learner received UPTODATE message
    2023-03-27 11:09:47,269 [myid:1] - INFO  [QuorumPeer[myid=1](plain=0.0.0.0:2181)(secure=disabled):QuorumPeer@916] - Peer state changed: following - broadcast

## 查看日志

    // 查看服务日志
    [root@centos ~]# cd zookeeper/zookeeper-cluster/
    [root@centos zookeeper-cluster]# docker compose logs -f
    zookeeper-cluster-zoo3-1  | ZooKeeper JMX enabled by default
    zookeeper-cluster-zoo3-1  | Using config: /conf/zoo.cfg
    zookeeper-cluster-zoo2-1  | ZooKeeper JMX enabled by default
    zookeeper-cluster-zoo1-1  | ZooKeeper JMX enabled by default
    zookeeper-cluster-zoo1-1  | Using config: /conf/zoo.cfg
    zookeeper-cluster-zoo2-1  | Using config: /conf/zoo.cfg

## 停止服务

    // 停止服务
    [root@centos zookeeper-cluster]# docker compose stop
    [+] Running 3/3
     ⠿ Container zookeeper-cluster-zoo1-1  Stopped                                                                                                                                                                                           0.6s
     ⠿ Container zookeeper-cluster-zoo2-1  Stopped                                                                                                                                                                                           0.6s
     ⠿ Container zookeeper-cluster-zoo3-1  Stopped                                                                                                                                                                                           0.5s
    
    // 查看服务
    [root@centos zookeeper-cluster]# docker compose ps -a
    NAME                       IMAGE                     COMMAND                  SERVICE             CREATED             STATUS                        PORTS
    zookeeper-cluster-zoo1-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo1                11 minutes ago      Exited (143) 12 seconds ago
    zookeeper-cluster-zoo2-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo2                11 minutes ago      Exited (143) 12 seconds ago
    zookeeper-cluster-zoo3-1   zookeeper:3.7.1-temurin   "/docker-entrypoint.…"   zoo3                11 minutes ago      Exited (143) 12 seconds ago

## 启动服务

    // 启动服务
    [root@centos zookeeper-cluster]# docker compose start
    [+] Running 3/3
     ⠿ Container zookeeper-cluster-zoo3-1  Started                                                                                                                                                                                           0.7s
     ⠿ Container zookeeper-cluster-zoo2-1  Started                                                                                                                                                                                           0.7s
     ⠿ Container zookeeper-cluster-zoo1-1  Started                                                                                                                                                                                           0.9s


## 查看服务角色

    // 服务状态 zoo1
    [root@centos zookeeper-cluster]# docker compose exec zoo1 zkServer.sh status
    ZooKeeper JMX enabled by default
    Using config: /conf/zoo.cfg
    Client port found: 2181. Client address: localhost. Client SSL: false.
    Mode: follower

    // 服务状态 zoo2
    [root@centos zookeeper-cluster]# docker compose exec zoo2 zkServer.sh status
    ZooKeeper JMX enabled by default
    Using config: /conf/zoo.cfg
    Client port found: 2181. Client address: localhost. Client SSL: false.
    Mode: follower
    
    // 服务状态 zoo3
    [root@centos zookeeper-cluster]# docker compose exec zoo3 zkServer.sh status
    ZooKeeper JMX enabled by default
    Using config: /conf/zoo.cfg
    Client port found: 2181. Client address: localhost. Client SSL: false.
    Mode: leader

##  连接服务

    // 连接服务 zoo1
    [root@centos zookeeper-cluster]# docker compose exec zoo1 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null
    [zk: localhost:2181(CONNECTED) 0] ls -R /
    /
    /zookeeper
    /zookeeper/config
    /zookeeper/quota
    [zk: localhost:2181(CONNECTED) 1] quit
    
    WATCHER::
    
    WatchedEvent state:Closed type:None path:null
    
    // 连接服务 zoo2
    [root@centos zookeeper-cluster]# docker compose exec zoo2 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null
    [zk: localhost:2181(CONNECTED) 0] ls -R /
    /
    /zookeeper
    /zookeeper/config
    /zookeeper/quota
    [zk: localhost:2181(CONNECTED) 1] quit
    
    WATCHER::
    
    WatchedEvent state:Closed type:None path:null
    
    // 连接服务 zoo3
    [root@centos zookeeper-cluster]# docker compose exec zoo3 zkCli.sh
    Connecting to localhost:2181
    Welcome to ZooKeeper!
    JLine support is enabled
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null
    [zk: localhost:2181(CONNECTED) 0] ls -R /
    /
    /zookeeper
    /zookeeper/config
    /zookeeper/quota
    [zk: localhost:2181(CONNECTED) 1] quit
    
    WATCHER::
    
    WatchedEvent state:Closed type:None path:null

## 停止并移除服务

    // 停止并移除服务
    // 1 删除容器
    // 2 删除卷
    // 3 删除网络
    [root@centos zookeeper-cluster]# docker compose down -v
    [+] Running 16/3
     ⠿ Container zookeeper-cluster-zoo1-1     Removed                                                                                                                                                                                        0.5s
     ⠿ Container zookeeper-cluster-zoo2-1     Removed                                                                                                                                                                                        0.7s
     ⠿ Container zookeeper-cluster-zoo3-1     Removed                                                                                                                                                                                        0.6s
     ⠿ Volume zookeeper-cluster_zoo3-datalog  Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo3-conf     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo1-conf     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo1-data     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo3-logs     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo3-data     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo1-logs     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo2-conf     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo2-logs     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo1-datalog  Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo2-data     Removed                                                                                                                                                                                        0.0s
     ⠿ Volume zookeeper-cluster_zoo2-datalog  Removed                                                                                                                                                                                        0.0s
     ⠿ Network zookeeper-cluster_default      Removed                                                                                                                                                                                        0.1s

# 完