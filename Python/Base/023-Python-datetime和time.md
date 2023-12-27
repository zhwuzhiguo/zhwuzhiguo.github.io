# 023-Python-datetime和time

## main.py

```python
# datetime 模块
# time 模块
# 这两个模块主要用于转换日期格式
import datetime
import time

# datetime 模块
print("datetime 模块:")

# 当前日期和时间
dt = datetime.datetime.now()
print("dt", dt)

# 获取日期的年月日时分秒
print("dt.year", dt.year)
print("dt.month", dt.month)
print("dt.day", dt.day)
print("dt.hour", dt.hour)
print("dt.minute", dt.minute)
print("dt.second", dt.second)
print("dt.microsecond", dt.microsecond)
print("dt.tzname()", dt.tzname())

# 获取指定时间
dt1 = datetime.datetime(2000, 3, 18)
dt2 = datetime.datetime(2000, 3, 18, 13, 30, 50)
dt3 = datetime.datetime(2000, 3, 18, 13, 30, 50, 999999)
dt4 = datetime.datetime(2000, 3, 18, 13, 30, 50, 999999, datetime.timezone.utc)
print("dt1", dt1)
print("dt2", dt2)
print("dt3", dt3)
print("dt4", dt4)

# 时间戳转datetime对象
print("时间戳转datetime对象:")
dt5 = datetime.datetime.now()
tmp = dt5.timestamp()
dt6 = datetime.datetime.fromtimestamp(tmp)
print("tmp", tmp)
print("dt5", dt5)
print("dt6", dt6)

# 日期转字符串
print("日期转字符串:")
dt7 = datetime.datetime.now()
dts = dt7.strftime("%Y-%m-%d %H:%M:%S")
print("dt7", dt7)
print("dts", dts)

# 字符串转日期
print("字符串转日期:")
dt8 = datetime.datetime.strptime(dts, "%Y-%m-%d %H:%M:%S")
print("dt8", dt8)

# timedelta()
# 返回一个表示时间段的数据类型timedelta
# 用于日期的增加和减少
print("日期的增加和减少:")
dt10 = datetime.datetime.now()
dt11 = dt10 + datetime.timedelta(days=1, hours=1, minutes=1, seconds=1)
dt12 = dt10 - datetime.timedelta(days=1, hours=1, minutes=1, seconds=1)
print("dt10", dt10)
print("dt11", dt11)
print("dt12", dt12)

# time 模块

# time.time()
# 返回的带小数点的时间戳
# 表示从 Unix 纪元(1970年1月1日0点) 到当前所经历的时间的秒数
# 这个数字称为UNIX纪元时间戳

# time.sleep()
# 让程序暂停一下
# 参数表示需要暂停的秒数

print("time 模块:")
time_begin = time.time()
date_begin = datetime.datetime.now().timestamp()
time.sleep(5)
time_end = time.time()
date_end = datetime.datetime.now().timestamp()

print("time_begin", time_begin)
print("date_begin", date_begin)
print("time_end", time_end)
print("date_end", date_end)
print("time_sleep:", time_end - time_begin)
print("date_sleep:", date_end - date_begin)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    datetime 模块:
    dt 2023-12-27 15:06:37.777500
    dt.year 2023
    dt.month 12
    dt.day 27
    dt.hour 15
    dt.minute 6
    dt.second 37
    dt.microsecond 777500
    dt.tzname() None
    dt1 2000-03-18 00:00:00
    dt2 2000-03-18 13:30:50
    dt3 2000-03-18 13:30:50.999999
    dt4 2000-03-18 13:30:50.999999+00:00
    时间戳转datetime对象:
    tmp 1703660797.77805
    dt5 2023-12-27 15:06:37.778050
    dt6 2023-12-27 15:06:37.778050
    日期转字符串:
    dt7 2023-12-27 15:06:37.778192
    dts 2023-12-27 15:06:37
    字符串转日期:
    dt8 2023-12-27 15:06:37
    日期的增加和减少:
    dt10 2023-12-27 15:06:37.788699
    dt11 2023-12-28 16:07:38.788699
    dt12 2023-12-26 14:05:36.788699
    time 模块:
    time_begin 1703660797.7888372
    date_begin 1703660797.788838
    time_end 1703660802.792983
    date_end 1703660802.792999
    time_sleep: 5.004145860671997
    date_sleep: 5.00416111946106


# 完