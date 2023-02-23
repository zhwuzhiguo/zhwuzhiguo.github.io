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

基于 `centos` 构造 `jdk8` 环境的镜像：

- 编写 `Dockerfile`

      [root@centos docker]# cd jdk8/
      [root@centos jdk8]# ll
      总用量 187328
      -rw-r--r-- 1 root root       331 2月  23 15:55 Dockerfile
      -rw-r--r-- 1 root root 191817140 2月  23 15:53 jdk-8u201-linux-x64.tar.gz


      # Dockerfile
      FROM centos:centos8
      
      LABEL title="jdk8"
      LABEL author="wuzhiguo"
      LABEL email="wuzhiguo@163.com"
      
      RUN mkdir /usr/local/java
      ADD jdk-8u201-linux-x64.tar.gz /usr/local/java
      
      ENV JAVA_HOME=/usr/local/java/jdk1.8.0_201
      ENV JRE_HOME=$JAVA_HOME/jre
      ENV CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
      ENV PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin

- 构建镜像

      [root@centos jdk8]# docker build -t centos-jdk:8 .
      [+] Building 0.0s (8/8) FINISHED
       => [internal] load build definition from Dockerfile                                                                                                                                                                                     0.0s
       => => transferring dockerfile: 370B                                                                                                                                                                                                     0.0s
       => [internal] load .dockerignore                                                                                                                                                                                                        0.0s
       => => transferring context: 2B                                                                                                                                                                                                          0.0s
       => [internal] load metadata for docker.io/library/centos:centos8                                                                                                                                                                        0.0s
       => [1/3] FROM docker.io/library/centos:centos8                                                                                                                                                                                          0.0s
       => [internal] load build context                                                                                                                                                                                                        0.0s
       => => transferring context: 50B                                                                                                                                                                                                         0.0s
       => CACHED [2/3] RUN mkdir /usr/local/java                                                                                                                                                                                               0.0s
       => CACHED [3/3] ADD jdk-8u201-linux-x64.tar.gz /usr/local/java                                                                                                                                                                          0.0s
       => exporting to image                                                                                                                                                                                                                   0.0s
       => => exporting layers                                                                                                                                                                                                                  0.0s
       => => writing image sha256:a8d7d9004c62b282196042b6ba65e2df340d916d6cc36d6c3f4953ba5b2942f3                                                                                                                                             0.0s
       => => naming to docker.io/library/centos-jdk:8                                                                                                                                                                                          0.0s
      
      [root@centos jdk8]# docker images
      REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
      centos-jdk     8         a8d7d9004c62   6 minutes ago   628MB
      centos-java8   latest    4bfb1a2b306e   21 hours ago    820MB
      nginx          1.23      3f8a00f137a0   2 weeks ago     142MB
      mysql          5.7       be16cf2d832a   3 weeks ago     455MB
      centos         centos8   5d0da3dc9764   17 months ago   231MB

- 运行镜像

      [root@centos jdk8]# docker run -di --name=centos-jdk8 centos-jdk:8
      3c2017a81597ac922240cccb1515d25ddef9a5a6c845e890c9c1a09abece80e1
      
      [root@centos jdk8]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED         STATUS         PORTS     NAMES
      3c2017a81597   centos-jdk:8     "/bin/bash"   6 seconds ago   Up 5 seconds             centos-jdk8
      b2df06fed844   centos:centos8   "/bin/bash"   2 days ago      Up 2 days                centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   2 days ago      Up 47 hours              centos
      
      [root@centos jdk8]# docker exec -it centos-jdk8 /bin/bash
      [root@3c2017a81597 /]# java -version
      java version "1.8.0_201"
      Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
      Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)

# 完