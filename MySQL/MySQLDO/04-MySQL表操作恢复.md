# 04-MySQL表操作恢复

- 数据误操作通过二进制日志恢复(delete/update)。
- 表误操作通过全量备份和增量二进制日志恢复(truncate/drop table、drop database 二进制日志无法恢复)。

# 完
