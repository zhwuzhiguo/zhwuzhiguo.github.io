# 03-Docker-命令-容器命令

## 容器命令

### 查看容器

- 查看正在运行的容器

      [root@centos ~]# docker ps
      CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS          PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   24 minutes ago   Up 24 minutes             centos-daemon

- 查看所有容器

      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS                      PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   24 minutes ago   Up 24 minutes                         centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   41 minutes ago   Exited (0) 39 minutes ago             centos

- 查看最后一次运行的容器

      [root@centos ~]# docker ps -l
      CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS          PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   24 minutes ago   Up 24 minutes             centos-daemon

- 查看停止的容器

      [root@centos ~]# docker ps -f status=exited
      CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS                      PORTS     NAMES
      6cffb2f2757b   centos:centos8   "/bin/bash"   41 minutes ago   Exited (0) 39 minutes ago             centos

### 创建与启动容器

创建容器的命令：

    docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

OPTIONS:
- --name=container-name : 指定容器名称
- -d : 创建守护式容器在后台运行，并返回容器ID
- -i : 以交互模式运行容器，通常与 -t 同时使用
- -t : 容器启动后会进入其命令行，通常与 -i 同时使用
- -p host-port:container-port : 端口映射(宿主机端口:容器端口)，可以使用多个 -p 做多个端口映射

- 启动交互式容器

      [root@centos ~]# docker run -it --name=centos centos:centos8
      [root@6cffb2f2757b /]# exit
      exit
      
      [root@centos ~]# docker run -it centos:centos8
      [root@6af8b020b886 /]# exit
      exit
      
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED          STATUS                      PORTS     NAMES
      6af8b020b886   centos:centos8   "/bin/bash"   25 seconds ago   Exited (0) 2 seconds ago              gracious_wilbur
      6cffb2f2757b   centos:centos8   "/bin/bash"   2 minutes ago    Exited (0) 56 seconds ago             centos

- 退出当前容器

      exit

- 启动守护式容器

      [root@centos ~]# docker run -di --name=centos-daemon centos:centos8
      b2df06fed84454c47d25526ca3f5a360af89a7e996ab09c24e0f6d076bb21569
      
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED              STATUS                      PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   About a minute ago   Up About a minute                     centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   17 minutes ago       Exited (0) 16 minutes ago             centos

- 登录守护式容器

      [root@centos ~]# docker exec -it centos-daemon /bin/bash
      [root@b2df06fed844 /]# exit
      exit
      
      [root@centos ~]# docker exec -it b2df06fed844 /bin/bash
      [root@b2df06fed844 /]# exit
      exit

### 停止与启动容器

- 停止容器

      [root@centos ~]# docker stop centos
      centos
      [root@centos ~]# docker stop b2df06fed844
      b2df06fed844
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED        STATUS                       PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   19 hours ago   Exited (137) 7 seconds ago             centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   19 hours ago   Exited (0) 27 seconds ago              centos

- 启动容器

      [root@centos ~]# docker start centos
      centos
      [root@centos ~]# docker start b2df06fed844
      b2df06fed844
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED        STATUS          PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   19 hours ago   Up 3 seconds              centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   19 hours ago   Up 15 seconds             centos

- 重启容器

      [root@centos ~]# docker restart centos
      centos
      [root@centos ~]# docker restart b2df06fed844
      b2df06fed844
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED        STATUS          PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   19 hours ago   Up 12 seconds             centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   19 hours ago   Up 30 seconds             centos

- 强制停止容器

      [root@centos ~]# docker kill centos
      centos
      [root@centos ~]# docker kill b2df06fed844
      b2df06fed844
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND       CREATED        STATUS                        PORTS     NAMES
      b2df06fed844   centos:centos8   "/bin/bash"   19 hours ago   Exited (137) 2 seconds ago              centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"   19 hours ago   Exited (137) 10 seconds ago             centos

### 文件拷贝

    // 拷贝文件到容器-使用容器名
    [root@centos ~]# docker cp ./test.txt centos-daemon:/test
    Successfully copied 2.048kB to centos-daemon:/test
    
    // 拷贝文件到容器-使用容器名-重命名文件
    [root@centos ~]# docker cp ./test.txt centos-daemon:/test/test2.txt
    Successfully copied 2.048kB to centos-daemon:/test/test2.txt
    
    // 拷贝文件到容器-使用容器ID
    [root@centos ~]# docker cp ./test.txt b2df06fed844:/root
    Successfully copied 2.048kB to b2df06fed844:/root
    
    // 拷贝文件到容器-使用容器名-重命名文件
    [root@centos ~]# docker cp ./test.txt b2df06fed844:/root/test2.txt
    Successfully copied 2.048kB to b2df06fed844:/root/test2.txt
    
    [root@centos ~]# docker exec -it centos-daemon /bin/bash
    [root@b2df06fed844 /]# ls -l test/
    total 8
    -rw-r--r-- 1 root root 21 Feb 21 08:34 test.txt
    -rw-r--r-- 1 root root 21 Feb 21 08:34 test2.txt
    
    // 从容器内拷贝文件
    [root@centos ~]# docker cp centos-daemon:/test/test-container.txt .
    Preparing to copy...
    Successfully copied 2.048kB to /root/.

### 目录+数据卷创建+挂载

数据卷(volume) 是一个虚拟目录，指向宿主机文件系统中的某个目录。

一旦完成数据卷挂载，对容器的一切操作都会作用在数据卷对应的宿主机目录了。

- 数据卷操作

  基本语法：

      docker volume [COMMAND]
  
  创建数据卷：

      [root@centos ~]# docker volume create html
      html
      [root@centos ~]# ll /var/lib/docker/volumes/
      总用量 24
      brw------- 1 root root 253, 3 2月  18 15:55 backingFsBlockDev
      drwx-----x 3 root root     19 2月  22 11:25 html
      -rw------- 1 root root  32768 2月  22 11:25 metadata.db

  查看所有数据：

      [root@centos ~]# docker volume ls
      DRIVER    VOLUME NAME
      local     html

  查看数据卷详细信息：

      [root@centos ~]# docker volume inspect html
      [
          {
              "CreatedAt": "2023-02-22T11:25:03+08:00",
              "Driver": "local",
              "Labels": null,
              "Mountpoint": "/var/lib/docker/volumes/html/_data",
              "Name": "html",
              "Options": null,
              "Scope": "local"
          }
      ]

  删除未使用的数据卷：

      [root@centos ~]# docker volume prune
      WARNING! This will remove all local volumes not used by at least one container.
      Are you sure you want to continue? [y/N] y
      Total reclaimed space: 0B

  删除数据卷：

      [root@centos ~]# docker volume rm html
      html
      [root@centos ~]# docker volume ls
      DRIVER    VOLUME NAME

- 挂载数据卷

      [root@centos ~]# docker run -d -p 8888:80 -v html:/usr/share/nginx/html --name nginx nginx:1.23
      984b902264ca27dd0745b6092a075ca99aa0bc80be2c4f96a66bc14144fcc235
      
      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND                   CREATED         STATUS         PORTS                                   NAMES
      984b902264ca   nginx:1.23       "/docker-entrypoint.…"   2 seconds ago   Up 2 seconds   0.0.0.0:8888->80/tcp, :::8888->80/tcp   nginx
      b2df06fed844   centos:centos8   "/bin/bash"               39 hours ago    Up 20 hours                                            centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"               39 hours ago    Up 19 hours                                            centos

- 挂载目录

      [root@centos ~]# docker run -d -p 8888:80 -v /root/html:/usr/share/nginx/html --name nginx nginx:1.23
      a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca

      [root@centos ~]# docker ps -a
      CONTAINER ID   IMAGE            COMMAND                   CREATED         STATUS         PORTS                                   NAMES
      a040190efd33   nginx:1.23       "/docker-entrypoint.…"   7 seconds ago   Up 6 seconds   0.0.0.0:8888->80/tcp, :::8888->80/tcp   nginx
      b2df06fed844   centos:centos8   "/bin/bash"               39 hours ago    Up 20 hours                                            centos-daemon
      6cffb2f2757b   centos:centos8   "/bin/bash"               39 hours ago    Up 19 hours                                            centos

### 查看容器ip地址

    [root@centos ~]# docker inspect nginx
    [
        {
            "Id": "a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca",
            "Created": "2023-02-22T04:15:50.990170224Z",
            "Path": "/docker-entrypoint.sh",
            "Args": [
                "nginx",
                "-g",
                "daemon off;"
            ],
            "State": {
                "Status": "running",
                "Running": true,
                "Paused": false,
                "Restarting": false,
                "OOMKilled": false,
                "Dead": false,
                "Pid": 18759,
                "ExitCode": 0,
                "Error": "",
                "StartedAt": "2023-02-22T04:15:51.26642334Z",
                "FinishedAt": "0001-01-01T00:00:00Z"
            },
            "Image": "sha256:3f8a00f137a0d2c8a2163a09901e28e2471999fde4efc2f9570b91f1c30acf94",
            "ResolvConfPath": "/var/lib/docker/containers/a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca/resolv.conf",
            "HostnamePath": "/var/lib/docker/containers/a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca/hostname",
            "HostsPath": "/var/lib/docker/containers/a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca/hosts",
            "LogPath": "/var/lib/docker/containers/a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca/a040190efd333973f992e18191c5792d1311f308b608dfced5dfe4c57fc5cdca-json.log",
            "Name": "/nginx",
            "RestartCount": 0,
            "Driver": "overlay2",
            "Platform": "linux",
            "MountLabel": "",
            "ProcessLabel": "",
            "AppArmorProfile": "",
            "ExecIDs": null,
            "HostConfig": {
                "Binds": [
                    "/root/html:/usr/share/nginx/html"
                ],
                "ContainerIDFile": "",
                "LogConfig": {
                    "Type": "json-file",
                    "Config": {}
                },
                "NetworkMode": "default",
                "PortBindings": {
                    "80/tcp": [
                        {
                            "HostIp": "",
                            "HostPort": "8888"
                        }
                    ]
                },
                "RestartPolicy": {
                    "Name": "no",
                    "MaximumRetryCount": 0
                },
                "AutoRemove": false,
                "VolumeDriver": "",
                "VolumesFrom": null,
                "ConsoleSize": [
                    49,
                    238
                ],
                "CapAdd": null,
                "CapDrop": null,
                "CgroupnsMode": "host",
                "Dns": [],
                "DnsOptions": [],
                "DnsSearch": [],
                "ExtraHosts": null,
                "GroupAdd": null,
                "IpcMode": "private",
                "Cgroup": "",
                "Links": null,
                "OomScoreAdj": 0,
                "PidMode": "",
                "Privileged": false,
                "PublishAllPorts": false,
                "ReadonlyRootfs": false,
                "SecurityOpt": null,
                "UTSMode": "",
                "UsernsMode": "",
                "ShmSize": 67108864,
                "Runtime": "runc",
                "Isolation": "",
                "CpuShares": 0,
                "Memory": 0,
                "NanoCpus": 0,
                "CgroupParent": "",
                "BlkioWeight": 0,
                "BlkioWeightDevice": [],
                "BlkioDeviceReadBps": [],
                "BlkioDeviceWriteBps": [],
                "BlkioDeviceReadIOps": [],
                "BlkioDeviceWriteIOps": [],
                "CpuPeriod": 0,
                "CpuQuota": 0,
                "CpuRealtimePeriod": 0,
                "CpuRealtimeRuntime": 0,
                "CpusetCpus": "",
                "CpusetMems": "",
                "Devices": [],
                "DeviceCgroupRules": null,
                "DeviceRequests": null,
                "MemoryReservation": 0,
                "MemorySwap": 0,
                "MemorySwappiness": null,
                "OomKillDisable": false,
                "PidsLimit": null,
                "Ulimits": null,
                "CpuCount": 0,
                "CpuPercent": 0,
                "IOMaximumIOps": 0,
                "IOMaximumBandwidth": 0,
                "MaskedPaths": [
                    "/proc/asound",
                    "/proc/acpi",
                    "/proc/kcore",
                    "/proc/keys",
                    "/proc/latency_stats",
                    "/proc/timer_list",
                    "/proc/timer_stats",
                    "/proc/sched_debug",
                    "/proc/scsi",
                    "/sys/firmware"
                ],
                "ReadonlyPaths": [
                    "/proc/bus",
                    "/proc/fs",
                    "/proc/irq",
                    "/proc/sys",
                    "/proc/sysrq-trigger"
                ]
            },
            "GraphDriver": {
                "Data": {
                    "LowerDir": "/var/lib/docker/overlay2/a9c327fb13ec0c85cb385730c623a20816f905a95f6201826e89f7611686738e-init/diff:/var/lib/docker/overlay2/3cf1a9a030ecbcd57a6d55f9ad28c26e889813f36a47265f439f2ec965076b65/diff:/var/lib/docker/overlay2/e7c5e58f5bce14cdfc69d9d0b70d3b8a62ec2eeb3f972868f6bbf8166a9e516f/diff:/var/lib/docker/overlay2/38088e5f4d950c3cf839df0e06ede02fd10b81ff2bad758242a196259ea8d245/diff:/var/lib/docker/overlay2/6f01061e9cfa64bf70872d637f38e021fafa33c2a4ed98dcc8f74da1aaf0d839/diff:/var/lib/docker/overlay2/aea6cea6b7df1248f1149ba77ab5df3bd7c4e3233909052e8d770e78d01fb287/diff:/var/lib/docker/overlay2/a8a97ba6e326f74e3f3005e1c5c1d6e0db76552c3e097a6698ac354fa0bad54b/diff",
                    "MergedDir": "/var/lib/docker/overlay2/a9c327fb13ec0c85cb385730c623a20816f905a95f6201826e89f7611686738e/merged",
                    "UpperDir": "/var/lib/docker/overlay2/a9c327fb13ec0c85cb385730c623a20816f905a95f6201826e89f7611686738e/diff",
                    "WorkDir": "/var/lib/docker/overlay2/a9c327fb13ec0c85cb385730c623a20816f905a95f6201826e89f7611686738e/work"
                },
                "Name": "overlay2"
            },
            "Mounts": [
                {
                    "Type": "bind",
                    "Source": "/root/html",
                    "Destination": "/usr/share/nginx/html",
                    "Mode": "",
                    "RW": true,
                    "Propagation": "rprivate"
                }
            ],
            "Config": {
                "Hostname": "a040190efd33",
                "Domainname": "",
                "User": "",
                "AttachStdin": false,
                "AttachStdout": false,
                "AttachStderr": false,
                "ExposedPorts": {
                    "80/tcp": {}
                },
                "Tty": false,
                "OpenStdin": false,
                "StdinOnce": false,
                "Env": [
                    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                    "NGINX_VERSION=1.23.3",
                    "NJS_VERSION=0.7.9",
                    "PKG_RELEASE=1~bullseye"
                ],
                "Cmd": [
                    "nginx",
                    "-g",
                    "daemon off;"
                ],
                "Image": "nginx:1.23",
                "Volumes": null,
                "WorkingDir": "",
                "Entrypoint": [
                    "/docker-entrypoint.sh"
                ],
                "OnBuild": null,
                "Labels": {
                    "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
                },
                "StopSignal": "SIGQUIT"
            },
            "NetworkSettings": {
                "Bridge": "",
                "SandboxID": "dabcf7a8b153ba5f93d8fdb5b470732a623e0939ea0e54d83583eb9a5f42b441",
                "HairpinMode": false,
                "LinkLocalIPv6Address": "",
                "LinkLocalIPv6PrefixLen": 0,
                "Ports": {
                    "80/tcp": [
                        {
                            "HostIp": "0.0.0.0",
                            "HostPort": "8888"
                        },
                        {
                            "HostIp": "::",
                            "HostPort": "8888"
                        }
                    ]
                },
                "SandboxKey": "/var/run/docker/netns/dabcf7a8b153",
                "SecondaryIPAddresses": null,
                "SecondaryIPv6Addresses": null,
                "EndpointID": "a583848b04513f41405e9d2ae22c64416ea3ee01cefc5c1d0f5e7dc2ab7ba652",
                "Gateway": "172.18.0.1",
                "GlobalIPv6Address": "",
                "GlobalIPv6PrefixLen": 0,
                "IPAddress": "172.18.0.4",
                "IPPrefixLen": 16,
                "IPv6Gateway": "",
                "MacAddress": "02:42:ac:12:00:04",
                "Networks": {
                    "bridge": {
                        "IPAMConfig": null,
                        "Links": null,
                        "Aliases": null,
                        "NetworkID": "3528c4b9b0c51ef77e9d39f50f48275ff0b13a7ef669e5e3448df847c601db0b",
                        "EndpointID": "a583848b04513f41405e9d2ae22c64416ea3ee01cefc5c1d0f5e7dc2ab7ba652",
                        "Gateway": "172.18.0.1",
                        "IPAddress": "172.18.0.4",
                        "IPPrefixLen": 16,
                        "IPv6Gateway": "",
                        "GlobalIPv6Address": "",
                        "GlobalIPv6PrefixLen": 0,
                        "MacAddress": "02:42:ac:12:00:04",
                        "DriverOpts": null
                    }
                }
            }
        }
    ]

执行下面的命令直接输出IP地址：

    [root@centos ~]# docker inspect --format={{.NetworkSettings.IPAddress}} nginx
    172.18.0.4

### 删除容器

    [root@centos ~]# docker ps -a
    CONTAINER ID   IMAGE            COMMAND                   CREATED          STATUS          PORTS                                   NAMES
    8039fed3fe21   centos:centos8   "/bin/bash"               5 seconds ago    Up 4 seconds                                            centos2
    0e536da15921   centos:centos8   "/bin/bash"               11 seconds ago   Up 10 seconds                                           centos1

    [root@centos ~]# docker stop centos1
    centos1
    [root@centos ~]# docker stop 8039fed3fe21
    8039fed3fe21

    [root@centos ~]# docker rm centos1
    centos1
    [root@centos ~]# docker rm 8039fed3fe21
    8039fed3fe21


# 完