
# 使用通用二进制包安装MySQL

阿里云环境:  
centos7.4  
mysql-5.7.23

参考文档  
https://dev.mysql.com/doc/refman/5.7/en/binary-installation.html

* 安装前准备

    1. 下载安装包

            // 下载二进制安装包
            // mysql-5.7.23-linux-glibc2.12-x86_64.tar.gz
            [root@centos mysql]# wget https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.23-linux-glibc2.12-x86_64.tar.gz

    2. 移除系统原有的MySQL相关包

            [root@centos mysql]# rpm -qa | grep mariadb
            mariadb-libs-5.5.56-2.el7.x86_64
            [root@centos mysql]# rpm -e --nodeps mariadb-libs-5.5.56-2.el7.x86_64
            [root@centos mysql]# rpm -qa | grep mariadb
            [root@centos mysql]#

    3. 安装依赖包

            [root@centos mysql]# yum install libaio
            [root@centos mysql]# yum install numactl

*  安装过程

    1. 解压缩安装包

            [root@centos mysql]# cd /usr/local/
            [root@centos local]# cp ~/software/mysql/mysql-5.7.23-linux-glibc2.12-x86_64.tar.gz .
            [root@centos local]# tar zxvf mysql-5.7.23-linux-glibc2.12-x86_64.tar.gz
            [root@centos local]# rm  mysql-5.7.23-linux-glibc2.12-x86_64.tar.gz
            [root@centos local]# mv mysql-5.7.23-linux-glibc2.12-x86_64/ mysql

    2. 创建数据和日志目录

            [root@centos local]# mkdir /mysql
            [root@centos local]# mkdir /mysql/data
            [root@centos local]# mkdir /mysql/log

    3. 创建mysql用户和组

            // 由于用户仅用于所有权用途，而不是登录用途，
            // 因此useradd命令使用 -r 和 -s /bin/false 选项来创建对服务器主机没有登录权限的用户
            [root@centos local]# groupadd mysql
            [root@centos local]# useradd -r -g mysql -s /bin/false mysql

    4. 修改目录权限

            [root@centos local]# chown -R mysql:mysql /usr/local/mysql
            [root@centos local]# chown -R mysql:mysql /mysql/

    5. bin目录添加到PATH变量

            [root@centos local]# vim /etc/profile
            [root@centos local]# source /etc/profile

            # mysql
            PATH=$PATH:/usr/local/mysql/bin
    
* 安装后设置

    1. 创建my.cnf文件
    
            // 先创建一个简单的
            // 后续继续学习
            [root@centos local]# vim /etc/my.cnf

            [client]
            port = 3306
            socket = /tmp/mysql.sock

            [mysqld]
            port = 3306
            user = mysql
            character-set-server = utf8
            default_storage_engine = innodb
            log_timestamps = system
            socket = /tmp/mysql.sock
            basedir = /usr/local/mysql
            datadir = /mysql/data
            pid-file = /mysql/data/mysql.pid
            log_error = /mysql/log/mysql-error.log

    2. 初始化数据库

            [root@centos local]# mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/mysql/data

    3. 创建SSL/RSA文件

            [root@centos local]# mysql_ssl_rsa_setup --datadir=/mysql/data

    4. 配置启动文件

            [root@centos local]# cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
            [root@centos local]# chkconfig --add mysqld
            [root@centos local]# chkconfig mysqld on


    5. 启动服务
    
            [root@centos local]# service mysqld start
            Starting MySQL.  [  OK  ]
            [root@centos local]#

    6. 使用初始随机密码登录并设置新密码

            [root@centos local]# cat /mysql/log/mysql-error.log
            A temporary password is generated for root@localhost: FHeor%dT5fpk

            [root@centos local]# mysql -uroot -p
            Enter password:
            Welcome to the MySQL monitor.  Commands end with ; or \g.
            Your MySQL connection id is 2
            Server version: 5.7.23

            Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

            Oracle is a registered trademark of Oracle Corporation and/or its
            affiliates. Other names may be trademarks of their respective
            owners.

            Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

            mysql>
            
            // 修改本地root账号密码
            mysql> alter user 'root'@'localhost' identified by '1qazXSW@';
            Query OK, 0 rows affected (0.00 sec)

            // 创建远程root账号
            mysql> create user 'root'@'%' identified by '1qazXSW@';
            Query OK, 0 rows affected (0.00 sec)

            // 远程root账号授权
            mysql> grant all privileges on *.* to 'root'@'%' with grant option;
            Query OK, 0 rows affected (0.00 sec)

            mysql> flush privileges;
            Query OK, 0 rows affected (0.01 sec)
   
    7. 开放防火墙

            阿里云服务器控制台界面配置入访规则。

# 完。
