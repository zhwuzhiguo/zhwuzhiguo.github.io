# 06-Docker-Dockerfile

`Dockerfile` 是由一系列命令和参数构成的脚本，这些命令应用于基础镜像并最终创建一个新的镜像。

`Dockerfile` 构建步骤：
- 编写 `Dockerfile`
- `docker build`
- `docker run`

## Dockerfile 基础知识

- 指令都必须为大写字母且后面要跟随至少一个参数
- 指令按照从上到下顺序执行
- 每条指令都会创建一个新的镜像层，并对镜像进行提交
- #表示注释

## Dockerfile 执行流程

- `docker` 从基础镜像运行一个容器
- 执行一条指令并对容器作出修改
- 执行类似 `docker commit` 的操作提交一个新的镜像层
- 基于刚提交的镜像运行一个新容器
- 继续执行下一条指令直到所有指令都执行完成

## Dockerfile 常用命令

- `FROM` - 指明构建的新镜像是来自于哪个基础镜像

      FROM image:tag

- `LABEL` - 指定镜像作者和联系方式等

      LABEL key=value key=value ...

- `WORKDIR` - 设置工作目录

      WORKDIR /path/to/workdir

- `ADD` - 拷贝文件或目录到镜像中，如果是URL或压缩包会自动下载或自动解压

      ADD src-file dest-file

- `COPY` - 用法同 ADD 但不支持自动下载和解压

      COPY src-file dest-file

- `RUN` - 构建镜像时运行的 Shell 命令

      RUN command

- `ENV` - 设置环境内环境变量

      ENV key=value ...

- `EXPOSE` - 声明容器运行的服务端口

      EXPOSE port ...

- `CMD` - 启动容器时执行的Shell命令

      CMD command param1 param2

## Dockerfile 创建镜像

### 创建 centos 中文镜像

基于 `centos` 创建支持中文和中国时区的的镜像：

- 编写 `Dockerfile`

      # Dockerfile
      FROM centos:centos7.9.2009
      
      LABEL title="centos7.9.2009.zh"
      LABEL author="wuzhiguo"
      LABEL email="wuzhiguo@163.com"
      
      # 设置编码
      ENV LANG=en_US.utf8
      
      # 设置时区
      ENV TZ=Asia/Shanghai
      RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime
      RUN echo ${TZ} > /etc/timezone

- 构建镜像

      [root@centos centos7.9.2009.zh]# docker build -t centos:centos7.9.2009.zh .
      [+] Building 0.8s (7/7) FINISHED
       => [internal] load build definition from Dockerfile                                                                                                                                                                                     0.0s
       => => transferring dockerfile: 324B                                                                                                                                                                                                     0.0s
       => [internal] load .dockerignore                                                                                                                                                                                                        0.0s
       => => transferring context: 2B                                                                                                                                                                                                          0.0s
       => [internal] load metadata for docker.io/library/centos:centos7.9.2009                                                                                                                                                                 0.0s
       => [1/3] FROM docker.io/library/centos:centos7.9.2009                                                                                                                                                                                   0.0s
       => [2/3] RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime                                                                                                                                                                    0.3s
       => [3/3] RUN echo Asia/Shanghai > /etc/timezone                                                                                                                                                                                         0.3s
       => exporting to image                                                                                                                                                                                                                   0.1s
       => => exporting layers                                                                                                                                                                                                                  0.1s
       => => writing image sha256:2da052a37ba1dcfaec1f6108d0560a3a469ffd1ff5ea6d0d0bb4fcaa7f84d02d                                                                                                                                             0.0s
       => => naming to docker.io/library/centos:centos7.9.2009.zh                                                                                                                                                                              0.0s
      
      [root@centos centos7.9.2009.zh]# docker images
      REPOSITORY   TAG                 IMAGE ID       CREATED          SIZE
      centos       centos7.9.2009.zh   2da052a37ba1   17 seconds ago   204MB
      centos       centos7.9.2009      eeb6ee3f44bd   17 months ago    204MB

- 运行镜像

      [root@centos centos7.9.2009.zh]# docker run -di --name=centos-zh centos:centos7.9.2009.zh
      14e9d2cc3400a1b465970640c40d2c25f98b535ffd4ad0a7550b5ea9d02af35f
      
      [root@centos centos7.9.2009.zh]# docker ps
      CONTAINER ID   IMAGE                      COMMAND       CREATED         STATUS         PORTS     NAMES
      14e9d2cc3400   centos:centos7.9.2009.zh   "/bin/bash"   5 seconds ago   Up 4 seconds             centos-zh
      9feed4d0b8aa   centos:centos7.9.2009      "/bin/bash"   2 hours ago     Up 2 hours               centos-init
      
      [root@centos centos7.9.2009.zh]# docker exec -it centos-zh /bin/bash
      [root@14e9d2cc3400 /]# date
      Sat Mar  4 22:06:23 CST 2023
      
      [root@14e9d2cc3400 /]# locale
      LANG=en_US.utf8
      LC_CTYPE="en_US.utf8"
      LC_NUMERIC="en_US.utf8"
      LC_TIME="en_US.utf8"
      LC_COLLATE="en_US.utf8"
      LC_MONETARY="en_US.utf8"
      LC_MESSAGES="en_US.utf8"
      LC_PAPER="en_US.utf8"
      LC_NAME="en_US.utf8"
      LC_ADDRESS="en_US.utf8"
      LC_TELEPHONE="en_US.utf8"
      LC_MEASUREMENT="en_US.utf8"
      LC_IDENTIFICATION="en_US.utf8"
      LC_ALL=

### 创建 jdk8 环境镜像

基于 `centos` 中文镜像创建 `jdk8` 环境镜像：

- 编写 `Dockerfile`

      [root@centos centos7.9.2009.zh.jdk8]# ll
      总用量 187328
      -rw-r--r-- 1 root root       331 2月  23 15:55 Dockerfile
      -rw-r--r-- 1 root root 191817140 2月  23 15:53 jdk-8u201-linux-x64.tar.gz

      # Dockerfile
      FROM centos:centos7.9.2009.zh
      
      LABEL title="centos7.9.2009.zh.jdk8"
      LABEL author="wuzhiguo"
      LABEL email="wuzhiguo@163.com"

      # JDK包
      RUN mkdir /usr/local/java
      ADD jdk-8u201-linux-x64.tar.gz /usr/local/java
      
      # JAVA环境变量
      ENV JAVA_HOME=/usr/local/java/jdk1.8.0_201
      ENV JRE_HOME=$JAVA_HOME/jre
      ENV CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
      ENV PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin

- 构建镜像

      [root@centos centos7.9.2009.zh.jdk8]# docker build -t centos:centos7.9.2009.zh.jdk8 .
      [+] Building 12.5s (8/8) FINISHED
       => [internal] load .dockerignore                                                                                                                                                                                                        0.0s
       => => transferring context: 2B                                                                                                                                                                                                          0.0s
       => [internal] load build definition from Dockerfile                                                                                                                                                                                     0.0s
       => => transferring dockerfile: 439B                                                                                                                                                                                                     0.0s
       => [internal] load metadata for docker.io/library/centos:centos7.9.2009.zh                                                                                                                                                              0.0s
       => [1/3] FROM docker.io/library/centos:centos7.9.2009.zh                                                                                                                                                                                0.1s
       => [internal] load build context                                                                                                                                                                                                        3.6s
       => => transferring context: 191.85MB                                                                                                                                                                                                    3.2s
       => [2/3] RUN mkdir /usr/local/java                                                                                                                                                                                                      3.7s
       => [3/3] ADD jdk-8u201-linux-x64.tar.gz /usr/local/java                                                                                                                                                                                 5.7s
       => exporting to image                                                                                                                                                                                                                   2.7s
       => => exporting layers                                                                                                                                                                                                                  2.7s
       => => writing image sha256:1d8f07606c31855f263f7554673980a872a2b097433972bf8663759db3aaa50e                                                                                                                                             0.0s
       => => naming to docker.io/library/centos:centos7.9.2009.zh.jdk8                                                                                                                                                                         0.0s
      
      [root@centos centos7.9.2009.zh.jdk8]# docker images
      REPOSITORY   TAG                      IMAGE ID       CREATED          SIZE
      centos       centos7.9.2009.zh.jdk8   1d8f07606c31   18 seconds ago   601MB
      centos       centos7.9.2009.zh        2da052a37ba1   14 hours ago     204MB
      centos       centos7.9.2009           eeb6ee3f44bd   17 months ago    204MB

- 运行镜像

      [root@centos centos7.9.2009.zh.jdk8]# docker run -di --name=centos-zh-jdk8 centos:centos7.9.2009.zh.jdk8
      0366238d416a90d33cb75ad4940705579d481ba393ecfc01be3e389483174e62
      
      [root@centos centos7.9.2009.zh.jdk8]# docker ps
      CONTAINER ID   IMAGE                           COMMAND       CREATED         STATUS         PORTS     NAMES
      0366238d416a   centos:centos7.9.2009.zh.jdk8   "/bin/bash"   8 seconds ago   Up 7 seconds             centos-zh-jdk8
      14e9d2cc3400   centos:centos7.9.2009.zh        "/bin/bash"   14 hours ago    Up 14 hours              centos-zh
      9feed4d0b8aa   centos:centos7.9.2009           "/bin/bash"   16 hours ago    Up 16 hours              centos-init
      
      [root@centos centos7.9.2009.zh.jdk8]# docker exec -it centos-zh-jdk8 /bin/bash
      [root@0366238d416a /]# date
      Sun Mar  5 12:23:51 CST 2023
      
      [root@0366238d416a /]# locale
      LANG=en_US.utf8
      LC_CTYPE="en_US.utf8"
      LC_NUMERIC="en_US.utf8"
      LC_TIME="en_US.utf8"
      LC_COLLATE="en_US.utf8"
      LC_MONETARY="en_US.utf8"
      LC_MESSAGES="en_US.utf8"
      LC_PAPER="en_US.utf8"
      LC_NAME="en_US.utf8"
      LC_ADDRESS="en_US.utf8"
      LC_TELEPHONE="en_US.utf8"
      LC_MEASUREMENT="en_US.utf8"
      LC_IDENTIFICATION="en_US.utf8"
      LC_ALL=
      [root@0366238d416a /]# java -version
      java version "1.8.0_201"
      Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
      Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)

### 创建 mysql 中文镜像

基于 `mysql` 创建支持中文和中国时区的的镜像：

- 编写 `Dockerfile`

      # Dockerfile
      FROM mysql:5.7
      
      LABEL title="5.7.zh"
      LABEL author="wuzhiguo"
      LABEL email="wuzhiguo@163.com"
      
      # 设置编码
      ENV LANG=en_US.utf8
      
      # 设置时区
      ENV TZ=Asia/Shanghai
      RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime
      RUN echo ${TZ} > /etc/timezone

- 构建镜像

      [root@centos mysql5.7.zh]# docker build -t mysql:5.7.zh .
      [+] Building 0.0s (7/7) FINISHED
       => [internal] load build definition from Dockerfile                                                                                                                                                                                     0.0s
       => => transferring dockerfile: 301B                                                                                                                                                                                                     0.0s
       => [internal] load .dockerignore                                                                                                                                                                                                        0.0s
       => => transferring context: 2B                                                                                                                                                                                                          0.0s
       => [internal] load metadata for docker.io/library/mysql:5.7                                                                                                                                                                             0.0s
       => [1/3] FROM docker.io/library/mysql:5.7                                                                                                                                                                                               0.0s
       => CACHED [2/3] RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime                                                                                                                                                             0.0s
       => CACHED [3/3] RUN echo Asia/Shanghai > /etc/timezone                                                                                                                                                                                  0.0s
       => exporting to image                                                                                                                                                                                                                   0.0s
       => => exporting layers                                                                                                                                                                                                                  0.0s
       => => writing image sha256:cb521e4e85b4a04c9674dd4b5fc850e3e236ebe5efe06c32650b8ab75a73624d                                                                                                                                             0.0s
       => => naming to docker.io/library/mysql:5.7.zh                                                                                                                                                                                          0.0s
      
      [root@centos mysql5.7.zh]# docker images
      REPOSITORY   TAG                      IMAGE ID       CREATED         SIZE
      mysql        5.7.zh                   cb521e4e85b4   5 minutes ago   455MB
      centos       centos7.9.2009.zh.jdk8   1d8f07606c31   23 hours ago    601MB
      centos       centos7.9.2009.zh        2da052a37ba1   37 hours ago    204MB
      mysql        5.7                      be16cf2d832a   4 weeks ago     455MB
      centos       centos7.9.2009           eeb6ee3f44bd   17 months ago   204MB

- 运行镜像

      [root@centos mysql5.7.zh]# docker run -d -p 33060:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql-57-zh mysql:5.7.zh
      16ef902b88cf4ccc952cad5743120178d5f1d6dbb67170afa695adcb1d68f292
      
      [root@centos mysql5.7.zh]# docker ps
      CONTAINER ID   IMAGE          COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
      16ef902b88cf   mysql:5.7.zh   "docker-entrypoint.s…"   8 seconds ago   Up 8 seconds   33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   mysql-57-zh
      
      [root@centos mysql5.7.zh]# docker exec -it mysql-57-zh /bin/bash
      bash-4.2# date
      Mon Mar  6 11:12:56 CST 2023
      
      bash-4.2# locale
      LANG=en_US.utf8
      LC_CTYPE="en_US.utf8"
      LC_NUMERIC="en_US.utf8"
      LC_TIME="en_US.utf8"
      LC_COLLATE="en_US.utf8"
      LC_MONETARY="en_US.utf8"
      LC_MESSAGES="en_US.utf8"
      LC_PAPER="en_US.utf8"
      LC_NAME="en_US.utf8"
      LC_ADDRESS="en_US.utf8"
      LC_TELEPHONE="en_US.utf8"
      LC_MEASUREMENT="en_US.utf8"
      LC_IDENTIFICATION="en_US.utf8"
      LC_ALL=
      
      bash-4.2# mysql -p
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
      
      mysql> CREATE DATABASE sample CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci';
      Query OK, 1 row affected (0.00 sec)
      
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
      
      mysql> use sample;
      Database changed
      
      mysql> CREATE TABLE user (
          ->   id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
          ->   username varchar(32) NOT NULL COMMENT '用户名',
          ->   password varchar(32) NOT NULL COMMENT '用户密码',
          ->   nickname varchar(32) NOT NULL COMMENT '用户昵称',
          ->   telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
          ->   status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
          ->   create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          ->   update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          ->   PRIMARY KEY (id) USING BTREE,
          ->   UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引',
          ->   UNIQUE KEY uk_telephone (telephone) USING BTREE COMMENT '用户手机唯一索引'
          -> ) ENGINE=InnoDB COMMENT='用户';
      Query OK, 0 rows affected (0.01 sec)
      
      mysql> show tables;
      +------------------+
      | Tables_in_sample |
      +------------------+
      | user             |
      +------------------+
      1 row in set (0.00 sec)
      
      mysql> INSERT INTO user(username, password, nickname, telephone, status) VALUES ('admin', 'e10adc3949ba59abbe56e057f20f883e', '管理员', 13512345678, 0);
      Query OK, 1 row affected (0.01 sec)
      
      mysql> select * from user;
      +----+----------+----------------------------------+-----------+-------------+--------+---------------------+---------------------+
      | id | username | password                         | nickname  | telephone   | status | create_time         | update_time         |
      +----+----------+----------------------------------+-----------+-------------+--------+---------------------+---------------------+
      |  1 | admin    | e10adc3949ba59abbe56e057f20f883e | 管理员    | 13512345678 |      0 | 2023-03-06 11:17:34 | 2023-03-06 11:17:34 |
      +----+----------+----------------------------------+-----------+-------------+--------+---------------------+---------------------+
      1 row in set (0.00 sec)
      
      mysql> exit;
      Bye
      bash-4.2# exit;
      exit
      
      // 查看容器日志
      [root@centos mysql5.7.zh]# docker logs mysql-57-zh
      2023-03-06 11:12:12+08:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.41-1.el7 started.
      2023-03-06 11:12:12+08:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
      2023-03-06 11:12:12+08:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.41-1.el7 started.
      2023-03-06 11:12:12+08:00 [Note] [Entrypoint]: Initializing database files
      // MySql自身的日志时间还是UTC时间
      2023-03-06T03:12:12.950646Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
      2023-03-06T03:12:13.980495Z 0 [Warning] InnoDB: New log files created, LSN=45790
      2023-03-06T03:12:14.158736Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
      2023-03-06T03:12:14.219304Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: b163f12a-bbcc-11ed-8e96-0242ac120002.
      2023-03-06T03:12:14.220417Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
      2023-03-06T03:12:14.586392Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
      2023-03-06T03:12:14.586410Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
      2023-03-06T03:12:14.586829Z 0 [Warning] CA certificate ca.pem is self signed.
      2023-03-06T03:12:14.627722Z 1 [Warning] root@localhost is created with an empty password ! Please consider switching off the --initialize-insecure option.
      2023-03-06 11:12:17+08:00 [Note] [Entrypoint]: Database files initialized
      2023-03-06 11:12:17+08:00 [Note] [Entrypoint]: Starting temporary server
      2023-03-06 11:12:17+08:00 [Note] [Entrypoint]: Waiting for server startup
      2023-03-06T03:12:17.355213Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
      2023-03-06T03:12:17.356455Z 0 [Note] mysqld (mysqld 5.7.41) starting as process 124 ...
      2023-03-06T03:12:17.359736Z 0 [Note] InnoDB: PUNCH HOLE support available
      2023-03-06T03:12:17.359764Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
      2023-03-06T03:12:17.359769Z 0 [Note] InnoDB: Uses event mutexes
      2023-03-06T03:12:17.359775Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
      2023-03-06T03:12:17.359780Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.12
      2023-03-06T03:12:17.359783Z 0 [Note] InnoDB: Using Linux native AIO
      2023-03-06T03:12:17.360024Z 0 [Note] InnoDB: Number of pools: 1
      2023-03-06T03:12:17.360130Z 0 [Note] InnoDB: Using CPU crc32 instructions
      2023-03-06T03:12:17.361860Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
      2023-03-06T03:12:17.369639Z 0 [Note] InnoDB: Completed initialization of buffer pool
      2023-03-06T03:12:17.371957Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
      2023-03-06T03:12:17.383803Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
      2023-03-06T03:12:17.391346Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
      2023-03-06T03:12:17.391409Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
      2023-03-06T03:12:17.450909Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
      2023-03-06T03:12:17.451745Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
      2023-03-06T03:12:17.451761Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
      2023-03-06T03:12:17.452121Z 0 [Note] InnoDB: Waiting for purge to start
      2023-03-06T03:12:17.502305Z 0 [Note] InnoDB: 5.7.41 started; log sequence number 2762314
      2023-03-06T03:12:17.502717Z 0 [Note] Plugin 'FEDERATED' is disabled.
      2023-03-06T03:12:17.503247Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
      2023-03-06T03:12:17.504755Z 0 [Note] InnoDB: Buffer pool(s) load completed at 230306 11:12:17
      2023-03-06T03:12:17.515195Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
      2023-03-06T03:12:17.515215Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
      2023-03-06T03:12:17.515219Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
      2023-03-06T03:12:17.515222Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
      2023-03-06T03:12:17.515782Z 0 [Warning] CA certificate ca.pem is self signed.
      2023-03-06T03:12:17.515822Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
      2023-03-06T03:12:17.517137Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
      2023-03-06T03:12:17.525008Z 0 [Note] Event Scheduler: Loaded 0 events
      2023-03-06T03:12:17.525163Z 0 [Note] mysqld: ready for connections.
      Version: '5.7.41'  socket: '/var/run/mysqld/mysqld.sock'  port: 0  MySQL Community Server (GPL)
      2023-03-06 11:12:18+08:00 [Note] [Entrypoint]: Temporary server started.
      ‘/var/lib/mysql/mysql.sock’ -> ‘/var/run/mysqld/mysqld.sock’
      2023-03-06T03:12:18.269716Z 3 [Note] InnoDB: Stopping purge
      2023-03-06T03:12:18.273781Z 3 [Note] InnoDB: Resuming purge
      2023-03-06T03:12:18.275758Z 3 [Note] InnoDB: Stopping purge
      2023-03-06T03:12:18.278123Z 3 [Note] InnoDB: Resuming purge
      2023-03-06T03:12:18.279456Z 3 [Note] InnoDB: Stopping purge
      2023-03-06T03:12:18.281829Z 3 [Note] InnoDB: Resuming purge
      2023-03-06T03:12:18.283230Z 3 [Note] InnoDB: Stopping purge
      2023-03-06T03:12:18.285533Z 3 [Note] InnoDB: Resuming purge
      Warning: Unable to load '/usr/share/zoneinfo/iso3166.tab' as time zone. Skipping it.
      Warning: Unable to load '/usr/share/zoneinfo/leapseconds' as time zone. Skipping it.
      Warning: Unable to load '/usr/share/zoneinfo/tzdata.zi' as time zone. Skipping it.
      Warning: Unable to load '/usr/share/zoneinfo/zone.tab' as time zone. Skipping it.
      Warning: Unable to load '/usr/share/zoneinfo/zone1970.tab' as time zone. Skipping it.
      
      2023-03-06 11:12:20+08:00 [Note] [Entrypoint]: Stopping temporary server
      2023-03-06T03:12:20.261520Z 0 [Note] Giving 0 client threads a chance to die gracefully
      2023-03-06T03:12:20.261546Z 0 [Note] Shutting down slave threads
      2023-03-06T03:12:20.261549Z 0 [Note] Forcefully disconnecting 0 remaining clients
      2023-03-06T03:12:20.261555Z 0 [Note] Event Scheduler: Purging the queue. 0 events
      2023-03-06T03:12:20.261625Z 0 [Note] Binlog end
      2023-03-06T03:12:20.262142Z 0 [Note] Shutting down plugin 'ngram'
      2023-03-06T03:12:20.262156Z 0 [Note] Shutting down plugin 'partition'
      2023-03-06T03:12:20.262160Z 0 [Note] Shutting down plugin 'BLACKHOLE'
      2023-03-06T03:12:20.262164Z 0 [Note] Shutting down plugin 'ARCHIVE'
      2023-03-06T03:12:20.262167Z 0 [Note] Shutting down plugin 'PERFORMANCE_SCHEMA'
      2023-03-06T03:12:20.262202Z 0 [Note] Shutting down plugin 'MRG_MYISAM'
      2023-03-06T03:12:20.262206Z 0 [Note] Shutting down plugin 'MyISAM'
      2023-03-06T03:12:20.262212Z 0 [Note] Shutting down plugin 'INNODB_SYS_VIRTUAL'
      2023-03-06T03:12:20.262214Z 0 [Note] Shutting down plugin 'INNODB_SYS_DATAFILES'
      2023-03-06T03:12:20.262216Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLESPACES'
      2023-03-06T03:12:20.262218Z 0 [Note] Shutting down plugin 'INNODB_SYS_FOREIGN_COLS'
      2023-03-06T03:12:20.262220Z 0 [Note] Shutting down plugin 'INNODB_SYS_FOREIGN'
      2023-03-06T03:12:20.262222Z 0 [Note] Shutting down plugin 'INNODB_SYS_FIELDS'
      2023-03-06T03:12:20.262224Z 0 [Note] Shutting down plugin 'INNODB_SYS_COLUMNS'
      2023-03-06T03:12:20.262226Z 0 [Note] Shutting down plugin 'INNODB_SYS_INDEXES'
      2023-03-06T03:12:20.262227Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLESTATS'
      2023-03-06T03:12:20.262229Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLES'
      2023-03-06T03:12:20.262231Z 0 [Note] Shutting down plugin 'INNODB_FT_INDEX_TABLE'
      2023-03-06T03:12:20.262233Z 0 [Note] Shutting down plugin 'INNODB_FT_INDEX_CACHE'
      2023-03-06T03:12:20.262235Z 0 [Note] Shutting down plugin 'INNODB_FT_CONFIG'
      2023-03-06T03:12:20.262237Z 0 [Note] Shutting down plugin 'INNODB_FT_BEING_DELETED'
      2023-03-06T03:12:20.262238Z 0 [Note] Shutting down plugin 'INNODB_FT_DELETED'
      2023-03-06T03:12:20.262240Z 0 [Note] Shutting down plugin 'INNODB_FT_DEFAULT_STOPWORD'
      2023-03-06T03:12:20.262242Z 0 [Note] Shutting down plugin 'INNODB_METRICS'
      2023-03-06T03:12:20.262244Z 0 [Note] Shutting down plugin 'INNODB_TEMP_TABLE_INFO'
      2023-03-06T03:12:20.262246Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_POOL_STATS'
      2023-03-06T03:12:20.262248Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_PAGE_LRU'
      2023-03-06T03:12:20.262250Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_PAGE'
      2023-03-06T03:12:20.262252Z 0 [Note] Shutting down plugin 'INNODB_CMP_PER_INDEX_RESET'
      2023-03-06T03:12:20.262254Z 0 [Note] Shutting down plugin 'INNODB_CMP_PER_INDEX'
      2023-03-06T03:12:20.262256Z 0 [Note] Shutting down plugin 'INNODB_CMPMEM_RESET'
      2023-03-06T03:12:20.262258Z 0 [Note] Shutting down plugin 'INNODB_CMPMEM'
      2023-03-06T03:12:20.262259Z 0 [Note] Shutting down plugin 'INNODB_CMP_RESET'
      2023-03-06T03:12:20.262262Z 0 [Note] Shutting down plugin 'INNODB_CMP'
      2023-03-06T03:12:20.262264Z 0 [Note] Shutting down plugin 'INNODB_LOCK_WAITS'
      2023-03-06T03:12:20.262266Z 0 [Note] Shutting down plugin 'INNODB_LOCKS'
      2023-03-06T03:12:20.262268Z 0 [Note] Shutting down plugin 'INNODB_TRX'
      2023-03-06T03:12:20.262270Z 0 [Note] Shutting down plugin 'InnoDB'
      2023-03-06T03:12:20.262310Z 0 [Note] InnoDB: FTS optimize thread exiting.
      2023-03-06T03:12:20.262400Z 0 [Note] InnoDB: Starting shutdown...
      2023-03-06T03:12:20.362676Z 0 [Note] InnoDB: Dumping buffer pool(s) to /var/lib/mysql/ib_buffer_pool
      2023-03-06T03:12:20.362970Z 0 [Note] InnoDB: Buffer pool(s) dump completed at 230306 11:12:20
      2023-03-06T03:12:21.375348Z 0 [Note] InnoDB: Shutdown completed; log sequence number 12184404
      2023-03-06T03:12:21.376272Z 0 [Note] InnoDB: Removed temporary tablespace data file: "ibtmp1"
      2023-03-06T03:12:21.376303Z 0 [Note] Shutting down plugin 'MEMORY'
      2023-03-06T03:12:21.376309Z 0 [Note] Shutting down plugin 'CSV'
      2023-03-06T03:12:21.376313Z 0 [Note] Shutting down plugin 'sha256_password'
      2023-03-06T03:12:21.376315Z 0 [Note] Shutting down plugin 'mysql_native_password'
      2023-03-06T03:12:21.376447Z 0 [Note] Shutting down plugin 'binlog'
      2023-03-06T03:12:21.377092Z 0 [Note] mysqld: Shutdown complete
      
      2023-03-06 11:12:22+08:00 [Note] [Entrypoint]: Temporary server stopped
      
      2023-03-06 11:12:22+08:00 [Note] [Entrypoint]: MySQL init process done. Ready for start up.
      
      2023-03-06T03:12:22.434801Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
      2023-03-06T03:12:22.435983Z 0 [Note] mysqld (mysqld 5.7.41) starting as process 1 ...
      2023-03-06T03:12:22.439172Z 0 [Note] InnoDB: PUNCH HOLE support available
      2023-03-06T03:12:22.439197Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
      2023-03-06T03:12:22.439203Z 0 [Note] InnoDB: Uses event mutexes
      2023-03-06T03:12:22.439206Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
      2023-03-06T03:12:22.439208Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.12
      2023-03-06T03:12:22.439211Z 0 [Note] InnoDB: Using Linux native AIO
      2023-03-06T03:12:22.439450Z 0 [Note] InnoDB: Number of pools: 1
      2023-03-06T03:12:22.439556Z 0 [Note] InnoDB: Using CPU crc32 instructions
      2023-03-06T03:12:22.441193Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
      2023-03-06T03:12:22.448782Z 0 [Note] InnoDB: Completed initialization of buffer pool
      2023-03-06T03:12:22.451021Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
      2023-03-06T03:12:22.465916Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
      2023-03-06T03:12:22.482256Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
      2023-03-06T03:12:22.482343Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
      2023-03-06T03:12:22.539026Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
      2023-03-06T03:12:22.540081Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
      2023-03-06T03:12:22.540096Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
      2023-03-06T03:12:22.540910Z 0 [Note] InnoDB: Waiting for purge to start
      2023-03-06T03:12:22.591077Z 0 [Note] InnoDB: 5.7.41 started; log sequence number 12184404
      2023-03-06T03:12:22.591660Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
      2023-03-06T03:12:22.591908Z 0 [Note] Plugin 'FEDERATED' is disabled.
      2023-03-06T03:12:22.594103Z 0 [Note] InnoDB: Buffer pool(s) load completed at 230306 11:12:22
      2023-03-06T03:12:22.596859Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
      2023-03-06T03:12:22.596873Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
      2023-03-06T03:12:22.596877Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
      2023-03-06T03:12:22.596879Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
      2023-03-06T03:12:22.597389Z 0 [Warning] CA certificate ca.pem is self signed.
      2023-03-06T03:12:22.597420Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
      2023-03-06T03:12:22.597661Z 0 [Note] Server hostname (bind-address): '*'; port: 3306
      2023-03-06T03:12:22.597705Z 0 [Note] IPv6 is available.
      2023-03-06T03:12:22.598673Z 0 [Note]   - '::' resolves to '::';
      2023-03-06T03:12:22.598732Z 0 [Note] Server socket created on IP: '::'.
      2023-03-06T03:12:22.599889Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
      2023-03-06T03:12:22.608346Z 0 [Note] Event Scheduler: Loaded 0 events
      2023-03-06T03:12:22.608539Z 0 [Note] mysqld: ready for connections.
      Version: '5.7.41'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)

# 完