# 04-Docker-应用部署

总体步骤：
- 搜索镜像
- 拉取镜像
- 查看镜像
- 启动容器
- 停止容器
- 移除容器

## MySQL 部署

    [root@centos ~]# docker images
    REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
    mysql         5.7       be16cf2d832a   3 weeks ago     455MB
    
    [root@centos ~]# docker run -d -p 33060:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql-33060 mysql:5.7
    1c9aa9ae1db729e8e8900100b94bbad3fe5ab2049c1997ebeb10fbf31864962f
    
    [root@centos ~]# docker ps -a
    CONTAINER ID   IMAGE            COMMAND                   CREATED         STATUS         PORTS                                                    NAMES
    1c9aa9ae1db7   mysql:5.7        "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   33060/tcp, 0.0.0.0:33060->3306/tcp, :::33060->3306/tcp   mysql-33060
    
    [root@centos ~]# docker stop mysql-33060
    mysql-33060
    
    [root@centos ~]# docker ps -a
    CONTAINER ID   IMAGE            COMMAND                   CREATED         STATUS                      PORTS                                   NAMES
    1c9aa9ae1db7   mysql:5.7        "docker-entrypoint.s…"   7 minutes ago   Exited (0) 23 seconds ago                                           mysql-33060
    
    [root@centos ~]# docker rm mysql-33060
    mysql-33060
    
    [root@centos ~]# docker ps -a
    CONTAINER ID   IMAGE            COMMAND                   CREATED        STATUS        PORTS                                   NAMES

# 完