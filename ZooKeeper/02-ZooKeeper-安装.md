# 02-ZooKeeper-安装

## 安装 ZooKeeper

下载稳定版：

    [root@centos zookeeper]# ll
    -rw-r--r-- 1 root root 12649765 5月   7 2022 apache-zookeeper-3.7.1-bin.tar.gz

解压：

    [root@centos zookeeper]# tar -zxf apache-zookeeper-3.7.1-bin.tar.gz
    [root@centos zookeeper]# ll
    drwxr-xr-x 6 root root      133 3月  28 16:31 apache-zookeeper-3.7.1-bin
    -rw-r--r-- 1 root root 12649765 5月   7 2022 apache-zookeeper-3.7.1-bin.tar.gz

进入解压目录：

    [root@centos zookeeper]# cd apache-zookeeper-3.7.1-bin/
    [root@centos apache-zookeeper-3.7.1-bin]# ll
    drwxr-xr-x 2 1000 1000  4096 5月   7 2022 bin
    drwxr-xr-x 2 1000 1000    77 5月   7 2022 conf
    drwxr-xr-x 5 1000 1000  4096 5月   7 2022 docs
    drwxr-xr-x 2 root root  4096 3月  28 16:31 lib
    -rw-r--r-- 1 1000 1000 11358 5月   7 2022 LICENSE.txt
    -rw-r--r-- 1 1000 1000  2084 5月   7 2022 NOTICE.txt
    -rw-r--r-- 1 1000 1000  2214 5月   7 2022 README.md
    -rw-r--r-- 1 1000 1000  3570 5月   7 2022 README_packaging.md

创建数据目录：

    [root@centos apache-zookeeper-3.7.1-bin]# mkdir data
    [root@centos apache-zookeeper-3.7.1-bin]# ll
    drwxr-xr-x 2 1000 1000  4096 5月   7 2022 bin
    drwxr-xr-x 2 1000 1000    77 5月   7 2022 conf
    drwxr-xr-x 2 root root     6 3月  28 16:31 data
    drwxr-xr-x 5 1000 1000  4096 5月   7 2022 docs
    drwxr-xr-x 2 root root  4096 3月  28 16:31 lib
    -rw-r--r-- 1 1000 1000 11358 5月   7 2022 LICENSE.txt
    -rw-r--r-- 1 1000 1000  2084 5月   7 2022 NOTICE.txt
    -rw-r--r-- 1 1000 1000  2214 5月   7 2022 README.md
    -rw-r--r-- 1 1000 1000  3570 5月   7 2022 README_packaging.md

设置配置文件：

    [root@centos apache-zookeeper-3.7.1-bin]# cd conf/
    [root@centos conf]# cp zoo_sample.cfg zoo.cfg
    [root@centos conf]# vim zoo.cfg
    [root@centos conf]# cat zoo.cfg
    # The number of milliseconds of each tick
    tickTime=2000
    # The number of ticks that the initial
    # synchronization phase can take
    initLimit=10
    # The number of ticks that can pass between
    # sending a request and getting an acknowledgement
    syncLimit=5
    # the directory where the snapshot is stored.
    # do not use /tmp for storage, /tmp here is just
    # example sakes.
    # dataDir=/tmp/zookeeper
    # 修改数据目录
    dataDir=/root/zookeeper/apache-zookeeper-3.7.1-bin/data
    # the port at which the clients will connect
    # clientPort=2181
    # 修改端口号
    clientPort=2180
    # the maximum number of client connections.
    # increase this if you need to handle more clients
    #maxClientCnxns=60
    #
    # Be sure to read the maintenance section of the
    # administrator guide before turning on autopurge.
    #
    # http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
    #
    # The number of snapshots to retain in dataDir
    #autopurge.snapRetainCount=3
    # Purge task interval in hours
    # Set to "0" to disable auto purge feature
    #autopurge.purgeInterval=1
    
    ## Metrics Providers
    #
    # https://prometheus.io Metrics Exporter
    #metricsProvider.className=org.apache.zookeeper.metrics.prometheus.PrometheusMetricsProvider
    #metricsProvider.httpPort=7000
    #metricsProvider.exportJvmInfo=true

## 启动 ZooKeeper

启动服务：

    [root@centos bin]# ./zkServer.sh start
    ZooKeeper JMX enabled by default
    Using config: /root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../conf/zoo.cfg
    Starting zookeeper ... STARTED

查看启动日志：

    [root@centos apache-zookeeper-3.7.1-bin]# cd logs/
    [root@centos logs]# cat zookeeper-root-server-centos.out
    2023-03-28 16:40:57,434 [myid:] - INFO  [main:QuorumPeerConfig@174] - Reading configuration from: /root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../conf/zoo.cfg
    2023-03-28 16:40:57,450 [myid:] - INFO  [main:QuorumPeerConfig@444] - clientPortAddress is 0.0.0.0:2180
    2023-03-28 16:40:57,450 [myid:] - INFO  [main:QuorumPeerConfig@448] - secureClientPort is not set
    2023-03-28 16:40:57,450 [myid:] - INFO  [main:QuorumPeerConfig@464] - observerMasterPort is not set
    2023-03-28 16:40:57,450 [myid:] - INFO  [main:QuorumPeerConfig@481] - metricsProvider.className is org.apache.zookeeper.metrics.impl.DefaultMetricsProvider
    2023-03-28 16:40:57,451 [myid:] - INFO  [main:DatadirCleanupManager@78] - autopurge.snapRetainCount set to 3
    2023-03-28 16:40:57,451 [myid:] - INFO  [main:DatadirCleanupManager@79] - autopurge.purgeInterval set to 0
    2023-03-28 16:40:57,451 [myid:] - INFO  [main:DatadirCleanupManager@101] - Purge task is not scheduled.
    2023-03-28 16:40:57,451 [myid:] - WARN  [main:QuorumPeerMain@139] - Either no config or no quorum defined in config, running in standalone mode
    2023-03-28 16:40:57,453 [myid:] - INFO  [main:ManagedUtil@46] - Log4j 1.2 jmx support not found; jmx disabled.
    2023-03-28 16:40:57,453 [myid:] - INFO  [main:QuorumPeerConfig@174] - Reading configuration from: /root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../conf/zoo.cfg
    2023-03-28 16:40:57,453 [myid:] - INFO  [main:QuorumPeerConfig@444] - clientPortAddress is 0.0.0.0:2180
    2023-03-28 16:40:57,453 [myid:] - INFO  [main:QuorumPeerConfig@448] - secureClientPort is not set
    2023-03-28 16:40:57,454 [myid:] - INFO  [main:QuorumPeerConfig@464] - observerMasterPort is not set
    2023-03-28 16:40:57,454 [myid:] - INFO  [main:QuorumPeerConfig@481] - metricsProvider.className is org.apache.zookeeper.metrics.impl.DefaultMetricsProvider
    2023-03-28 16:40:57,454 [myid:] - INFO  [main:ZooKeeperServerMain@123] - Starting server
    2023-03-28 16:40:57,463 [myid:] - INFO  [main:ServerMetrics@62] - ServerMetrics initialized with provider org.apache.zookeeper.metrics.impl.DefaultMetricsProvider@6ad5c04e
    2023-03-28 16:40:57,465 [myid:] - INFO  [main:DigestAuthenticationProvider@47] - ACL digest algorithm is: SHA1
    2023-03-28 16:40:57,465 [myid:] - INFO  [main:DigestAuthenticationProvider@61] - zookeeper.DigestAuthenticationProvider.enabled = true
    2023-03-28 16:40:57,467 [myid:] - INFO  [main:FileTxnSnapLog@124] - zookeeper.snapshot.trust.empty : false
    2023-03-28 16:40:57,475 [myid:] - INFO  [main:ZookeeperBanner@42] -
    2023-03-28 16:40:57,475 [myid:] - INFO  [main:ZookeeperBanner@42] -   ______                  _
    2023-03-28 16:40:57,475 [myid:] - INFO  [main:ZookeeperBanner@42] -  |___  /                 | |
    2023-03-28 16:40:57,475 [myid:] - INFO  [main:ZookeeperBanner@42] -     / /    ___     ___   | | __   ___    ___   _ __     ___   _ __
    2023-03-28 16:40:57,476 [myid:] - INFO  [main:ZookeeperBanner@42] -    / /    / _ \   / _ \  | |/ /  / _ \  / _ \ | '_ \   / _ \ | '__|
    2023-03-28 16:40:57,476 [myid:] - INFO  [main:ZookeeperBanner@42] -   / /__  | (_) | | (_) | |   <  |  __/ |  __/ | |_) | |  __/ | |
    2023-03-28 16:40:57,476 [myid:] - INFO  [main:ZookeeperBanner@42] -  /_____|  \___/   \___/  |_|\_\  \___|  \___| | .__/   \___| |_|
    2023-03-28 16:40:57,476 [myid:] - INFO  [main:ZookeeperBanner@42] -                                               | |
    2023-03-28 16:40:57,476 [myid:] - INFO  [main:ZookeeperBanner@42] -                                               |_|
    2023-03-28 16:40:57,476 [myid:] - INFO  [main:ZookeeperBanner@42] -
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:zookeeper.version=3.7.1-a2fb57c55f8e59cdd76c34b357ad5181df1258d5, built on 2022-05-07 06:45 UTC
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:host.name=centos
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.version=1.8.0_201
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.vendor=Oracle Corporation
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.home=/usr/local/java/jdk1.8.0_201/jre
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.class.path=/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/target/classes:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../build/classes:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/target/lib/*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../build/lib/*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-prometheus-metrics-3.7.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-jute-3.7.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-3.7.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/snappy-java-1.1.7.7.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/slf4j-reload4j-1.7.35.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/slf4j-api-1.7.35.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_servlet-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_hotspot-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_common-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/reload4j-1.2.19.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-native-unix-common-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-native-epoll-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-classes-epoll-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-resolver-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-handler-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-common-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-codec-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-buffer-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/metrics-core-4.1.12.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jline-2.14.6.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-util-ajax-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-util-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-servlet-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-server-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-security-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-io-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-http-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/javax.servlet-api-3.1.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-databind-2.13.2.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-core-2.13.2.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-annotations-2.13.2.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/commons-cli-1.4.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/audience-annotations-0.12.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/src/main/resources/lib/*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../conf:.:/usr/local/java/jdk1.8.0_201/lib:/usr/local/java/jdk1.8.0_201/jre/lib
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.library.path=/usr/java/packages/lib/amd64:/usr/lib64:/lib64:/lib:/usr/lib
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.io.tmpdir=/tmp
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:java.compiler=<NA>
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:os.name=Linux
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:os.arch=amd64
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:os.version=4.18.0-348.7.1.el8_5.x86_64
    2023-03-28 16:40:57,477 [myid:] - INFO  [main:Environment@98] - Server environment:user.name=root
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:Environment@98] - Server environment:user.home=/root
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:Environment@98] - Server environment:user.dir=/root/zookeeper/apache-zookeeper-3.7.1-bin/bin
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:Environment@98] - Server environment:os.memory.free=21MB
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:Environment@98] - Server environment:os.memory.max=966MB
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:Environment@98] - Server environment:os.memory.total=27MB
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@138] - zookeeper.enableEagerACLCheck = false
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@151] - zookeeper.digest.enabled = true
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@155] - zookeeper.closeSessionTxn.enabled = true
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@1505] - zookeeper.flushDelay=0
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@1514] - zookeeper.maxWriteQueuePollTime=0
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@1523] - zookeeper.maxBatchSize=1000
    2023-03-28 16:40:57,478 [myid:] - INFO  [main:ZooKeeperServer@260] - zookeeper.intBufferStartingSizeBytes = 1024
    2023-03-28 16:40:57,479 [myid:] - INFO  [main:BlueThrottle@141] - Weighed connection throttling is disabled
    2023-03-28 16:40:57,480 [myid:] - INFO  [main:ZooKeeperServer@1306] - minSessionTimeout set to 4000
    2023-03-28 16:40:57,480 [myid:] - INFO  [main:ZooKeeperServer@1315] - maxSessionTimeout set to 40000
    2023-03-28 16:40:57,481 [myid:] - INFO  [main:ResponseCache@45] - getData response cache size is initialized with value 400.
    2023-03-28 16:40:57,481 [myid:] - INFO  [main:ResponseCache@45] - getChildren response cache size is initialized with value 400.
    2023-03-28 16:40:57,482 [myid:] - INFO  [main:RequestPathMetricsCollector@109] - zookeeper.pathStats.slotCapacity = 60
    2023-03-28 16:40:57,482 [myid:] - INFO  [main:RequestPathMetricsCollector@110] - zookeeper.pathStats.slotDuration = 15
    2023-03-28 16:40:57,482 [myid:] - INFO  [main:RequestPathMetricsCollector@111] - zookeeper.pathStats.maxDepth = 6
    2023-03-28 16:40:57,482 [myid:] - INFO  [main:RequestPathMetricsCollector@112] - zookeeper.pathStats.initialDelay = 5
    2023-03-28 16:40:57,482 [myid:] - INFO  [main:RequestPathMetricsCollector@113] - zookeeper.pathStats.delay = 5
    2023-03-28 16:40:57,482 [myid:] - INFO  [main:RequestPathMetricsCollector@114] - zookeeper.pathStats.enabled = false
    2023-03-28 16:40:57,484 [myid:] - INFO  [main:ZooKeeperServer@1542] - The max bytes for all large requests are set to 104857600
    2023-03-28 16:40:57,484 [myid:] - INFO  [main:ZooKeeperServer@1556] - The large request threshold is set to -1
    2023-03-28 16:40:57,485 [myid:] - INFO  [main:AuthenticationHelper@66] - zookeeper.enforce.auth.enabled = false
    2023-03-28 16:40:57,485 [myid:] - INFO  [main:AuthenticationHelper@67] - zookeeper.enforce.auth.schemes = []
    2023-03-28 16:40:57,485 [myid:] - INFO  [main:ZooKeeperServer@361] - Created server with tickTime 2000 minSessionTimeout 4000 maxSessionTimeout 40000 clientPortListenBacklog -1 datadir /root/zookeeper/apache-zookeeper-3.7.1-bin/data/version-2 snapdir /root/zookeeper/apache-zookeeper-3.7.1-bin/data/version-2
    2023-03-28 16:40:57,509 [myid:] - INFO  [main:Log@170] - Logging initialized @371ms to org.eclipse.jetty.util.log.Slf4jLog
    2023-03-28 16:40:57,612 [myid:] - WARN  [main:ContextHandler@1656] - o.e.j.s.ServletContextHandler@131276c2{/,null,STOPPED} contextPath ends with /*
    2023-03-28 16:40:57,612 [myid:] - WARN  [main:ContextHandler@1667] - Empty contextPath
    2023-03-28 16:40:57,627 [myid:] - INFO  [main:Server@375] - jetty-9.4.43.v20210629; built: 2021-06-30T11:07:22.254Z; git: 526006ecfa3af7f1a27ef3a288e2bef7ea9dd7e8; jvm 1.8.0_201-b09
    2023-03-28 16:40:57,664 [myid:] - INFO  [main:DefaultSessionIdManager@334] - DefaultSessionIdManager workerName=node0
    2023-03-28 16:40:57,664 [myid:] - INFO  [main:DefaultSessionIdManager@339] - No SessionScavenger set, using defaults
    2023-03-28 16:40:57,666 [myid:] - INFO  [main:HouseKeeper@132] - node0 Scavenging every 660000ms
    2023-03-28 16:40:57,669 [myid:] - WARN  [main:ConstraintSecurityHandler@759] - ServletContext@o.e.j.s.ServletContextHandler@131276c2{/,null,STARTING} has uncovered http methods for path: /*
    2023-03-28 16:40:57,683 [myid:] - INFO  [main:ContextHandler@915] - Started o.e.j.s.ServletContextHandler@131276c2{/,null,AVAILABLE}
    2023-03-28 16:40:57,698 [myid:] - INFO  [main:AbstractConnector@331] - Started ServerConnector@5649fd9b{HTTP/1.1, (http/1.1)}{0.0.0.0:8080}
    2023-03-28 16:40:57,698 [myid:] - INFO  [main:Server@415] - Started @559ms
    2023-03-28 16:40:57,698 [myid:] - INFO  [main:JettyAdminServer@190] - Started AdminServer on address 0.0.0.0, port 8080 and command URL /commands
    2023-03-28 16:40:57,702 [myid:] - INFO  [main:ServerCnxnFactory@169] - Using org.apache.zookeeper.server.NIOServerCnxnFactory as server connection factory
    2023-03-28 16:40:57,703 [myid:] - WARN  [main:ServerCnxnFactory@309] - maxCnxns is not configured, using default value 0.
    2023-03-28 16:40:57,704 [myid:] - INFO  [main:NIOServerCnxnFactory@652] - Configuring NIO connection handler with 10s sessionless connection timeout, 1 selector thread(s), 4 worker threads, and 64 kB direct buffers.
    2023-03-28 16:40:57,705 [myid:] - INFO  [main:NIOServerCnxnFactory@660] - binding to port 0.0.0.0/0.0.0.0:2180
    2023-03-28 16:40:57,717 [myid:] - INFO  [main:WatchManagerFactory@42] - Using org.apache.zookeeper.server.watch.WatchManager as watch manager
    2023-03-28 16:40:57,717 [myid:] - INFO  [main:WatchManagerFactory@42] - Using org.apache.zookeeper.server.watch.WatchManager as watch manager
    2023-03-28 16:40:57,717 [myid:] - INFO  [main:ZKDatabase@133] - zookeeper.snapshotSizeFactor = 0.33
    2023-03-28 16:40:57,717 [myid:] - INFO  [main:ZKDatabase@153] - zookeeper.commitLogCount=500
    2023-03-28 16:40:57,722 [myid:] - INFO  [main:SnapStream@61] - zookeeper.snapshot.compression.method = CHECKED
    2023-03-28 16:40:57,726 [myid:] - INFO  [main:FileTxnSnapLog@479] - Snapshotting: 0x0 to /root/zookeeper/apache-zookeeper-3.7.1-bin/data/version-2/snapshot.0
    2023-03-28 16:40:57,729 [myid:] - INFO  [main:ZKDatabase@290] - Snapshot loaded in 11 ms, highest zxid is 0x0, digest is 1371985504
    2023-03-28 16:40:57,730 [myid:] - INFO  [main:FileTxnSnapLog@479] - Snapshotting: 0x0 to /root/zookeeper/apache-zookeeper-3.7.1-bin/data/version-2/snapshot.0
    2023-03-28 16:40:57,731 [myid:] - INFO  [main:ZooKeeperServer@543] - Snapshot taken in 1 ms
    2023-03-28 16:40:57,739 [myid:] - INFO  [ProcessThread(sid:0 cport:2180)::PrepRequestProcessor@137] - PrepRequestProcessor (sid:0) started, reconfigEnabled=false
    2023-03-28 16:40:57,739 [myid:] - INFO  [main:RequestThrottler@75] - zookeeper.request_throttler.shutdownTimeout = 10000
    2023-03-28 16:40:57,752 [myid:] - INFO  [main:ContainerManager@84] - Using checkIntervalMs=60000 maxPerMinute=10000 maxNeverUsedIntervalMs=0
    2023-03-28 16:40:57,753 [myid:] - INFO  [main:ZKAuditProvider@42] - ZooKeeper audit is disabled.

## 连接 ZooKeeper

启动客户端连接服务：

    [root@centos bin]# ./zkCli.sh -server localhost:2180
    Connecting to localhost:2180
    2023-03-28 16:42:52,289 [myid:] - INFO  [main:Environment@98] - Client environment:zookeeper.version=3.7.1-a2fb57c55f8e59cdd76c34b357ad5181df1258d5, built on 2022-05-07 06:45 UTC
    2023-03-28 16:42:52,291 [myid:] - INFO  [main:Environment@98] - Client environment:host.name=centos
    2023-03-28 16:42:52,291 [myid:] - INFO  [main:Environment@98] - Client environment:java.version=1.8.0_201
    2023-03-28 16:42:52,291 [myid:] - INFO  [main:Environment@98] - Client environment:java.vendor=Oracle Corporation
    2023-03-28 16:42:52,291 [myid:] - INFO  [main:Environment@98] - Client environment:java.home=/usr/local/java/jdk1.8.0_201/jre
    2023-03-28 16:42:52,291 [myid:] - INFO  [main:Environment@98] - Client environment:java.class.path=/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/target/classes:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../build/classes:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/target/lib/*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../build/lib/*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-prometheus-metrics-3.7.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-jute-3.7.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/zookeeper-3.7.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/snappy-java-1.1.7.7.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/slf4j-reload4j-1.7.35.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/slf4j-api-1.7.35.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_servlet-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_hotspot-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient_common-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/simpleclient-0.9.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/reload4j-1.2.19.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-native-unix-common-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-native-epoll-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-classes-epoll-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-transport-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-resolver-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-handler-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-common-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-codec-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/netty-buffer-4.1.76.Final.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/metrics-core-4.1.12.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jline-2.14.6.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-util-ajax-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-util-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-servlet-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-server-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-security-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-io-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jetty-http-9.4.43.v20210629.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/javax.servlet-api-3.1.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-databind-2.13.2.1.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-core-2.13.2.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/jackson-annotations-2.13.2.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/commons-cli-1.4.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../lib/audience-annotations-0.12.0.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../zookeeper-server/src/main/resources/lib/*.jar:/root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../conf:.:/usr/local/java/jdk1.8.0_201/lib:/usr/local/java/jdk1.8.0_201/jre/lib
    2023-03-28 16:42:52,291 [myid:] - INFO  [main:Environment@98] - Client environment:java.library.path=/usr/java/packages/lib/amd64:/usr/lib64:/lib64:/lib:/usr/lib
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:java.io.tmpdir=/tmp
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:java.compiler=<NA>
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:os.name=Linux
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:os.arch=amd64
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:os.version=4.18.0-348.7.1.el8_5.x86_64
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:user.name=root
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:user.home=/root
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:user.dir=/root/zookeeper/apache-zookeeper-3.7.1-bin/bin
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:os.memory.free=19MB
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:os.memory.max=247MB
    2023-03-28 16:42:52,292 [myid:] - INFO  [main:Environment@98] - Client environment:os.memory.total=27MB
    2023-03-28 16:42:52,299 [myid:] - INFO  [main:ZooKeeper@657] - Initiating client connection, connectString=localhost:2180 sessionTimeout=30000 watcher=org.apache.zookeeper.ZooKeeperMain$MyWatcher@4fccd51b
    2023-03-28 16:42:52,303 [myid:] - INFO  [main:X509Util@77] - Setting -D jdk.tls.rejectClientInitiatedRenegotiation=true to disable client-initiated TLS renegotiation
    2023-03-28 16:42:52,307 [myid:] - INFO  [main:ClientCnxnSocket@239] - jute.maxbuffer value is 1048575 Bytes
    2023-03-28 16:42:52,315 [myid:] - INFO  [main:ClientCnxn@1735] - zookeeper.request.timeout value is 0. feature enabled=false
    Welcome to ZooKeeper!
    2023-03-28 16:42:52,319 [myid:localhost:2180] - INFO  [main-SendThread(localhost:2180):ClientCnxn$SendThread@1171] - Opening socket connection to server localhost/127.0.0.1:2180.
    2023-03-28 16:42:52,319 [myid:localhost:2180] - INFO  [main-SendThread(localhost:2180):ClientCnxn$SendThread@1173] - SASL config status: Will not attempt to authenticate using SASL (unknown error)
    2023-03-28 16:42:52,324 [myid:localhost:2180] - INFO  [main-SendThread(localhost:2180):ClientCnxn$SendThread@1005] - Socket connection established, initiating session, client: /127.0.0.1:45334, server: localhost/127.0.0.1:2180
    JLine support is enabled
    2023-03-28 16:42:52,361 [myid:localhost:2180] - INFO  [main-SendThread(localhost:2180):ClientCnxn$SendThread@1446] - Session establishment complete on server localhost/127.0.0.1:2180, session id = 0x100051783450000, negotiated timeout = 30000
    
    WATCHER::
    
    WatchedEvent state:SyncConnected type:None path:null

查看目录：

    [zk: localhost:2180(CONNECTED) 1] ls -R /
    /
    /zookeeper
    /zookeeper/config
    /zookeeper/quota
    [zk: localhost:2180(CONNECTED) 2] ls /
    [zookeeper]

创建目录：

    [zk: localhost:2180(CONNECTED) 3] create /app
    Created /app
    [zk: localhost:2180(CONNECTED) 4] ls -R /
    /
    /app
    /zookeeper
    /zookeeper/config
    /zookeeper/quota

创建目录和数据：

    [zk: localhost:2180(CONNECTED) 5] create /app/data 123
    Created /app/data
    [zk: localhost:2180(CONNECTED) 6] ls -R /
    /
    /app
    /zookeeper
    /app/data
    /zookeeper/config
    /zookeeper/quota


获取目录：

    [zk: localhost:2180(CONNECTED) 8] get /app
    null
    [zk: localhost:2180(CONNECTED) 9] get /app/data
    123

退出客户端：

    [zk: localhost:2180(CONNECTED) 11] quit
    
    WATCHER::
    
    WatchedEvent state:Closed type:None path:null
    2023-03-28 16:54:33,545 [myid:] - INFO  [main:ZooKeeper@1288] - Session: 0x100051783450000 closed
    2023-03-28 16:54:33,545 [myid:] - INFO  [main-EventThread:ClientCnxn$EventThread@568] - EventThread shut down for session: 0x100051783450000
    2023-03-28 16:54:33,547 [myid:] - INFO  [main:ServiceUtils@45] - Exiting JVM with code 0

## 停止 ZooKeeper

停止服务：

    [root@centos bin]# ./zkServer.sh stop
    ZooKeeper JMX enabled by default
    Using config: /root/zookeeper/apache-zookeeper-3.7.1-bin/bin/../conf/zoo.cfg
    Stopping zookeeper ... STOPPED

# 完