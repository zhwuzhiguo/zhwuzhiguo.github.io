# 03-Docker-命令-镜像命令

## 镜像命令

### 拉取镜像

    [root@centos ~]# docker pull nginx:1.23
    1.23: Pulling from library/nginx
    bb263680fed1: Pull complete
    258f176fd226: Pull complete
    a0bc35e70773: Pull complete
    077b9569ff86: Pull complete
    3082a16f3b61: Pull complete
    7e9b29976cce: Pull complete
    Digest: sha256:6650513efd1d27c1f8a5351cbd33edf85cc7e0d9d0fcb4ffb23d8fa89b601ba8
    Status: Downloaded newer image for nginx:1.23
    docker.io/library/nginx:1.23

### 查看镜像

    [root@centos ~]# docker images
    REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
    nginx         1.23      3f8a00f137a0   11 days ago     142MB
    mysql         5.7       be16cf2d832a   2 weeks ago     455MB
    hello-world   latest    feb5d9fea6a5   17 months ago   13.3kB

### 删除镜像

    [root@centos ~]# docker rmi 3f8a00f137a0
    Untagged: nginx:1.23
    Untagged: nginx@sha256:6650513efd1d27c1f8a5351cbd33edf85cc7e0d9d0fcb4ffb23d8fa89b601ba8
    Deleted: sha256:3f8a00f137a0d2c8a2163a09901e28e2471999fde4efc2f9570b91f1c30acf94
    Deleted: sha256:ccfe545858415bccd69b8edff4da7344d782985f22ad4398bdaa7358d3388d15
    Deleted: sha256:e34f63c02e162795cc8a2b43d1a3ff0ccd6d3456ce12aebb74452e252d1ecb8a
    Deleted: sha256:cf7515030d4de4fb66994e0d9fccbaf19fcfbf46f7dad8cf895051750b840128
    Deleted: sha256:1486739bc51436dd10d2bc1d45e130771c73d3aee35e49971905aa767d195342
    Deleted: sha256:452008e5f3c114989bfc978a2829cf061f0868463f3553b4e20c964a41eda749
    Deleted: sha256:4695cdfb426a05673a100e69d2fe9810d9ab2b3dd88ead97c6a3627246d83815


# 完