# 22-MySQL有哪些饮鸩止渴提高性能的方法

业务高峰期，生产环境的 `MySQL` 压力太大，没法正常响应，需要短期内、临时性地提升一些性能。

## 短连接风暴

如果使用短连接，在业务高峰期的时候，就可能出现连接数突然暴涨的情况。

`MySQL` 建立连接的成本是很高的。除了正常的网络连接三次握手外，还需要做登录权限判断和获得这个连接的数据读写权限。

短连接模型存在一个风险，就是一旦数据库处理得慢一些，连接数就会暴涨。

`MySQL` 的 `max_connections` 参数用来控制一个实例同时存在的连接数的上限，超过这个值，系统就会拒绝接下来的连接请求，并报错提示 `Too many connections`。

如果调高 `max_connections` 的值，让更多的连接都可以进来，那么系统的负载可能会进一步加大，大量的资源耗费在权限验证等逻辑上，结果可能是适得其反，已经连接的线程拿不到 `CPU` 资源去执行业务的 `SQL` 请求。

这里有两种方法，但都是有损的。

**第一种方法：先处理掉那些占着连接但是不工作的线程。**

在 `show processlist` 的结果里，踢掉显示为 `sleep` 的线程，可能是有损的。

显示为 `sleep` 的线程可能正在执行事务，还没有提交。

会话1：

    mysql> begin;
    Query OK, 0 rows affected (0.00 sec)

    mysql> insert into t values (1,1,1);
    Query OK, 1 row affected (0.00 sec)

会话2：

    mysql> select * from t where id = 1;
    Empty set (0.00 sec)

会话3：

    -- 未提交的事务也显示为Sleep
    mysql> show processlist;
    +----+------+-----------+------+---------+------+----------+------------------+
    | Id | User | Host      | db   | Command | Time | State    | Info             |
    +----+------+-----------+------+---------+------+----------+------------------+
    |  7 | root | localhost | test | Sleep   |   17 |          | NULL             |
    |  8 | root | localhost | test | Sleep   |    6 |          | NULL             |
    |  9 | root | localhost | NULL | Query   |    0 | starting | show processlist |
    +----+------+-----------+------+---------+------+----------+------------------+
    3 rows in set (0.00 sec)
    
    -- 查看事务状态
    -- trx_mysql_thread_id=7 的线程还处在事务中
    mysql> select * from information_schema.innodb_trx\G
    *************************** 1. row ***************************
                        trx_id: 629775
                     trx_state: RUNNING
                   trx_started: 2022-12-26 17:16:56
         trx_requested_lock_id: NULL
              trx_wait_started: NULL
                    trx_weight: 2
           trx_mysql_thread_id: 7
                     trx_query: NULL
           trx_operation_state: NULL
             trx_tables_in_use: 0
             trx_tables_locked: 1
              trx_lock_structs: 1
         trx_lock_memory_bytes: 1136
               trx_rows_locked: 0
             trx_rows_modified: 1
       trx_concurrency_tickets: 0
           trx_isolation_level: REPEATABLE READ
             trx_unique_checks: 1
        trx_foreign_key_checks: 1
    trx_last_foreign_key_error: NULL
     trx_adaptive_hash_latched: 0
     trx_adaptive_hash_timeout: 0
              trx_is_read_only: 0
    trx_autocommit_non_locking: 0
    1 row in set (0.00 sec)
    
    -- 关闭不在事务中的线程
    mysql> kill connection 8;
    Query OK, 0 rows affected (0.00 sec)

**第二种方法：减少连接过程的消耗。**

是让数据库跳过权限验证阶段。

跳过权限验证的方法是：

重启数据库，并使用 `–skip-grant-tables` 参数启动。

这样，整个 `MySQL` 会跳过所有的权限验证阶段，包括连接过程和语句执行过程在内。

但是，这种方法风险极高，不建议使用。尤其数据库外网可访问的话，就更不能这么做了。

## 慢查询性能问题

慢查询大体有以下三种可能：
- 索引没有设计好。
- `SQL` 语句没写好。
- `MySQL` 选错了索引。

**导致慢查询的第一种可能是，索引没有设计好。**

这种场景一般就是通过紧急创建索引来解决。

**导致慢查询的第二种可能是，语句没写好。**

可以通过改写 `SQL` 语句来处理。

`MySQL 5.7` 提供了查询重写功能（`query_rewrite`），可以把输入的一种语句改写成另外一种模式。

**导致慢查询的第三种可能，就是 MySQL 选错了索引。**

这时候，应急方案就是给这个语句加上 `force index`。

同样地，使用查询重写功能，给原来的语句加上 `force index`，也可以解决这个问题。

## QPS 突增问题

有时候由于业务突然出现高峰，或者应用程序 `bug`，导致某个语句的 `QPS` 突然暴涨，也可能导致 `MySQL` 压力过大，影响服务。

最理想的情况是让业务把这个功能下掉，服务自然就会恢复。

下掉一个功能，从数据库端处理的话，对应于不同的背景，有不同的方法可用：
- 假设运维是比较规范的，白名单是一个个加的，可以从数据库端直接把白名单去掉。
- 如果这个功能使用的是单独的数据库用户，可以用管理员账号把这个用户删掉，然后断开现有连接。
- 如果这个功能跟主体功能是部署在一起的，那么只能通过处理语句来限制。可以使用查询重写功能，把压力最大的 SQL 语句直接重写成 `select 1` 返回。

## 小结

在实际开发中，要尽量避免一些低效的方法，比如避免大量地使用短连接。

业务开发要知道，连接异常断开是常有的事，代码里要有正确地重连并重试的机制。

# 完