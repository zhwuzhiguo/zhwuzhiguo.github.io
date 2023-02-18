# 01-安装Docker

## CentOS 安装 Docker Engine

[参考官方文档](https://docs.docker.com/engine/install/centos/)

通过仓库安装：

- 设置仓库

      // 安装 yum-utils
      // 包含 yum-config-manager
      sudo yum install -y yum-utils

      // 配置 docker 仓库
      sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

- 安装 Docker Engine

      // 安装最新版
      sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

- 启动 Docker
 
      sudo systemctl start docker

- 验证 Docker 安装成功

      // 运行镜像 hello-world
      sudo docker run hello-world

- 设置 Docker 开机启动 

      sudo systemctl enable docker.service
      sudo systemctl enable containerd.service

## CentOS 安装实例

    [root@centos ~]# sudo yum install -y yum-utils
    上次元数据过期检查：3:00:57 前，执行于 2023年02月18日 星期六 12时15分24秒。
    依赖关系解决。
    ==================================================================================================================================================================================
     软件包                                      架构                                     版本                                           仓库                                    大小
    ==================================================================================================================================================================================
    安装:
     yum-utils                                   noarch                                   4.0.21-3.el8                                   base                                    73 k
    
    事务概要
    ==================================================================================================================================================================================
    安装  1 软件包
    
    总下载：73 k
    安装大小：22 k
    下载软件包：
    yum-utils-4.0.21-3.el8.noarch.rpm                                                                                                                 793 kB/s |  73 kB     00:00
    ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    总计                                                                                                                                              785 kB/s |  73 kB     00:00
    运行事务检查
    事务检查成功。
    运行事务测试
    事务测试成功。
    运行事务
      准备中  :                                                                                                                                                                   1/1
      安装    : yum-utils-4.0.21-3.el8.noarch                                                                                                                                     1/1
      运行脚本: yum-utils-4.0.21-3.el8.noarch                                                                                                                                     1/1
      验证    : yum-utils-4.0.21-3.el8.noarch                                                                                                                                     1/1
    
    已安装:
      yum-utils-4.0.21-3.el8.noarch
    
    完毕！
    
    [root@centos ~]# sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    添加仓库自：https://download.docker.com/linux/centos/docker-ce.repo
    
    [root@centos ~]# sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    上次元数据过期检查：0:01:01 前，执行于 2023年02月18日 星期六 15时19分12秒。
    依赖关系解决。
    ==================================================================================================================================================================================
     软件包                                        架构                       版本                                                         仓库                                  大小
    ==================================================================================================================================================================================
    安装:
     containerd.io                                 x86_64                     1.6.18-3.1.el8                                               docker-ce-stable                      34 M
     docker-buildx-plugin                          x86_64                     0.10.2-1.el8                                                 docker-ce-stable                      12 M
     docker-ce                                     x86_64                     3:23.0.1-1.el8                                               docker-ce-stable                      23 M
     docker-ce-cli                                 x86_64                     1:23.0.1-1.el8                                               docker-ce-stable                     7.1 M
     docker-compose-plugin                         x86_64                     2.16.0-1.el8                                                 docker-ce-stable                      11 M
    安装依赖关系:
     container-selinux                             noarch                     2:2.167.0-1.module_el8.5.0+911+f19012f9                      AppStream                             54 k
     docker-ce-rootless-extras                     x86_64                     23.0.1-1.el8                                                 docker-ce-stable                     4.7 M
     fuse-common                                   x86_64                     3.2.1-12.el8                                                 base                                  21 k
     fuse-overlayfs                                x86_64                     1.7.1-1.module_el8.5.0+890+6b136101                          AppStream                             73 k
     fuse3                                         x86_64                     3.2.1-12.el8                                                 base                                  50 k
     fuse3-libs                                    x86_64                     3.2.1-12.el8                                                 base                                  94 k
     libcgroup                                     x86_64                     0.41-19.el8                                                  base                                  70 k
     libslirp                                      x86_64                     4.4.0-1.module_el8.5.0+890+6b136101                          AppStream                             70 k
     slirp4netns                                   x86_64                     1.1.8-1.module_el8.5.0+890+6b136101                          AppStream                             51 k
    安装弱的依赖:
     docker-scan-plugin                            x86_64                     0.23.0-3.el8                                                 docker-ce-stable                     3.8 M
    启用模块流:
     container-tools                                                          rhel8
    
    事务概要
    ==================================================================================================================================================================================
    安装  15 软件包
    
    总下载：96 M
    安装大小：362 M
    确定吗？[y/N]： y
    下载软件包：
    (1/15): fuse-common-3.2.1-12.el8.x86_64.rpm                                                                                                       2.1 MB/s |  21 kB     00:00
    (2/15): libcgroup-0.41-19.el8.x86_64.rpm                                                                                                          972 kB/s |  70 kB     00:00
    (3/15): container-selinux-2.167.0-1.module_el8.5.0+911+f19012f9.noarch.rpm                                                                        7.6 MB/s |  54 kB     00:00
    (4/15): fuse3-3.2.1-12.el8.x86_64.rpm                                                                                                             513 kB/s |  50 kB     00:00
    (5/15): fuse3-libs-3.2.1-12.el8.x86_64.rpm                                                                                                        755 kB/s |  94 kB     00:00
    (6/15): fuse-overlayfs-1.7.1-1.module_el8.5.0+890+6b136101.x86_64.rpm                                                                             1.0 MB/s |  73 kB     00:00
    (7/15): libslirp-4.4.0-1.module_el8.5.0+890+6b136101.x86_64.rpm                                                                                   755 kB/s |  70 kB     00:00
    (8/15): slirp4netns-1.1.8-1.module_el8.5.0+890+6b136101.x86_64.rpm                                                                                750 kB/s |  51 kB     00:00
    (9/15): docker-buildx-plugin-0.10.2-1.el8.x86_64.rpm                                                                                              5.4 MB/s |  12 MB     00:02
    (10/15): docker-ce-cli-23.0.1-1.el8.x86_64.rpm                                                                                                    4.5 MB/s | 7.1 MB     00:01
    (11/15): docker-ce-rootless-extras-23.0.1-1.el8.x86_64.rpm                                                                                        4.2 MB/s | 4.7 MB     00:01
    (12/15): docker-ce-23.0.1-1.el8.x86_64.rpm                                                                                                        4.5 MB/s |  23 MB     00:05
    (13/15): docker-scan-plugin-0.23.0-3.el8.x86_64.rpm                                                                                               3.2 MB/s | 3.8 MB     00:01
    (14/15): docker-compose-plugin-2.16.0-1.el8.x86_64.rpm                                                                                            4.9 MB/s |  11 MB     00:02
    (15/15): containerd.io-1.6.18-3.1.el8.x86_64.rpm                                                                                                  4.3 MB/s |  34 MB     00:07
    ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    总计                                                                                                                                               12 MB/s |  96 MB     00:08
    Docker CE Stable - x86_64                                                                                                                         7.7 kB/s | 1.6 kB     00:00
    导入 GPG 公钥 0x621E9F35:
     Userid: "Docker Release (CE rpm) <docker@docker.com>"
     指纹: 060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35
     来自: https://download.docker.com/linux/centos/gpg
    确定吗？[y/N]： y
    导入公钥成功
    运行事务检查
    事务检查成功。
    运行事务测试
    事务测试成功。
    运行事务
      准备中  :                                                                                                                                                                   1/1
      安装    : docker-scan-plugin-0.23.0-3.el8.x86_64                                                                                                                           1/15
      运行脚本: docker-scan-plugin-0.23.0-3.el8.x86_64                                                                                                                           1/15
      安装    : docker-compose-plugin-2.16.0-1.el8.x86_64                                                                                                                        2/15
      运行脚本: docker-compose-plugin-2.16.0-1.el8.x86_64                                                                                                                        2/15
      运行脚本: container-selinux-2:2.167.0-1.module_el8.5.0+911+f19012f9.noarch                                                                                                 3/15
      安装    : container-selinux-2:2.167.0-1.module_el8.5.0+911+f19012f9.noarch                                                                                                 3/15
      运行脚本: container-selinux-2:2.167.0-1.module_el8.5.0+911+f19012f9.noarch                                                                                                 3/15
      安装    : containerd.io-1.6.18-3.1.el8.x86_64                                                                                                                              4/15
      运行脚本: containerd.io-1.6.18-3.1.el8.x86_64                                                                                                                              4/15
      安装    : docker-buildx-plugin-0.10.2-1.el8.x86_64                                                                                                                         5/15
      运行脚本: docker-buildx-plugin-0.10.2-1.el8.x86_64                                                                                                                         5/15
      安装    : docker-ce-cli-1:23.0.1-1.el8.x86_64                                                                                                                              6/15
      运行脚本: docker-ce-cli-1:23.0.1-1.el8.x86_64                                                                                                                              6/15
      安装    : libslirp-4.4.0-1.module_el8.5.0+890+6b136101.x86_64                                                                                                              7/15
      安装    : slirp4netns-1.1.8-1.module_el8.5.0+890+6b136101.x86_64                                                                                                           8/15
      运行脚本: libcgroup-0.41-19.el8.x86_64                                                                                                                                     9/15
      安装    : libcgroup-0.41-19.el8.x86_64                                                                                                                                     9/15
      运行脚本: libcgroup-0.41-19.el8.x86_64                                                                                                                                     9/15
      安装    : fuse3-libs-3.2.1-12.el8.x86_64                                                                                                                                  10/15
      运行脚本: fuse3-libs-3.2.1-12.el8.x86_64                                                                                                                                  10/15
      安装    : fuse-common-3.2.1-12.el8.x86_64                                                                                                                                 11/15
      安装    : fuse3-3.2.1-12.el8.x86_64                                                                                                                                       12/15
      安装    : fuse-overlayfs-1.7.1-1.module_el8.5.0+890+6b136101.x86_64                                                                                                       13/15
      运行脚本: fuse-overlayfs-1.7.1-1.module_el8.5.0+890+6b136101.x86_64                                                                                                       13/15
      安装    : docker-ce-3:23.0.1-1.el8.x86_64                                                                                                                                 14/15
      运行脚本: docker-ce-3:23.0.1-1.el8.x86_64                                                                                                                                 14/15
      安装    : docker-ce-rootless-extras-23.0.1-1.el8.x86_64                                                                                                                   15/15
      运行脚本: docker-ce-rootless-extras-23.0.1-1.el8.x86_64                                                                                                                   15/15
      运行脚本: container-selinux-2:2.167.0-1.module_el8.5.0+911+f19012f9.noarch                                                                                                15/15
      运行脚本: docker-ce-rootless-extras-23.0.1-1.el8.x86_64                                                                                                                   15/15
      验证    : fuse-common-3.2.1-12.el8.x86_64                                                                                                                                  1/15
      验证    : fuse3-3.2.1-12.el8.x86_64                                                                                                                                        2/15
      验证    : fuse3-libs-3.2.1-12.el8.x86_64                                                                                                                                   3/15
      验证    : libcgroup-0.41-19.el8.x86_64                                                                                                                                     4/15
      验证    : container-selinux-2:2.167.0-1.module_el8.5.0+911+f19012f9.noarch                                                                                                 5/15
      验证    : fuse-overlayfs-1.7.1-1.module_el8.5.0+890+6b136101.x86_64                                                                                                        6/15
      验证    : libslirp-4.4.0-1.module_el8.5.0+890+6b136101.x86_64                                                                                                              7/15
      验证    : slirp4netns-1.1.8-1.module_el8.5.0+890+6b136101.x86_64                                                                                                           8/15
      验证    : containerd.io-1.6.18-3.1.el8.x86_64                                                                                                                              9/15
      验证    : docker-buildx-plugin-0.10.2-1.el8.x86_64                                                                                                                        10/15
      验证    : docker-ce-3:23.0.1-1.el8.x86_64                                                                                                                                 11/15
      验证    : docker-ce-cli-1:23.0.1-1.el8.x86_64                                                                                                                             12/15
      验证    : docker-ce-rootless-extras-23.0.1-1.el8.x86_64                                                                                                                   13/15
      验证    : docker-compose-plugin-2.16.0-1.el8.x86_64                                                                                                                       14/15
      验证    : docker-scan-plugin-0.23.0-3.el8.x86_64                                                                                                                          15/15
    
    已安装:
      container-selinux-2:2.167.0-1.module_el8.5.0+911+f19012f9.noarch  containerd.io-1.6.18-3.1.el8.x86_64                  docker-buildx-plugin-0.10.2-1.el8.x86_64
      docker-ce-3:23.0.1-1.el8.x86_64                                   docker-ce-cli-1:23.0.1-1.el8.x86_64                  docker-ce-rootless-extras-23.0.1-1.el8.x86_64
      docker-compose-plugin-2.16.0-1.el8.x86_64                         docker-scan-plugin-0.23.0-3.el8.x86_64               fuse-common-3.2.1-12.el8.x86_64
      fuse-overlayfs-1.7.1-1.module_el8.5.0+890+6b136101.x86_64         fuse3-3.2.1-12.el8.x86_64                            fuse3-libs-3.2.1-12.el8.x86_64
      libcgroup-0.41-19.el8.x86_64                                      libslirp-4.4.0-1.module_el8.5.0+890+6b136101.x86_64  slirp4netns-1.1.8-1.module_el8.5.0+890+6b136101.x86_64
    
    完毕！
    
    [root@centos ~]# sudo systemctl start docker
    
    [root@centos ~]# sudo docker run hello-world
    Unable to find image 'hello-world:latest' locally
    latest: Pulling from library/hello-world
    2db29710123e: Pull complete
    Digest: sha256:6e8b6f026e0b9c419ea0fd02d3905dd0952ad1feea67543f525c73a0a790fefb
    Status: Downloaded newer image for hello-world:latest
    
    Hello from Docker!
    This message shows that your installation appears to be working correctly.
    
    To generate this message, Docker took the following steps:
     1. The Docker client contacted the Docker daemon.
     2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
        (amd64)
     3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you are currently reading.
     4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.
    
    To try something more ambitious, you can run an Ubuntu container with:
     $ docker run -it ubuntu bash
    
    Share images, automate workflows, and more with a free Docker ID:
     https://hub.docker.com/
    
    For more examples and ideas, visit:
     https://docs.docker.com/get-started/
    
    [root@centos ~]# sudo systemctl enable docker.service
    Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr/lib/systemd/system/docker.service.
    [root@centos ~]# sudo systemctl enable containerd.service
    Created symlink /etc/systemd/system/multi-user.target.wants/containerd.service → /usr/lib/systemd/system/containerd.service.
    
    [root@centos ~]# ps -ef | grep docker
    root      629493       1  0 15:24 ?        00:00:00 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
    root      630009  602478  0 15:41 pts/0    00:00:00 grep --color=auto docker
    
    [root@centos ~]#


# 完