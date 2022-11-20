# 01-基础架构：一条SQL查询语句是如何执行的

MySQL 可以分为 `Server` 层和`存储引擎`层两部分。

`Server` 层包括连接器、查询缓存、分析器、优化器、执行器等，涵盖 MySQL 的大多数核心服务功能，以及所有的内置函数（如日期、时间、数学和加密函数等），所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图等。

`存储引擎`层负责数据的存储和提取。其架构模式是插件式的，支持 InnoDB、MyISAM、Memory 等多个存储引擎。


## 连接器

连接命令

    mysql -h$ip -P$port -u$user -p

如果用户名密码认证通过，连接器会到权限表里面查出用户拥有的权限。

之后这个连接里面的权限判断逻辑，都将依赖于此时读到的权限。

这就意味着，一个用户成功建立连接后，即使管理员账号对这个用户的权限做了修改，也不会影响已经存在连接的权限，只有再新建的连接才会使用新的权限设置。

查看客户端连接情况：

    mysql> show processlist;
    +-----+------+---------------------+------+---------+------+----------+------------------+
    | Id  | User | Host                | db   | Command | Time | State    | Info             |
    +-----+------+---------------------+------+---------+------+----------+------------------+
    | 886 | root | localhost           | NULL | Query   |    0 | starting | show processlist |
    | 887 | root | 223.72.44.177:45967 | temp | Sleep   |   14 |          | NULL             |
    | 888 | root | 223.72.44.177:45978 | temp | Sleep   |    9 |          | NULL             |
    +-----+------+---------------------+------+---------+------+----------+------------------+

客户端如果太长时间没动静，连接器就会自动将它断开。这个时间是由参数 `wait_timeout` 控制的，默认值是 `8` 小时。

有些时候 MySQL 占用内存涨得特别快，这是因为 MySQL 在执行过程中临时使用的内存是管理在连接对象里面的，这些资源会在连接断开的时候才释放。

所以如果长连接一直保持下来，可能导致 MySQL 内存占用太大，被系统强行杀掉，从现象看就是 MySQL 异常重启了。


## 查询缓存

大多数情况下建议不要使用查询缓存，因为查询缓存往往弊大于利。

系统变量 `query_cache_type` 设置查询缓存模式，默认关闭。

    mysql> show variables like 'query_cache_type';
    +------------------+-------+
    | Variable_name    | Value |
    +------------------+-------+
    | query_cache_type | OFF   |
    +------------------+-------+

## 分析器

分析器对 `SQL` 语句做 `词法分析` 和 `语法分析`。

## 优化器

优化器是在表有多个索引的时决定使用哪个索引，或者在一个语句有多表关联时决定各个表的连接顺序，最终让 `SQL` 语句执行效率最高。

优化器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段。

## 执行器

开始执行的时候，要先判断一下有没有执行查询的权限。
如果没有权限，就会返回没有权限的错误。
如果有权限，就继续执行。

执行器就会根据表的存储引擎定义，去使用这个引擎提供的接口执行查询。


# 补充

## SHOW PROCESSLIST 命令

显示用户正在运行的线程。

除了 `root` 用户能看到所有正在运行的线程外，其他用户都只能看到自己正在运行的线程，看不到其它用户正在运行的线程。除非单独给这个用户赋予了 `PROCESS` 权限。

    mysql> SHOW PROCESSLIST;
    +-----+------+---------------------+------+---------+------+----------+------------------+
    | Id  | User | Host                | db   | Command | Time | State    | Info             |
    +-----+------+---------------------+------+---------+------+----------+------------------+
    | 886 | root | localhost           | NULL | Sleep   | 2389 |          | NULL             |
    | 887 | root | 223.72.44.177:45967 | temp | Sleep   |    1 |          | NULL             |
    | 888 | root | 223.72.44.177:45978 | temp | Sleep   |   26 |          | NULL             |
    | 889 | root | localhost           | NULL | Query   |    0 | starting | SHOW PROCESSLIST |
    +-----+------+---------------------+------+---------+------+----------+------------------+

`show processlist` 显示的信息都是来自 MySQL 系统库 `information_schema` 中的 `processlist` 表。

使用下面的查询语句可以获得相同的结果：

    mysql> select * from information_schema.processlist;
    +-----+------+---------------------+------+---------+------+-----------+----------------------------------------------+
    | ID  | USER | HOST                | DB   | COMMAND | TIME | STATE     | INFO                                         |
    +-----+------+---------------------+------+---------+------+-----------+----------------------------------------------+
    | 886 | root | localhost           | NULL | Sleep   | 2741 |           | NULL                                         |
    | 887 | root | 223.72.44.177:45967 | temp | Sleep   |   23 |           | NULL                                         |
    | 889 | root | localhost           | NULL | Query   |    0 | executing | select * from information_schema.processlist |
    | 888 | root | 223.72.44.177:45978 | temp | Sleep   |   17 |           | NULL                                         |
    +-----+------+---------------------+------+---------+------+-----------+----------------------------------------------+


### Id
线程的唯一标识。

可以通过 `KILL` 命令，加上这个Id值将这个线程杀掉。

    mysql> SHOW PROCESSLIST;
    +-----+------+-----------+------+---------+------+----------+------------------+
    | Id  | User | Host      | db   | Command | Time | State    | Info             |
    +-----+------+-----------+------+---------+------+----------+------------------+
    | 886 | root | localhost | NULL | Sleep   | 3562 |          | NULL             |
    | 891 | root | localhost | NULL | Query   |    0 | starting | SHOW PROCESSLIST |
    +-----+------+-----------+------+---------+------+----------+------------------+
    2 rows in set (0.00 sec)

    mysql> KILL 886;
    Query OK, 0 rows affected (0.00 sec)

### User
启动这个线程的用户。

### Host
发送请求的客户端的 `IP` 和 `端口号`。

### db
当前执行的命令是在哪一个数据库上。如果没有指定数据库，则该值为 `NULL` 。

### Command
此刻该线程正在执行的命令。

- `Binlog Dump`：这是主服务器上的线程，用于将二进制日志内容发送到从服务器。
- `Table Dump`：线程将表内容发送到从服务器。
- `Change user`：线程正在执行改变用户操作。
- `Close stmt`：线程正在关闭准备好的语句。
- `Connect`：复制中，从服务器连接到其主服务器。
- `Connect Out`：复制中，从服务器正在连接到其主服务器。
- `Create DB`：线程正在执行create-database操作。
- `Daemon`：此线程在服务器内部，而不是服务客户端连接的线程。
- `Debug`：线程正在生成调试信息。
- `Delayed insert`：线程是一个延迟插入处理程序。
- `Drop DB`：线程正在执行drop-database操作。
- `Execute`：线程正在执行一个准备好的语句（prepare statement类型就是预编译的语句，JDBC支持次类型执行SQL）。
- `Fetch`：线程正在执行一个准备语句的结果。
- `Field List`：线程正在检索表列的信息。
- `Init DB`：线程正在选择默认数据库。
- `Kill`：线程正在杀死另一个线程。
- `Long Data`：该线程在执行一个准备语句的结果中检索长数据。
- `Ping`：线程正在处理服务器ping请求。
- `Prepare`：线程正在为语句生成执行计划。
- `Processlist`：线程正在生成有关服务器线程的信息。
- `Query`：该线程正在执行一个语句。
- `Quit`：线程正在终止。
- `Refresh`：线程是刷新表，日志或缓存，或重置状态变量或复制服务器信息。
- `Register Slave`：线程正在注册从服务器。
- `Reset stmt`：线程正在重置一个准备好的语句。
- `Set option`：线程正在设置或重置客户端语句执行选项。
- `Shutdown`：线程正在关闭服务器。
- `Sleep`：线程正在等待客户端向其发送新的语句。
- `Statistics`：线程正在生成服务器状态信息。
- `Time`：没用过。

[参考官网文档](https://dev.mysql.com/doc/refman/5.7/en/thread-commands.html)

### Time
该线程处于当前状态的时间。

### State
线程的状态。

[参考官网文档](https://dev.mysql.com/doc/refman/5.7/en/general-thread-states.html)

### Info
一般记录的是线程执行的语句。

默认只显示前`100`个字符，要看全部信息，需要使用 `SHOW FULL PROCESSLIST` 。


## 常用排查SQL

### 按客户端 IP 分组，看哪个客户端的链接数最多

    SELECT client_ip, count(client_ip) as client_num FROM 
    (SELECT SUBSTRING_INDEX(host, ':', 1) AS 'client_ip' FROM information_schema.PROCESSLIST) temp
    GROUP BY client_ip
    ORDER BY client_num;

    mysql> SELECT client_ip, count(client_ip) as client_num FROM
        -> (SELECT SUBSTRING_INDEX(host, ':', 1) AS 'client_ip' FROM information_schema.PROCESSLIST) temp
        -> GROUP BY client_ip
        -> ORDER BY client_num;
    +---------------+------------+
    | client_ip     | client_num |
    +---------------+------------+
    | localhost     |          2 |
    | 223.72.44.177 |          3 |
    +---------------+------------+
    2 rows in set (0.00 sec)

### 查看正在执行的线程，并按 Time 倒排序，看看有没有执行时间特别长的线程

    SELECT * FROM information_schema.PROCESSLIST WHERE COMMAND != 'Sleep' ORDER BY TIME DESC;

### 找出所有执行时间超过 5 分钟的线程

    SELECT * FROM information_schema.PROCESSLIST WHERE COMMAND != 'Sleep' AND TIME > 300 ORDER BY TIME DESC;

# 完
