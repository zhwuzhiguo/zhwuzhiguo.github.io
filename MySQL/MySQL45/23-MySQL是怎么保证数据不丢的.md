# 23-MySQL是怎么保证数据不丢的

今天继续介绍在业务高峰期临时提升性能的方法。

今天介绍的方法跟数据的可靠性有关。

只要 `redo log` 和 `binlog` 保证持久化到磁盘，就能确保 `MySQL` 异常重启后，数据可以恢复。

今天一起看看 `MySQL` 写入 `binlog` 和 `redo log` 的流程。

## binlog 的写入机制

`binlog` 的写入逻辑比较简单：

事务执行过程中，先把日志写到 `binlog cache`，事务提交的时候，再把 `binlog cache` 写到 `binlog` 文件中。

一个事务的 `binlog` 是不能被拆开的，因此不论这个事务多大，也要确保一次性写入。

系统给 `binlog cache` 分配了一片内存，每个线程一个，参数 `binlog_cache_size` 用于控制单个线程内 `binlog cache` 所占内存的大小。如果超过了这个参数规定的大小，就要暂存到磁盘。

事务提交的时候，执行器把 `binlog cache` 里的完整事务写入到 `binlog` 中，并清空 `binlog cache`。

每个线程有自己 `binlog cache`，但是共用同一份 `binlog` 文件。

日志写磁盘分2步：
- `write` 指把日志写入到文件系统的 `page cache`，并没有把数据持久化到磁盘，所以速度比较快。
- `fsync` 指将数据持久化到磁盘的操作。一般情况下认为 `fsync` 才占磁盘的 `IOPS`。

`write` 和 `fsync` 的时机，是由参数 `sync_binlog` 控制的：
- `sync_binlog=0` 表示每次提交事务都只 `write` 不 `fsync`。
- `sync_binlog=1` 表示每次提交事务都会执行 `fsync`。
- `sync_binlog=N(N>1)` 表示每次提交事务都 `write`，累积 `N` 个事务后才 `fsync`。

在出现 `IO` 瓶颈的场景里，将 `sync_binlog` 设置成一个比较大的值，可以提升性能。

在实际的业务场景中，考虑到丢失日志量的可控性，一般不建议将这个参数设成 `0`，比较常见的是将其设置为 `100-1000` 中的某个数值。

但是将 `sync_binlog` 设置为 `N` 是有风险的：  
如果主机发生异常重启，会丢失最近 `N` 个事务的 `binlog` 日志。

## redo log 的写入机制

事务在执行过程中，生成的 `redo log` 是要先写到 `redo log buffer`，然后再写入磁盘。

日志写到 `redo log buffer` 是很快的，`wirte` 到 `page cache` 也差不多，但是持久化到磁盘的速度就慢多了。

为了控制 `redo log` 的写入策略，`InnoDB` 提供了 `innodb_flush_log_at_trx_commit` 参数，它有三种可能取值：
- `0` 表示每次事务提交时都只是把 `redo log` 留在 `redo log buffer` 中。
- `1` 表示每次事务提交时都将 `redo log` 直接持久化到磁盘。
- `2` 表示每次事务提交时都只是把 `redo log` 写到 `page cache`。

`InnoDB` 有一个后台线程，每隔 `1` 秒，就会把 `redo log buffer` 中的日志，调用 `write` 写到文件系统的 `page cache`，然后调用 `fsync` 持久化到磁盘。

也就是说，一个没有提交的事务的 `redo log`，也是可能已经持久化到磁盘的。

实际上，除了后台线程每秒一次的轮询操作外，还有两种场景会让一个没有提交的事务的 `redo log` 写入到磁盘中。
- `redo log buffer` 占用的空间即将达到 `innodb_log_buffer_size` 一半的时候，后台线程会主动写盘。
- 并行的事务提交的时候，顺带将这个事务的 `redo log buffer` 持久化到磁盘。

这里需要说明的是，介绍两阶段提交的时候说过，时序上 `redo log` 先 `prepare`， 再写 `binlog`，最后再把 `redo log commit`。

如果 `innodb_flush_log_at_trx_commit` 设置成 `1`，那么 `redo log` 在 `prepare` 阶段就要持久化一次，因为有一个崩溃恢复逻辑是要依赖于 `prepare` 的 `redo log`，再加上 `binlog` 来恢复的。

`双 1` 配置：

通常说 `MySQL` 的 `双 1` 配置，指的就是 `sync_binlog` 和 `innodb_flush_log_at_trx_commit` 都设置成 `1`。

也就是说，一个事务完整提交前，需要等待两次刷盘，一次是 `redo log`（`prepare` 阶段），一次是 `binlog`。


下面介绍组提交（`group commit`）机制。

日志逻辑序列号（`LSN`）的概念。

`LSN` 是单调递增的，用来对应 `redo log` 的一个个写入点。每次写入长度为 `length` 的 `redo log`， `LSN` 的值就会加上 `length`。

`LSN` 也会写到 `InnoDB` 的数据页中，来确保数据页不会被多次执行重复的 `redo log`。

在并发更新场景下，多个事务可以看成一个组，某个事务提交时把 `redo log buffer` 中的日志写入磁盘，就会顺便把其他事务写入 `redo log buffer` 中的日志也一起写入磁盘。

所以，第一个事务写完 `redo log buffer` 以后，接下来的 `fsync` 越晚调用，组员可能越多，可能写入磁盘的日志就越多，节约 `IOPS` 的效果就越好。

为了让一次 `fsync` 带的组员更多，`MySQL` 有一个很有趣的优化：`拖时间`。

在介绍两阶段提交的时候，有一个图：

![redolog1](./img23/redolog1.jpeg)

实际上写 `binlog` 分两步：
- 先把 `binlog` 从 `binlog cache` 中写到磁盘上的 `binlog` 文件。
- 调用 `fsync` 持久化。

`MySQL` 为了让组提交的效果更好，把 `redo log` 做 `fsync` 的时间拖到了 `步骤 1` 之后。如下图：

![redolog2](./img23/redolog2.jpeg)

这么一来，`binlog` 也可以组提交了。

`第 4 步` `binlog fsync` 到磁盘时，如果有多个事务的 `binlog` 已经写完了，也是一起持久化的，这样也可以减少 `IOPS` 的消耗。

通常情况下`第 3 步`执行得会很快，所以 `binlog` 的 `write` 和 `fsync` 间的间隔时间短，导致能集合到一起持久化的 `binlog` 比较少，因此 `binlog` 的组提交的效果通常不如 `redo log` 的效果那么好。

如果想提升 `binlog` 组提交的效果，可以通过设置 `binlog_group_commit_sync_delay` 和 `binlog_group_commit_sync_no_delay_count` 来实现。
- `binlog_group_commit_sync_delay` 表示延迟多少微秒后才调用 `fsync`。
- `binlog_group_commit_sync_no_delay_count` 表示累积多少次以后才调用 `fsync`。

现在可以理解了：
- `redo log` 和 `binlog` 都是顺序写，磁盘的顺序写比随机写速度要快。
- 组提交机制，可以大幅度降低磁盘的 `IOPS` 消耗。


那么如果 MySQL 现在出现了性能瓶颈，而且瓶颈在 `IO` 上，可以通过哪些方法来提升性能呢？

- 设置 `binlog_group_commit_sync_delay` 和 `binlog_group_commit_sync_no_delay_count` 参数来减少 `binlog` 的写盘次数。
  
  这个方法是基于`额外的故意等待`来实现的，因此可能会增加语句的响应时间，但没有丢失数据的风险。

- 将 `sync_binlog` 设置为大于 `1` 的值（比较常见是 `100-1000`）。
  
  这样做的风险是，主机掉电时会丢 `binlog` 日志。

- 将 `innodb_flush_log_at_trx_commit` 设置为 2。
  
  这样做的风险是，主机掉电的时候会丢数据。

不建议你把 `innodb_flush_log_at_trx_commit` 设置成 `0`。因为 `0` 表示 `redo log` 只保存在内存中，这样的话 `MySQL` 本身异常重启会丢数据，风险太大。

而 `redo log` 写到文件系统的 `page cache` 的速度也是很快的，所以将这个参数设置成 `2` 跟设置成 `0` 其实性能差不多，但这样做 `MySQL` 异常重启时就不会丢数据了，相比之下风险会更小。

## 小结

`第 2 篇`和`第 15 篇`文章中分析如果 `redo log` 和 `binlog` 是完整的，`MySQL` 是如何保证 `crash-safe` 的。

今天这篇文章介绍的是 `MySQL` 是怎么保证 `redo log` 和 `binlog` 是完整的。

# 完