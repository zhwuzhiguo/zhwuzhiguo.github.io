# 09-Docker-Compose

`Docker Compose` 是一个用于定义和运行多容器的工具。

使用 `YAML` 文件来配置多个容器。

使用一个命令就可以通过配置创建并启动所有容器。

## 安装 Docker Compose

安装 `Docker Engine` 的时候就可以同时安装 `docker-compose-plugin` 来安装 `Docker Compose`：

    // 安装最新版
    sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

查看版本：

    [root@centos sample-compose]# docker compose version
    Docker Compose version v2.16.0

## 创建 Docker Compose 文件

创建 `docker-compose.yml` 文件：

    [root@centos sample-compose]# cat docker-compose.yml
    # 定义服务
    services:
      # 自定义服务名(也是网络别名)
      mysql:
        # 使用的镜像
        image: mysql:5.7
        # 端口映射
        ports:
          - 33060:3306
        # 环境变量
        environment:
          MYSQL_ROOT_PASSWORD: 123456
          MYSQL_DATABASE: sample
        # 覆盖镜像CMD命令
        # 指定默认编码
        command:
          - mysqld
          - --character-set-server=utf8mb4
          - --collation-server=utf8mb4_general_ci
        # 卷映射
        volumes:
          - mysql-data:/var/lib/mysql
        # 健康检测
        healthcheck:
          test: mysqladmin ping -uroot -p123456
          interval: 30s
          timeout: 10s
          retries: 3
          start_period: 30s
    
      # 自定义服务名(也是网络别名)
      sample-web:
        image: sample-web
        ports:
          - 8888:8080
        # 依赖其他服务先启动
        depends_on:
          mysql:
            # 依赖服务健康后才启动
            condition: service_healthy
    
    # 定义卷
    # 使用 docker run 运行容器时命名卷会自动创建
    # 使用 docker compose 不会自动创建需要在这里定义
    volumes:
      mysql-data:
    

## 创建并启动服务

    // 创建并启动容器
    // -d 后台运行容器
    [root@centos sample-compose]# docker compose up -d
    [+] Running 3/4
     ⠿ Network sample-compose_default         Created                    0.1s
     ⠿ Volume "sample-compose_mysql-data"     Created                    0.0s
     ⠿ Container sample-compose-mysql-1       Waiting                   12.1s
     ⠿ Container sample-compose-sample-web-1  Created                    0.0s
    
    // 等待30秒后...
    [+] Running 4/4
     ⠿ Network sample-compose_default         Created                    0.1s
     ⠿ Volume "sample-compose_mysql-data"     Created                    0.0s
     ⠿ Container sample-compose-mysql-1       Healthy                   31.2s
     ⠿ Container sample-compose-sample-web-1  Started                   31.5s

    // 查看容器
    [root@centos sample-compose]# docker ps -a
    CONTAINER ID   IMAGE        COMMAND                   CREATED              STATUS                        PORTS                                                    NAMES
    46414beada26   sample-web   "/bin/sh -c 'java -j…"   About a minute ago   Up 46 seconds                 0.0.0.0:8888->8080/tcp, :::8888->8080/tcp                sample-compose-sample-web-1
    eed005ab1bb2   mysql:5.7    "docker-entrypoint.s…"   About a minute ago   Up About a minute (healthy)   33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   sample-compose-mysql-1

    // 查看网络
    [root@centos sample-compose]# docker network ls
    NETWORK ID     NAME                     DRIVER    SCOPE
    3528c4b9b0c5   bridge                   bridge    local
    c1baf3b0966d   host                     host      local
    2656d3bb9028   none                     null      local
    4694dcd48bf3   sample-compose_default   bridge    local
    
    // 查看卷
    [root@centos sample-compose]# docker volume ls
    DRIVER    VOLUME NAME
    local     sample-compose_mysql-data

    // 查看服务容器
    [root@centos sample-compose]# docker compose ps -a
    NAME                          IMAGE               COMMAND                  SERVICE             CREATED              STATUS                        PORTS
    sample-compose-mysql-1        mysql:5.7           "docker-entrypoint.s…"   mysql               About a minute ago   Up About a minute (healthy)   33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp
    sample-compose-sample-web-1   sample-web          "/bin/sh -c 'java -j…"   sample-web          About a minute ago   Up About a minute             0.0.0.0:8888->8080/tcp, :::8888->8080/tcp

    // 创建表
    // sample-web 访问
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

## 查看日志

    // 查看全部服务日志
    [root@centos sample-compose]# docker compose logs -f
    sample-compose-mysql-1       | 2023-03-05 06:37:38+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.41-1.el7 started.
    sample-compose-mysql-1       | 2023-03-05 06:37:38+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
    sample-compose-mysql-1       | 2023-03-05 06:37:38+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.41-1.el7 started.
    sample-compose-mysql-1       | 2023-03-05 06:37:39+00:00 [Note] [Entrypoint]: Initializing database files
    sample-compose-mysql-1       | 2023-03-05T06:37:39.086094Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
    sample-compose-mysql-1       | 2023-03-05T06:37:40.105146Z 0 [Warning] InnoDB: New log files created, LSN=45790
    sample-compose-mysql-1       | 2023-03-05T06:37:40.279932Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
    sample-compose-mysql-1       | 2023-03-05T06:37:40.290968Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: 39e37773-bb20-11ed-b33d-0242c0a83002.
    sample-compose-mysql-1       | 2023-03-05T06:37:40.292057Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
    sample-compose-mysql-1       | 2023-03-05T06:37:40.564705Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
    sample-compose-mysql-1       | 2023-03-05T06:37:40.564725Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
    sample-compose-mysql-1       | 2023-03-05T06:37:40.565233Z 0 [Warning] CA certificate ca.pem is self signed.
    sample-compose-mysql-1       | 2023-03-05T06:37:40.683853Z 1 [Warning] root@localhost is created with an empty password ! Please consider switching off the --initialize-insecure option.
    sample-compose-mysql-1       | 2023-03-05 06:37:43+00:00 [Note] [Entrypoint]: Database files initialized
    sample-compose-mysql-1       | 2023-03-05 06:37:43+00:00 [Note] [Entrypoint]: Starting temporary server
    sample-compose-mysql-1       | 2023-03-05 06:37:43+00:00 [Note] [Entrypoint]: Waiting for server startup
    sample-compose-mysql-1       | 2023-03-05T06:37:43.422616Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
    sample-compose-mysql-1       | 2023-03-05T06:37:43.424398Z 0 [Note] mysqld (mysqld 5.7.41) starting as process 124 ...
    sample-compose-mysql-1       | 2023-03-05T06:37:43.428837Z 0 [Note] InnoDB: PUNCH HOLE support available
    sample-compose-mysql-1       | 2023-03-05T06:37:43.428864Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
    sample-compose-mysql-1       | 2023-03-05T06:37:43.428867Z 0 [Note] InnoDB: Uses event mutexes
    sample-compose-mysql-1       | 2023-03-05T06:37:43.428870Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
    sample-compose-mysql-1       | 2023-03-05T06:37:43.428872Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.12
    sample-compose-mysql-1       | 2023-03-05T06:37:43.428875Z 0 [Note] InnoDB: Using Linux native AIO
    sample-compose-mysql-1       | 2023-03-05T06:37:43.429159Z 0 [Note] InnoDB: Number of pools: 1
    sample-compose-mysql-1       | 2023-03-05T06:37:43.429271Z 0 [Note] InnoDB: Using CPU crc32 instructions
    sample-compose-mysql-1       | 2023-03-05T06:37:43.430951Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
    sample-compose-mysql-1       | 2023-03-05T06:37:43.439175Z 0 [Note] InnoDB: Completed initialization of buffer pool
    sample-compose-mysql-1       | 2023-03-05T06:37:43.441463Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
    sample-compose-mysql-1       | 2023-03-05T06:37:43.453125Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.465583Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
    sample-compose-mysql-1       | 2023-03-05T06:37:43.465664Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
    sample-compose-mysql-1       | 2023-03-05T06:37:43.571342Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.572158Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.572173Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.572462Z 0 [Note] InnoDB: Waiting for purge to start
    sample-compose-mysql-1       | 2023-03-05T06:37:43.622639Z 0 [Note] InnoDB: 5.7.41 started; log sequence number 2762314
    sample-compose-mysql-1       | 2023-03-05T06:37:43.622922Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
    sample-compose-mysql-1       | 2023-03-05T06:37:43.623381Z 0 [Note] Plugin 'FEDERATED' is disabled.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.624591Z 0 [Note] InnoDB: Buffer pool(s) load completed at 230305  6:37:43
    sample-compose-mysql-1       | 2023-03-05T06:37:43.631298Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.631313Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.631317Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.631319Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.633745Z 0 [Warning] CA certificate ca.pem is self signed.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.633782Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.635210Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
    sample-compose-mysql-1       | 2023-03-05T06:37:43.642147Z 0 [Note] Event Scheduler: Loaded 0 events
    sample-compose-mysql-1       | 2023-03-05T06:37:43.642300Z 0 [Note] mysqld: ready for connections.
    sample-compose-mysql-1       | Version: '5.7.41'  socket: '/var/run/mysqld/mysqld.sock'  port: 0  MySQL Community Server (GPL)
    sample-compose-mysql-1       | 2023-03-05 06:37:44+00:00 [Note] [Entrypoint]: Temporary server started.
    sample-compose-mysql-1       | '/var/lib/mysql/mysql.sock' -> '/var/run/mysqld/mysqld.sock'
    sample-compose-mysql-1       | 2023-03-05T06:37:44.346284Z 3 [Note] InnoDB: Stopping purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.350884Z 3 [Note] InnoDB: Resuming purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.352148Z 3 [Note] InnoDB: Stopping purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.354289Z 3 [Note] InnoDB: Resuming purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.355492Z 3 [Note] InnoDB: Stopping purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.357772Z 3 [Note] InnoDB: Resuming purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.359036Z 3 [Note] InnoDB: Stopping purge
    sample-compose-mysql-1       | 2023-03-05T06:37:44.361239Z 3 [Note] InnoDB: Resuming purge
    sample-compose-mysql-1       | Warning: Unable to load '/usr/share/zoneinfo/iso3166.tab' as time zone. Skipping it.
    sample-compose-mysql-1       | Warning: Unable to load '/usr/share/zoneinfo/leapseconds' as time zone. Skipping it.
    sample-compose-mysql-1       | Warning: Unable to load '/usr/share/zoneinfo/tzdata.zi' as time zone. Skipping it.
    sample-compose-mysql-1       | Warning: Unable to load '/usr/share/zoneinfo/zone.tab' as time zone. Skipping it.
    sample-compose-mysql-1       | Warning: Unable to load '/usr/share/zoneinfo/zone1970.tab' as time zone. Skipping it.
    sample-compose-mysql-1       | 2023-03-05 06:37:46+00:00 [Note] [Entrypoint]: Creating database sample
    sample-compose-mysql-1       |
    sample-compose-mysql-1       | 2023-03-05 06:37:46+00:00 [Note] [Entrypoint]: Stopping temporary server
    sample-compose-mysql-1       | 2023-03-05T06:37:46.371324Z 0 [Note] Giving 0 client threads a chance to die gracefully
    sample-compose-mysql-1       | 2023-03-05T06:37:46.371357Z 0 [Note] Shutting down slave threads
    sample-compose-mysql-1       | 2023-03-05T06:37:46.371362Z 0 [Note] Forcefully disconnecting 0 remaining clients
    sample-compose-mysql-1       | 2023-03-05T06:37:46.371369Z 0 [Note] Event Scheduler: Purging the queue. 0 events
    sample-compose-mysql-1       | 2023-03-05T06:37:46.371428Z 0 [Note] Binlog end
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372011Z 0 [Note] Shutting down plugin 'ngram'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372042Z 0 [Note] Shutting down plugin 'partition'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372045Z 0 [Note] Shutting down plugin 'BLACKHOLE'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372049Z 0 [Note] Shutting down plugin 'ARCHIVE'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372051Z 0 [Note] Shutting down plugin 'PERFORMANCE_SCHEMA'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372081Z 0 [Note] Shutting down plugin 'MRG_MYISAM'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372084Z 0 [Note] Shutting down plugin 'MyISAM'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372090Z 0 [Note] Shutting down plugin 'INNODB_SYS_VIRTUAL'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372093Z 0 [Note] Shutting down plugin 'INNODB_SYS_DATAFILES'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372095Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLESPACES'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372097Z 0 [Note] Shutting down plugin 'INNODB_SYS_FOREIGN_COLS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372098Z 0 [Note] Shutting down plugin 'INNODB_SYS_FOREIGN'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372100Z 0 [Note] Shutting down plugin 'INNODB_SYS_FIELDS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372102Z 0 [Note] Shutting down plugin 'INNODB_SYS_COLUMNS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372104Z 0 [Note] Shutting down plugin 'INNODB_SYS_INDEXES'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372106Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLESTATS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372108Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLES'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372110Z 0 [Note] Shutting down plugin 'INNODB_FT_INDEX_TABLE'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372112Z 0 [Note] Shutting down plugin 'INNODB_FT_INDEX_CACHE'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372114Z 0 [Note] Shutting down plugin 'INNODB_FT_CONFIG'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372116Z 0 [Note] Shutting down plugin 'INNODB_FT_BEING_DELETED'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372118Z 0 [Note] Shutting down plugin 'INNODB_FT_DELETED'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372120Z 0 [Note] Shutting down plugin 'INNODB_FT_DEFAULT_STOPWORD'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372122Z 0 [Note] Shutting down plugin 'INNODB_METRICS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372124Z 0 [Note] Shutting down plugin 'INNODB_TEMP_TABLE_INFO'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372126Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_POOL_STATS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372128Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_PAGE_LRU'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372130Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_PAGE'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372132Z 0 [Note] Shutting down plugin 'INNODB_CMP_PER_INDEX_RESET'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372135Z 0 [Note] Shutting down plugin 'INNODB_CMP_PER_INDEX'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372137Z 0 [Note] Shutting down plugin 'INNODB_CMPMEM_RESET'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372139Z 0 [Note] Shutting down plugin 'INNODB_CMPMEM'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372141Z 0 [Note] Shutting down plugin 'INNODB_CMP_RESET'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372143Z 0 [Note] Shutting down plugin 'INNODB_CMP'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372145Z 0 [Note] Shutting down plugin 'INNODB_LOCK_WAITS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372147Z 0 [Note] Shutting down plugin 'INNODB_LOCKS'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372149Z 0 [Note] Shutting down plugin 'INNODB_TRX'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372151Z 0 [Note] Shutting down plugin 'InnoDB'
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372200Z 0 [Note] InnoDB: FTS optimize thread exiting.
    sample-compose-mysql-1       | 2023-03-05T06:37:46.372294Z 0 [Note] InnoDB: Starting shutdown...
    sample-compose-mysql-1       | 2023-03-05T06:37:46.472505Z 0 [Note] InnoDB: Dumping buffer pool(s) to /var/lib/mysql/ib_buffer_pool
    sample-compose-mysql-1       | 2023-03-05T06:37:46.472757Z 0 [Note] InnoDB: Buffer pool(s) dump completed at 230305  6:37:46
    sample-compose-mysql-1       | 2023-03-05T06:37:47.480408Z 0 [Note] InnoDB: Shutdown completed; log sequence number 12184404
    sample-compose-mysql-1       | 2023-03-05T06:37:47.481475Z 0 [Note] InnoDB: Removed temporary tablespace data file: "ibtmp1"
    sample-compose-mysql-1       | 2023-03-05T06:37:47.481497Z 0 [Note] Shutting down plugin 'MEMORY'
    sample-compose-mysql-1       | 2023-03-05T06:37:47.481502Z 0 [Note] Shutting down plugin 'CSV'
    sample-compose-mysql-1       | 2023-03-05T06:37:47.481506Z 0 [Note] Shutting down plugin 'sha256_password'
    sample-compose-mysql-1       | 2023-03-05T06:37:47.481508Z 0 [Note] Shutting down plugin 'mysql_native_password'
    sample-compose-mysql-1       | 2023-03-05T06:37:47.481633Z 0 [Note] Shutting down plugin 'binlog'
    sample-compose-mysql-1       | 2023-03-05T06:37:47.482271Z 0 [Note] mysqld: Shutdown complete
    sample-compose-mysql-1       |
    sample-compose-mysql-1       | 2023-03-05 06:37:48+00:00 [Note] [Entrypoint]: Temporary server stopped
    sample-compose-mysql-1       |
    sample-compose-mysql-1       | 2023-03-05 06:37:48+00:00 [Note] [Entrypoint]: MySQL init process done. Ready for start up.
    sample-compose-mysql-1       |
    sample-compose-mysql-1       | 2023-03-05T06:37:48.563795Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
    sample-compose-mysql-1       | 2023-03-05T06:37:48.565544Z 0 [Note] mysqld (mysqld 5.7.41) starting as process 1 ...
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568685Z 0 [Note] InnoDB: PUNCH HOLE support available
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568711Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568714Z 0 [Note] InnoDB: Uses event mutexes
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568717Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568720Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.12
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568723Z 0 [Note] InnoDB: Using Linux native AIO
    sample-compose-mysql-1       | 2023-03-05T06:37:48.568968Z 0 [Note] InnoDB: Number of pools: 1
    sample-compose-mysql-1       | 2023-03-05T06:37:48.569082Z 0 [Note] InnoDB: Using CPU crc32 instructions
    sample-compose-mysql-1       | 2023-03-05T06:37:48.570755Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
    sample-compose-mysql-1       | 2023-03-05T06:37:48.579015Z 0 [Note] InnoDB: Completed initialization of buffer pool
    sample-compose-mysql-1       | 2023-03-05T06:37:48.581298Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
    sample-compose-mysql-1       | 2023-03-05T06:37:48.595545Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.609120Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
    sample-compose-mysql-1       | 2023-03-05T06:37:48.609178Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
    sample-compose-mysql-1       | 2023-03-05T06:37:48.688578Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.689453Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.689471Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.689794Z 0 [Note] InnoDB: Waiting for purge to start
    sample-compose-mysql-1       | 2023-03-05T06:37:48.739953Z 0 [Note] InnoDB: 5.7.41 started; log sequence number 12184404
    sample-compose-mysql-1       | 2023-03-05T06:37:48.740211Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
    sample-compose-mysql-1       | 2023-03-05T06:37:48.740298Z 0 [Note] Plugin 'FEDERATED' is disabled.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.743461Z 0 [Note] InnoDB: Buffer pool(s) load completed at 230305  6:37:48
    sample-compose-mysql-1       | 2023-03-05T06:37:48.746745Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.746760Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.746764Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.746766Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.747246Z 0 [Warning] CA certificate ca.pem is self signed.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.747278Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.747537Z 0 [Note] Server hostname (bind-address): '*'; port: 3306
    sample-compose-mysql-1       | 2023-03-05T06:37:48.747568Z 0 [Note] IPv6 is available.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.747579Z 0 [Note]   - '::' resolves to '::';
    sample-compose-mysql-1       | 2023-03-05T06:37:48.747596Z 0 [Note] Server socket created on IP: '::'.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.748790Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
    sample-compose-mysql-1       | 2023-03-05T06:37:48.755984Z 0 [Note] Event Scheduler: Loaded 0 events
    sample-compose-mysql-1       | 2023-03-05T06:37:48.756145Z 0 [Note] mysqld: ready for connections.
    sample-compose-mysql-1       | Version: '5.7.41'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  |   .   ____          _            __ _ _
    sample-compose-sample-web-1  |  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
    sample-compose-sample-web-1  | ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
    sample-compose-sample-web-1  |  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
    sample-compose-sample-web-1  |   '  |____| .__|_| |_|_| |_\__, | / / / /
    sample-compose-sample-web-1  |  =========|_|==============|___/=/_/_/_/
    sample-compose-sample-web-1  |  :: Spring Boot ::       (v2.3.12.RELEASE)
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  | [2023-03-05 14:38:10.736] [sample-web] [trace=] [token=] [background-preinit] INFO  o.h.validator.internal.util.Version - HV000001: Hibernate Validator 6.1.7.Final
    sample-compose-sample-web-1  | [2023-03-05 14:38:10.787] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Starting SampleWebApplication v1.0.0-SNAPSHOT on 46414beada26 with PID 1 (/root/app/sample-web.jar started by root in /root/app)
    sample-compose-sample-web-1  | [2023-03-05 14:38:10.788] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - No active profile set, falling back to default profiles: default
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.613] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat initialized with port(s): 8080 (http)
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.629] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Initializing ProtocolHandler ["http-nio-8080"]
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.630] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardService - Starting service [Tomcat]
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.630] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardEngine - Starting Servlet engine: [Apache Tomcat/9.0.46]
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.701] [sample-web] [trace=] [token=] [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring embedded WebApplicationContext
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.702] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext - Root WebApplicationContext: initialization completed in 1786 ms
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.920] [sample-web] [trace=] [token=] [main] INFO  c.a.d.s.b.a.DruidDataSourceAutoConfigure - Init DruidDataSource
    sample-compose-sample-web-1  | [2023-03-05 14:38:13.816] [sample-web] [trace=] [token=] [main] INFO  c.alibaba.druid.pool.DruidDataSource - {dataSource-1} inited
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.190] [sample-web] [trace=] [token=] [main] INFO  o.s.s.c.ThreadPoolTaskExecutor - Initializing ExecutorService 'applicationTaskExecutor'
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.453] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Starting ProtocolHandler ["http-nio-8080"]
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.478] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port(s): 8080 (http) with context path ''
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.504] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Started SampleWebApplication in 4.39 seconds (JVM running for 5.045)
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.571] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring DispatcherServlet 'dispatcherServlet'
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.576] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Initializing Servlet 'dispatcherServlet'
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.586] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Completed initialization in 10 ms
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.636] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] INFO  c.g.f.c.web.filter.HttpLogFilter - Received Request:
    sample-compose-sample-web-1  | POST /api/user/AddUser HTTP/1.1
    sample-compose-sample-web-1  | content-type: application/json
    sample-compose-sample-web-1  | user-agent: PostmanRuntime/7.30.1
    sample-compose-sample-web-1  | accept: */*
    sample-compose-sample-web-1  | postman-token: 6fb5f20e-b5d5-4407-9d61-42f4b2d6cabe
    sample-compose-sample-web-1  | host: 39.107.235.147:8888
    sample-compose-sample-web-1  | accept-encoding: gzip, deflate, br
    sample-compose-sample-web-1  | connection: keep-alive
    sample-compose-sample-web-1  | content-length: 157
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  | {
    sample-compose-sample-web-1  |     "username": "admin",
    sample-compose-sample-web-1  |     "password": "e10adc3949ba59abbe56e057f20f883e",
    sample-compose-sample-web-1  |     "nickname": "管理员",
    sample-compose-sample-web-1  |     "telephone": "13512345678",
    sample-compose-sample-web-1  |     "status": 0
    sample-compose-sample-web-1  | }
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.005] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777179
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.007] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777202
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.008] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777211
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.010] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777220
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.018] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777234
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.024] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777264
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.025] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777275
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.027] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777291
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.030] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777317
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.031] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777342
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.295] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] INFO  c.g.f.c.web.filter.HttpLogFilter - Send Response:
    sample-compose-sample-web-1  | HTTP/1.1 200 XX
    sample-compose-sample-web-1  | Vary: Origin
    sample-compose-sample-web-1  | Vary: Origin
    sample-compose-sample-web-1  | Vary: Origin
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  | {"code":200,"message":"成功"}
    
    // 查看指定服务日志
    [root@centos sample-compose]# docker compose logs -f sample-web
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  |   .   ____          _            __ _ _
    sample-compose-sample-web-1  |  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
    sample-compose-sample-web-1  | ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
    sample-compose-sample-web-1  |  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
    sample-compose-sample-web-1  |   '  |____| .__|_| |_|_| |_\__, | / / / /
    sample-compose-sample-web-1  |  =========|_|==============|___/=/_/_/_/
    sample-compose-sample-web-1  |  :: Spring Boot ::       (v2.3.12.RELEASE)
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  | [2023-03-05 14:38:10.736] [sample-web] [trace=] [token=] [background-preinit] INFO  o.h.validator.internal.util.Version - HV000001: Hibernate Validator 6.1.7.Final
    sample-compose-sample-web-1  | [2023-03-05 14:38:10.787] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Starting SampleWebApplication v1.0.0-SNAPSHOT on 46414beada26 with PID 1 (/root/app/sample-web.jar started by root in /root/app)
    sample-compose-sample-web-1  | [2023-03-05 14:38:10.788] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - No active profile set, falling back to default profiles: default
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.613] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat initialized with port(s): 8080 (http)
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.629] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Initializing ProtocolHandler ["http-nio-8080"]
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.630] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardService - Starting service [Tomcat]
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.630] [sample-web] [trace=] [token=] [main] INFO  o.a.catalina.core.StandardEngine - Starting Servlet engine: [Apache Tomcat/9.0.46]
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.701] [sample-web] [trace=] [token=] [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring embedded WebApplicationContext
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.702] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext - Root WebApplicationContext: initialization completed in 1786 ms
    sample-compose-sample-web-1  | [2023-03-05 14:38:12.920] [sample-web] [trace=] [token=] [main] INFO  c.a.d.s.b.a.DruidDataSourceAutoConfigure - Init DruidDataSource
    sample-compose-sample-web-1  | [2023-03-05 14:38:13.816] [sample-web] [trace=] [token=] [main] INFO  c.alibaba.druid.pool.DruidDataSource - {dataSource-1} inited
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.190] [sample-web] [trace=] [token=] [main] INFO  o.s.s.c.ThreadPoolTaskExecutor - Initializing ExecutorService 'applicationTaskExecutor'
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.453] [sample-web] [trace=] [token=] [main] INFO  o.a.coyote.http11.Http11NioProtocol - Starting ProtocolHandler ["http-nio-8080"]
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.478] [sample-web] [trace=] [token=] [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port(s): 8080 (http) with context path ''
    sample-compose-sample-web-1  | [2023-03-05 14:38:14.504] [sample-web] [trace=] [token=] [main] INFO  com.gg.SampleWebApplication - Started SampleWebApplication in 4.39 seconds (JVM running for 5.045)
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.571] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.a.c.c.C.[Tomcat].[localhost].[/] - Initializing Spring DispatcherServlet 'dispatcherServlet'
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.576] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Initializing Servlet 'dispatcherServlet'
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.586] [sample-web] [trace=] [token=] [http-nio-8080-exec-1] INFO  o.s.web.servlet.DispatcherServlet - Completed initialization in 10 ms
    sample-compose-sample-web-1  | [2023-03-05 14:51:10.636] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] INFO  c.g.f.c.web.filter.HttpLogFilter - Received Request:
    sample-compose-sample-web-1  | POST /api/user/AddUser HTTP/1.1
    sample-compose-sample-web-1  | content-type: application/json
    sample-compose-sample-web-1  | user-agent: PostmanRuntime/7.30.1
    sample-compose-sample-web-1  | accept: */*
    sample-compose-sample-web-1  | postman-token: 6fb5f20e-b5d5-4407-9d61-42f4b2d6cabe
    sample-compose-sample-web-1  | host: 39.107.235.147:8888
    sample-compose-sample-web-1  | accept-encoding: gzip, deflate, br
    sample-compose-sample-web-1  | connection: keep-alive
    sample-compose-sample-web-1  | content-length: 157
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  | {
    sample-compose-sample-web-1  |     "username": "admin",
    sample-compose-sample-web-1  |     "password": "e10adc3949ba59abbe56e057f20f883e",
    sample-compose-sample-web-1  |     "nickname": "管理员",
    sample-compose-sample-web-1  |     "telephone": "13512345678",
    sample-compose-sample-web-1  |     "status": 0
    sample-compose-sample-web-1  | }
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.005] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777179
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.007] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777202
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.008] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777211
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.010] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777220
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.018] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777234
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.024] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777264
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.025] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777275
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.027] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777291
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.030] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777317
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.031] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] WARN  c.a.d.pool.DruidAbstractDataSource - discard long time none received connection. , jdbcUrl : jdbc:mysql://mysql:3306/sample?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull, version : 1.2.5, lastPacketReceivedIdleMillis : 777342
    sample-compose-sample-web-1  | [2023-03-05 14:51:11.295] [sample-web] [trace=7cb150d3-3840-4432-9631-f44ff60f0388] [token=] [http-nio-8080-exec-1] INFO  c.g.f.c.web.filter.HttpLogFilter - Send Response:
    sample-compose-sample-web-1  | HTTP/1.1 200 XX
    sample-compose-sample-web-1  | Vary: Origin
    sample-compose-sample-web-1  | Vary: Origin
    sample-compose-sample-web-1  | Vary: Origin
    sample-compose-sample-web-1  |
    sample-compose-sample-web-1  | {"code":200,"message":"成功"}

## 停止服务

    // 停止服务
    [root@centos sample-compose]# docker compose stop
    [+] Running 2/2
     ⠿ Container sample-compose-sample-web-1  Stopped                        1.0s
     ⠿ Container sample-compose-mysql-1       Stopped                        3.3s
    
    [root@centos sample-compose]# docker ps -a
    CONTAINER ID   IMAGE        COMMAND                   CREATED          STATUS                        PORTS     NAMES
    46414beada26   sample-web   "/bin/sh -c 'java -j…"   18 minutes ago   Exited (143) 11 seconds ago             sample-compose-sample-web-1
    eed005ab1bb2   mysql:5.7    "docker-entrypoint.s…"   18 minutes ago   Exited (0) 7 seconds ago                sample-compose-mysql-1

## 启动服务

    // 启动服务
    [root@centos sample-compose]# docker compose start
    [+] Running 2/2
     ⠿ Container sample-compose-mysql-1       Healthy                                                                                                                                                                                       31.0s
     ⠿ Container sample-compose-sample-web-1  Started                                                                                                                                                                                        0.3s
    
    [root@centos sample-compose]# docker ps -a
    CONTAINER ID   IMAGE        COMMAND                   CREATED          STATUS                    PORTS                                                    NAMES
    46414beada26   sample-web   "/bin/sh -c 'java -j…"   20 minutes ago   Up 21 seconds             0.0.0.0:8888->8080/tcp, :::8888->8080/tcp                sample-compose-sample-web-1
    eed005ab1bb2   mysql:5.7    "docker-entrypoint.s…"   20 minutes ago   Up 52 seconds (healthy)   33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   sample-compose-mysql-1

## 停止并移除服务

    // 停止并移除容器和网络
    // -v 同时移除命名卷
    [root@centos sample-compose]# docker compose down -v
    [+] Running 4/4
     ⠿ Container sample-compose-sample-web-1  Removed                        0.6s
     ⠿ Container sample-compose-mysql-1       Removed                        3.7s
     ⠿ Volume sample-compose_mysql-data       Removed                        0.0s
     ⠿ Network sample-compose_default         Removed                        0.1s
    
    [root@centos sample-compose]# docker ps -a
    CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
    
    [root@centos sample-compose]# docker network ls
    NETWORK ID     NAME      DRIVER    SCOPE
    3528c4b9b0c5   bridge    bridge    local
    c1baf3b0966d   host      host      local
    2656d3bb9028   none      null      local
    
    [root@centos sample-compose]# docker volume ls
    DRIVER    VOLUME NAME

# 完

# docker compose help

    [root@centos sample-compose]# docker compose --help
    
    Usage:  docker compose [OPTIONS] COMMAND
    
    Docker Compose
    
    Options:
          --ansi string                Control when to print ANSI control characters ("never"|"always"|"auto") (default "auto")
          --compatibility              Run compose in backward compatibility mode
          --env-file string            Specify an alternate environment file.
      -f, --file stringArray           Compose configuration files
          --parallel int               Control max parallelism, -1 for unlimited (default -1)
          --profile stringArray        Specify a profile to enable
          --project-directory string   Specify an alternate working directory
                                       (default: the path of the, first specified, Compose file)
      -p, --project-name string        Project name
    
    Commands:
      build       Build or rebuild services
      config      Parse, resolve and render compose file in canonical format
      cp          Copy files/folders between a service container and the local filesystem
      create      Creates containers for a service.
      down        Stop and remove containers, networks
      events      Receive real time events from containers.
      exec        Execute a command in a running container.
      images      List images used by the created containers
      kill        Force stop service containers.
      logs        View output from containers
      ls          List running compose projects
      pause       Pause services
      port        Print the public port for a port binding.
      ps          List containers
      pull        Pull service images
      push        Push service images
      restart     Restart service containers
      rm          Removes stopped service containers
      run         Run a one-off command on a service.
      start       Start services
      stop        Stop services
      top         Display the running processes
      unpause     Unpause services
      up          Create and start containers
      version     Show the Docker Compose version information
    
    Run 'docker compose COMMAND --help' for more information on a command.
