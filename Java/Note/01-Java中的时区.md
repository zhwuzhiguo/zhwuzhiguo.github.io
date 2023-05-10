# 01-Java中的时区

`Java` 中的 `Date` 对象没有时区的概念，它表示从 `1970-01-01 00:00:00 GMT` 到某个时间的毫秒数。

示例代码：

```java
public class DateUtil {

    // 获取一个指定时区的日期格式化对象
    public static final SimpleDateFormat getSimpleDateFormatForTimeZone(String timeZone) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        format.setTimeZone(TimeZone.getTimeZone(timeZone));
        return format;
    }

    public static void main(String[] args) throws ParseException {
        // UTC 时区
        SimpleDateFormat formatUTC = getSimpleDateFormatForTimeZone("UTC");
        // Asia/Shanghai 时区
        SimpleDateFormat formatAsiaShanghai = getSimpleDateFormatForTimeZone("Asia/Shanghai");

        // Date 对象没有时区的概念
        // Date 对象表示的时间是从 1970-01-01 00:00:00 GMT 到当前时间的毫秒数
        Date now = new Date(1683705018310L);
        System.out.println(now.getTime());

        // 格式化 Date 对象为 UTC 时区时间
        System.out.println(formatUTC.getTimeZone().getID());
        System.out.println(formatUTC.format(now));

        // 格式化 Date 对象为 Asia/Shanghai 时区时间
        System.out.println(formatAsiaShanghai.getTimeZone().getID());
        System.out.println(formatAsiaShanghai.format(now));

        System.out.println("---------------------------");

        // 将 UTC 时区时间简析为 Date 对象
        String dateStringUTC = "2023-05-10 07:50:18.310";
        Date dateUTC = formatUTC.parse(dateStringUTC);
        System.out.println(dateUTC.getTime());
        System.out.println(formatUTC.format(dateUTC));

        // 将 Asia/Shanghai 时区时间简析为 Date 对象
        String dateStringAsiaShanghai = "2023-05-10 15:50:18.310";
        Date dateAsiaShanghai = formatAsiaShanghai.parse(dateStringAsiaShanghai);
        System.out.println(dateAsiaShanghai.getTime());
        System.out.println(formatAsiaShanghai.format(dateAsiaShanghai));
    }
}
```

输出：

    1683705018310
    UTC
    2023-05-10 07:50:18.310
    Asia/Shanghai
    2023-05-10 15:50:18.310
    ---------------------------
    1683705018310
    2023-05-10 07:50:18.310
    1683705018310
    2023-05-10 15:50:18.310


`MySql` 中的 `datetime` 和 `timestamp` 都表示日期时间。

存储范围：
- `timestamp` 占用 `4` 个字节，保存的时间只能到 `2038` 年。
- `datetime` 占用 `8` 个字节，能保存更久的时间。

时区问题：
- `timestamp` 存储的是时间戳(一个整数毫秒值)，存入和取出的时间会根据当前会话的时区进行转换。
- `datetime` 和时区无关，存入什么时间，取出来就是什么时间。

项目中建议用 `datetime`。

`Length` 代表毫秒的位数，一般有三档：

    Length=0 2021-11-12 17:55:05
    Length=3 2021-11-16 15:52:38.081
    Length=6 2021-11-16 15:53:01.922523

中国标准时间的时区是 `+8:00`。

GMT的时区是 `+00:00`。

修改当前会话的时区：

    set time_zone='+08:00';

创建表：

```sql
CREATE TABLE tb_data_time (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  data_time1 datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '时间1',
  data_time2 datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '时间2',
  data_time3 datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '时间3',
  timestamp1 timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '时间戳1',
  timestamp2 timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '时间戳2',
  timestamp3 timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '时间戳3',
  PRIMARY KEY (id) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时间表';
```

当前时区是`中国标准时间`的时区，插入一条记录：

    mysql> show variables like '%time_zone%';
    +------------------+--------+
    | Variable_name    | Value  |
    +------------------+--------+
    | system_time_zone | CST    |
    | time_zone        | SYSTEM |
    +------------------+--------+
    2 rows in set (0.02 sec)

    mysql> insert into tb_data_time (id) values (1);
    Query OK, 1 row affected (0.00 sec)

    mysql> select * from tb_data_time;
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    | id | data_time1          | data_time2              | data_time3                 | timestamp1          | timestamp2              | timestamp3                 |
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    |  1 | 2023-05-10 16:49:44 | 2023-05-10 16:49:44.462 | 2023-05-10 16:49:44.462312 | 2023-05-10 16:49:44 | 2023-05-10 16:49:44.462 | 2023-05-10 16:49:44.462312 |
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    1 row in set (0.00 sec)

修改当前时区为`GMT的时区`，插入一条记录：

    mysql> set time_zone='+00:00';
    Query OK, 0 rows affected (0.00 sec)

    mysql> show variables like '%time_zone%';
    +------------------+--------+
    | Variable_name    | Value  |
    +------------------+--------+
    | system_time_zone | CST    |
    | time_zone        | +00:00 |
    +------------------+--------+
    2 rows in set (0.00 sec)

    mysql> insert into tb_data_time (id) values (2);
    Query OK, 1 row affected (0.00 sec)

    mysql> select * from tb_data_time;
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    | id | data_time1          | data_time2              | data_time3                 | timestamp1          | timestamp2              | timestamp3                 |
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    |  1 | 2023-05-10 16:49:44 | 2023-05-10 16:49:44.462 | 2023-05-10 16:49:44.462312 | 2023-05-10 08:49:44 | 2023-05-10 08:49:44.462 | 2023-05-10 08:49:44.462312 |
    |  2 | 2023-05-10 09:00:37 | 2023-05-10 09:00:37.568 | 2023-05-10 09:00:37.568583 | 2023-05-10 09:00:37 | 2023-05-10 09:00:37.568 | 2023-05-10 09:00:37.568583 |
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    2 rows in set (0.00 sec)

再切换回`中国标准时间`的时区，查看刚才插入的 `2` 条记录：

    mysql> set time_zone='+08:00';
    Query OK, 0 rows affected (0.00 sec)

    mysql> show variables like '%time_zone%';
    +------------------+--------+
    | Variable_name    | Value  |
    +------------------+--------+
    | system_time_zone | CST    |
    | time_zone        | +08:00 |
    +------------------+--------+
    2 rows in set (0.00 sec)

    mysql> select * from tb_data_time;
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    | id | data_time1          | data_time2              | data_time3                 | timestamp1          | timestamp2              | timestamp3                 |
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    |  1 | 2023-05-10 16:49:44 | 2023-05-10 16:49:44.462 | 2023-05-10 16:49:44.462312 | 2023-05-10 16:49:44 | 2023-05-10 16:49:44.462 | 2023-05-10 16:49:44.462312 |
    |  2 | 2023-05-10 09:00:37 | 2023-05-10 09:00:37.568 | 2023-05-10 09:00:37.568583 | 2023-05-10 17:00:37 | 2023-05-10 17:00:37.568 | 2023-05-10 17:00:37.568583 |
    +----+---------------------+-------------------------+----------------------------+---------------------+-------------------------+----------------------------+
    2 rows in set (0.01 sec)

结论：
- `timestamp` 类型的字段在不同时区的会话中存入的值其实是`时间戳`，是一样的，但取出的时候会按照当前会话的时区转换位对应时区的时间。
- `datetime` 类型的字段在不同时区的会话中存入的值就是当前时区的时间，取出的时间和当前会话的时区无关，和存入的是一样的。

可以这么理解：
- `timestamp` 保存的是一个绝对准确`时间戳`，读取的时候会转换为对应时区下的时间表示。
- `datetime` 保存的时间是一个固定时间值，到底表示的是哪个时区的时间，依赖于保存的时候是按什么时区保存的。


# 完