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

# 完