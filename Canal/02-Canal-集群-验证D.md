# 02-Canal-集群-验证D

一个实例同步消息队列多 `Topic` 验证：

验证已经搭建好的 `Canal` 集群，数据库更新操作同步消息到 `RocketMQ`。

本示例同步数据库 `sample` 的所有表，其中：
- 表 `sample.user` 和 `sample.user_info` 同步到 `sample-dynamic-user` 队列。
- 表 `sample.temp` 同步到 `sample-dynamic-temp` 队列。
- 其他表同步到默认队列 `sample-dynamic-default` 队列。

## 创建 Canal Instance

首先在 `RocketMQ` 新建三个 `TOPIC`：

    sample-dynamic-default
    sample-dynamic-user
    sample-dynamic-temp

查看源数据库的二进制日志位置信息：

    [root@centos ~]# docker exec -it mysql-33071-master /bin/bash
    bash-4.2# mysql -u root -p123456
    ...
    
    mysql> flush logs;
    Query OK, 0 rows affected (0.02 sec)

    mysql> show master status;
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000018 |      154 |              |                  |                   |
    +------------------+----------+--------------+------------------+-------------------+
    1 row in set (0.00 sec)


在 `Canal Admin` 的 `Instance` 界面新建集群 `canal-cluster-1` 的名为 `sample-instance-dynamic-topic` 的 `Instance`。

在实例配置中指定：
- 同步的表：`sample` 的所有表。
- 同步点位：数据库当前的二进制日志点位。
- 同步队列：
  
      ## 默认投递队列
      canal.mq.topic = sample-dynamic-default
      ## 特殊投递规则
      ## 格式: topic-name:规则,topic-name:规则...
      canal.mq.dynamicTopic = sample-dynamic-user:sample\\.user,sample-dynamic-user:sample\\.user_info,sample-dynamic-temp:sample\\.temp

配置内容：

    ## 主库同步点位
    canal.instance.gtidon = false
    canal.instance.master.address = mysql-33071-master:3306
    canal.instance.master.journal.name = mysql-bin.000018
    canal.instance.master.position = 154
    canal.instance.master.timestamp = 
    canal.instance.master.gtid = 
    
    ## 阿里云数据库二进制日志OSS
    canal.instance.rds.accesskey = 
    canal.instance.rds.secretkey = 
    canal.instance.rds.instanceId = 
    
    ## 主库同步账号
    canal.instance.dbUsername = reader
    canal.instance.dbPassword = 123456
    canal.instance.connectionCharset = UTF-8
    
    ## 主库同步过滤规则
    canal.instance.filter.regex = sample\\..*
    canal.instance.filter.black.regex = 
    
    ## 同步消息队列
    canal.mq.topic = sample-dynamic-default
    canal.mq.dynamicTopic = sample-dynamic-user:sample\\.user,sample-dynamic-user:sample\\.user_info,sample-dynamic-temp:sample\\.temp
    canal.mq.partition = 0
    

现在这个实例就跑起来了。

## 验证

1. 更新 `sample` 的 `user` 和 `user_info` 表的事件会写入对应的 `sample-dynamic-user` 队列。

2. 更新 `sample` 的 `temp` 表的事件会写入对应的 `sample-dynamic-temp` 队列。

3. 更新 `sample` 的 `other` 表的事件会写入默认的 `sample-dynamic-default` 队列，因为没有为这个表配置投递队列。

**另外需要注意:**

默认投递队列 `canal.mq.topic = sample-dynamic-default` 一定要配置，否则规则中未配置的表的更新事件需要投递默认队列时会一直报错。

而且还会导致其他本来能正常投递的事件投递对应的队列时可能收不到投递成功应答而不停的投递导致对应的队列消息堆积。

# 完