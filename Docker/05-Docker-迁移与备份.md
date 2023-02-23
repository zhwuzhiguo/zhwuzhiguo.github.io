# 05-Docker-迁移与备份

## 容器保存为镜像

- 先构造一个Java环境的容器

      // 创建centos容器
      [root@centos ~]# docker run -di --name=centos-java centos:centos8
      e9f51744a9b9b618c65a6f64264ac26c1f5eb2d145da474dc5f2d0b00abd9734
      
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED           STATUS         PORTS     NAMES
      e9f51744a9b9   centos:centos8   "/bin/bash"   4 seconds ago   Up 4   seconds             centos-java
      b2df06fed844   centos:centos8   "/bin/bash"   45 hours ago    Up 26   hours              centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   45 hours ago    Up 25   hours              centos
      
      // 进入容器建java目录
      [root@centos ~]# docker exec -it centos-java /bin/bash
      [root@e9f51744a9b9 /]# cd /usr/local/
      [root@e9f51744a9b9 local]# mkdir java
      [root@e9f51744a9b9 local]# exit
      exit
      
      // 拷贝jdk包到容器的java目录
      [root@centos ~]# docker cp -q /root/software/java/  jdk-8u201-linux-x64.tar.gz centos-java:/usr/local/java
      
      // 进入容器解压jdk包
      [root@centos ~]# docker exec -it centos-java /bin/bash
      [root@e9f51744a9b9 /]# cd /usr/local/java/
      [root@e9f51744a9b9 java]# tar -zxvf jdk-8u201-linux-x64.tar.gz
      [root@e9f51744a9b9 java]# ls
      jdk-8u201-linux-x64.tar.gz  jdk1.8.0_201
      
      // 在容器内配置java环境变量
      [root@e9f51744a9b9 java]# vi /etc/profile
      
          ## java
          export JAVA_HOME=/usr/local/java/jdk1.8.0_201
          export JRE_HOME=$JAVA_HOME/jre
          export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
          export PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
      
      [root@e9f51744a9b9 java]# source /etc/profile
      
      // 在容器内测试java环境
      [root@e9f51744a9b9 java]# java -version
      java version "1.8.0_201"
      Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
      Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)
      
      // 在容器内测试java程序运行
      [root@e9f51744a9b9 java]# vi Test.java
      
          public class Test {
              public static void main(String[] args) {
                  System.out.println("Hello Java..");
              }
          }
      
      [root@e9f51744a9b9 java]# javac Test.java
      [root@e9f51744a9b9 java]# java Test
      Hello Java..

      // 退出容器
      [root@e9f51744a9b9 java]# exit
      exit

- 通过以下命令将容器保存为镜像

      [root@centos ~]# docker commit centos-java centos-java8
      sha256:4bfb1a2b306e0b0e167eeab06d272e744911eb4310dbd7dacbf7b56032de5e5b
      
      [root@centos ~]# docker images
      REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
      centos-java8   latest    4bfb1a2b306e   59 seconds ago   820MB
      nginx          1.23      3f8a00f137a0   13 days ago      142MB
      mysql          5.7       be16cf2d832a   3 weeks ago      455MB
      centos         centos8   5d0da3dc9764   17 months ago    231MB

- 基于新创建的镜像创建容器

      [root@centos ~]# docker run -di --name=centos-java8 centos-java8
      8c8ccdc3b93365b0685e82b655b1a840f9e6d0226ad0d2d590d604607b049761
      
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS          PORTS     NAMES
      8c8ccdc3b933   centos-java8     "/bin/bash"   16 seconds ago   Up 15 seconds             centos-java8
      e9f51744a9b9   centos:centos8   "/bin/bash"   56 minutes ago   Up 56 minutes             centos-java
      b2df06fed844   centos:centos8   "/bin/bash"   46 hours ago     Up 27 hours               centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   46 hours ago     Up 26 hours               centos
      
      [root@centos ~]# docker exec -it centos-java8 /bin/bash
      [root@8c8ccdc3b933 /]# source /etc/profile
      [root@8c8ccdc3b933 /]# cd /usr/local/java/
      [root@8c8ccdc3b933 java]# ls
      Test.class  Test.java  jdk-8u201-linux-x64.tar.gz  jdk1.8.0_201
      [root@8c8ccdc3b933 java]# java Test
      Hello Java..

## 镜像备份

    [root@centos ~]# docker save -o centos-java8-image.tar centos-java8    
    [root@centos ~]# ll -h centos-java8-image.tar
    -rw------- 1 root root 790M 2月  23 11:13 centos-java8-image.tar

## 镜像恢复

    [root@centos ~]# docker images
    REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
    nginx        1.23      3f8a00f137a0   13 days ago     142MB
    mysql        5.7       be16cf2d832a   3 weeks ago     455MB
    centos       centos8   5d0da3dc9764   17 months ago   231MB
    
    // 镜像恢复
    [root@centos ~]# docker load -i centos-java8-image.tar
    be20db818ac6: Loading layer [==================================================>]  589.8MB/589.8MB
    Loaded image: centos-java8:latest
    
    [root@centos ~]# docker images
    REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
    centos-java8   latest    4bfb1a2b306e   16 hours ago    820MB
    nginx          1.23      3f8a00f137a0   13 days ago     142MB
    mysql          5.7       be16cf2d832a   3 weeks ago     455MB
    centos         centos8   5d0da3dc9764   17 months ago   231MB

# 完