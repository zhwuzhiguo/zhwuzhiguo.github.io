# 使用yum仓库安装MySQL

参考文档  
https://dev.mysql.com/doc/refman/5.7/en/linux-installation-yum-repo.html
http://blog.csdn.net/xyang81/article/details/51759200

* 安装前准备

    1. 移除系统原有的MySQL相关包

            [root@centos-server ~]# yum list installed | grep mysql
            mysql-libs.x86_64      5.1.73-8.el6_8   @anaconda-CentOS-201703281317.x86_64/6.9
            [root@centos-server ~]# yum -y remove mysql-libs.x86_64

    2. 安装必要软件

            [root@centos-server ~]# yum install wget
            [root@centos-server ~]# yum install vim

    3. 添加MySQL Yum存储库

            // 将 MySQL Yum 存储库添加到系统的存储库列表中
            // 在 MySQL Yum 存储库页面选择并下载适用于您的平台的发行包
            // https://dev.mysql.com/downloads/repo/yum/
            [root@centos-server ~]# wget https://repo.mysql.com//mysql57-community-release-el6-11.noarch.rpm
            // 安装下载的发行包
            [root@centos-server ~]# yum localinstall mysql57-community-release-el6-11.noarch.rpm
            [root@centos-server ~]# ll /etc/yum.repos.d/
            总用量 32
            -rw-r--r--. 1 root root 1991 3月  28 2017 CentOS-Base.repo
            -rw-r--r--. 1 root root  647 3月  28 2017 CentOS-Debuginfo.repo
            -rw-r--r--. 1 root root  289 3月  28 2017 CentOS-fasttrack.repo
            -rw-r--r--. 1 root root  630 3月  28 2017 CentOS-Media.repo
            -rw-r--r--. 1 root root 7989 3月  28 2017 CentOS-Vault.repo
            -rw-r--r--. 1 root root 1836 4月  27 2017 mysql-community.repo
            -rw-r--r--. 1 root root 1885 4月  27 2017 mysql-community-source.repo
            // 检查MySQL Yum存储库是否已成功添加
            [root@centos-server ~]# yum repolist enabled | grep "mysql.*-community.*"
            mysql-connectors-community           MySQL Connectors Community               42
            mysql-tools-community                MySQL Tools Community                    53
            mysql57-community                    MySQL 5.7 Community Server              219
            [root@centos-server ~]#

* 安装过程

        // 安装MySQL
        [root@centos-server ~]# yum install mysql-community-server

        // 启动MySQL服务器
        [root@centos-server ~]# service mysqld start
        Initializing MySQL database:                               [  OK  ]
        Starting mysqld:                                           [  OK  ]

        // 检查MySQL服务器的状态
        [root@centos-server ~]# service mysqld status
        mysqld (pid  1824) is running...
        [root@centos-server ~]#


* 安装后设置

    1. 使用初始随机密码登录并设置新密码

            // 使用临时密码登录
            [root@centos-server ~]# grep 'temporary password' /var/log/mysqld.log
            2017-12-08T05:47:12.630483Z 1 [Note] A temporary password is generated for root@localhost: QL4Gda)0vqkg
            [root@centos-server ~]# mysql -uroot -p
            Enter password:

            // 设置新密码
            // MySQL的 validate_password 插件是默认安装的。
            // 这将要求密码至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符，并且总密码长度至少为8个字符。
            mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '1qazXSW@';
            Query OK, 0 rows affected (0.00 sec)

            // 创建远程登录root账号
            mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1qazXSW@' WITH GRANT OPTION;
            Query OK, 0 rows affected, 1 warning (0.00 sec)

            mysql> flush privileges;
            Query OK, 0 rows affected (0.00 sec)

    2. 配置默认编码为utf8

            [mysqld]
            character_set_server=utf8

    3. 开放防火墙

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
