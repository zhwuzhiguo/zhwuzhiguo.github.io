# MySQL实践

- 搭建主备架构。
- 定期全量备份主库。
- 实时备份二进制操作日志。
- 数据误操作通过二进制日志恢复(delete/update)。
- 表误操作通过全量备份和增量二进制日志恢复(truncate/drop table、drop database 二进制日志无法恢复)。