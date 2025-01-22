
# 使用通用二进制包安装MySQL

参考文档  
https://dev.mysql.com/doc/refman/5.7/en/binary-installation.html

* 安装前准备

    1. 下载安装包

            // 下载二进制安装包
            // mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz
            https://dev.mysql.com/downloads/
            https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz

    2. 移除系统原有的MySQL相关包

            [root@centos-server ~]# yum list installed | grep mysql
            mysql-libs.x86_64      5.1.73-8.el6_8   @anaconda-CentOS-201703281317.x86_64/6.9
            [root@centos-server ~]# yum -y remove mysql-libs.x86_64

    3. 安装依赖包

            [root@centos-server ~]# yum install libaio
            [root@centos-server ~]# yum install numactl

*  安装过程

    1. 解压缩安装包

            [root@centos-server ~]# cd /usr/local/
            [root@centos-server local]# cp ~/software/mysql/mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz .
            [root@centos-server local]# tar zxvf mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz
            [root@centos-server local]# mv mysql-5.7.20-linux-glibc2.12-x86_64/ mysql

    2. 创建数据和日志目录

            [root@centos-server local]# mkdir /mysql
            [root@centos-server local]# mkdir /mysql/data
            [root@centos-server local]# mkdir /mysql/log

    3. 创建mysql用户和组

            // 由于用户仅用于所有权用途，而不是登录用途，
            // 因此useradd命令使用 -r 和 -s /bin/false 选项来创建对服务器主机没有登录权限的用户
            [root@centos-server ~]# groupadd mysql
            [root@centos-server ~]# useradd -r -g mysql -s /bin/false mysql

    4. 修改目录权限

            [root@centos-server local]# chown -R mysql:mysql /usr/local/mysql
            [root@centos-server local]# chown -R mysql:mysql /mysql/

    5. bin目录添加到PATH变量

            [root@centos-server local]# vim /etc/profile
            [root@centos-server local]# source /etc/profile

            # mysql
            PATH=$PATH:/usr/local/mysql/bin
    
* 安装后设置

    1. 创建my.cnf文件
    
            // 先创建一个简单的
            // 后续继续学习
            [root@centos-server local]# vim /etc/my.cnf

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

            [root@centos-server local]# mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/mysql/data

    3. 创建SSL/RSA文件

            [root@centos-server local]# mysql_ssl_rsa_setup --datadir=/mysql/data

    4. 配置启动文件

            [root@centos-server local]# cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
            [root@centos-server local]# chkconfig --add mysql
            [root@centos-server local]# chkconfig mysql on

    5. 启动服务
    
            [root@centos-server local]# service mysql start
            Starting MySQL. SUCCESS!

    6. 使用初始随机密码登录并设置新密码

            [root@centos-server local]# cat /mysql/log/mysql-error.log
            A temporary password is generated for root@localhost: (0x-o_6lff.T

            [root@centos-server local]# mysql -uroot -p
            Enter password:
            Welcome to the MySQL monitor.  Commands end with ; or \g.
            Your MySQL connection id is 3
            Server version: 5.7.20

            Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.

            Oracle is a registered trademark of Oracle Corporation and/or its
            affiliates. Other names may be trademarks of their respective
            owners.

            Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

            mysql>
            // 修改本地登录root账号密码
            mysql> SET PASSWORD=PASSWORD('aaaaaa');
            Query OK, 0 rows affected, 1 warning (0.01 sec)

            mysql> flush privileges;
            Query OK, 0 rows affected (0.01 sec)

            // 创建远程登录root账号
            mysql> grant all privileges on *.* to 'root'@'%' identified by '123456' with grant option;
            Query OK, 0 rows affected, 1 warning (0.00 sec)

            mysql> flush privileges;
            Query OK, 0 rows affected (0.00 sec)
   
    7. 开放防火墙

            [root@centos-server local]# vim /etc/sysconfig/iptables
            [root@centos-server local]# service iptables restart
            iptables: Setting chains to policy ACCEPT: filter          [  OK  ]
            iptables: Flushing firewall rules:                         [  OK  ]
            iptables: Unloading modules:                               [  OK  ]
            iptables: Applying firewall rules:                         [  OK  ]
            [root@centos-server local]#

            // 打开3306端口
            -A INPUT -m state --state NEW -m tcp -p tcp --dport 3306 -j ACCEPT

# 完。
