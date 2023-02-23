# 07-Docker-私有仓库

`Docker` 官方提供了一个搭建私有仓库的镜像 `registry` ，把镜像下载下来，运行容器并暴露 `5000` 端口就可以使用了。

    // 获取私有仓库镜像
    [root@centos ~]# docker pull registry:2
    2: Pulling from library/registry
    ef5531b6e74e: Pull complete
    a52704366974: Pull complete
    dda5a8ba6f46: Pull complete
    eb9a2e8a8f76: Pull complete
    25bb6825962e: Pull complete
    Digest: sha256:3f71055ad7c41728e381190fee5c4cf9b8f7725839dcf5c0fe3e5e20dc5db1fa
    Status: Downloaded newer image for registry:2
    docker.io/library/registry:2
    
    // 运行私有仓库镜像
    [root@centos ~]# docker run -d -p 5000:5000 --restart always --name registry registry:2
    f3dd311c25e089cf82c721e0f0fcb4a00916544e97d6ff0a6fd0964805ff6b72
    
    [root@centos ~]# docker ps -a
    CONTAINER ID   IMAGE            COMMAND                   CREATED          STATUS              PORTS                                       NAMES
    f3dd311c25e0   registry:2       "/entrypoint.sh /etc…"   9 seconds ago    Up 8 seconds    0.0.0.    0:5000->5000/tcp, :::5000->5000/tcp   registry
    
    // 把 Docker Hub 中的 ubuntu 镜像下载下来
    [root@centos ~]# docker pull ubuntu
    Using default tag: latest
    latest: Pulling from library/ubuntu
    677076032cca: Pull complete
    Digest: sha256:9a0bdde4188b896a372804be2384015e90e3f84906b750c1a53539b585fbbe7f
    Status: Downloaded newer image for ubuntu:latest
    docker.io/library/ubuntu:latest
    
    // 把 ubuntu 镜像推送到私有仓库
    [root@centos ~]# docker tag ubuntu localhost:5000/ubuntu
    [root@centos ~]# docker push localhost:5000/ubuntu
    Using default tag: latest
    The push refers to repository [localhost:5000/ubuntu]
    c5ff2d88f679: Pushed
    latest: digest: sha256:e6987feeb4f79e553bf07738ec908fde797c008941dcadf569b993c607a9cc55 size: 529
    
    // 把本地构建的 centos-jdk:8 镜像推送到私有仓库
    [root@centos ~]# docker tag centos-jdk:8 localhost:5000/centos-jdk:8
    [root@centos ~]# docker push localhost:5000/centos-jdk:8
    The push refers to repository [localhost:5000/centos-jdk]
    858e97057c62: Pushed
    2b2502d724fa: Pushed
    74ddd0ec08fa: Pushed
    8: digest: sha256:96f90fa21741313de273ca001d7ec6a3af00c4e9d8dae25f072e50cccc59dcfb size: 949
    
    // 从私有仓库下载镜像
    [root@centos ~]# docker pull localhost:5000/centos-jdk:8
    8: Pulling from centos-jdk
    Digest: sha256:96f90fa21741313de273ca001d7ec6a3af00c4e9d8dae25f072e50cccc59dcfb
    Status: Image is up to date for localhost:5000/centos-jdk:8
    localhost:5000/centos-jdk:8

访问 http://localhost:5000/v2/_catalog 可以看到私有仓库中的镜像：

    {"repositories":["centos-jdk","ubuntu"]}

`Docker` 官方的私有仓库 `registry` 没有界面。

`harbor` 私有仓库是有界面的：

[https://goharbor.io](https://goharbor.io)

[https://github.com/goharbor/harbor](https://github.com/goharbor/harbor)


# 完