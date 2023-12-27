# 024-Python-垃圾回收机制

## main.py

```python
# Python 是一门面向对象语言
# Python 的世界一切皆对象
# 一切变量的本质都是对象的一个指针而已
import gc
import os

import psutil


# 垃圾回收比较通用的解决办法有三种:
# 引用计数
# 标记清除
# 分代回收

# 引用计数法是最简单直接的
# 但是需要维护一个计数字段
# 且针对交叉引用无能为力

# 标记清除算法主要是为了解决引用计数的交叉引用问题
# 该算法的缺点就是需要扫描整个堆的所有对象
# 有点浪费性能

# 分代回收算法的引入则完美解决了标记清除算法需要扫描整个堆对象的性能浪费问题
# 该算法也是建立在标记清除基础之上的

# gc.collect()
# 手动触发 GC 的操作

# 打印当前进程使用内存
def print_memory_info(name):
    pid = os.getpid()
    process = psutil.Process(pid)
    memory_info = process.memory_full_info()
    memory_uss = memory_info.uss / 1024 / 1024
    print(name, memory_uss, "MB")


# 函数中列表互相引用
# 函数结束时列表的引用计数不为0
# 函数内列表占用的空间不回收
def foo():
    print_memory_info("foo start")
    ll1 = [i for i in range(1000 * 1000)]
    ll2 = [i for i in range(1000 * 1000)]
    ll1.append(ll2)
    ll2.append(ll1)
    print_memory_info("foo end")


foo()
print_memory_info("gc start")
# 手动GC
# 函数内2个列表都不可达
# 标记清除算法回收2个列表
gc.collect()
print_memory_info("gc end")

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    foo start 7.328125 MB
    foo end 83.96484375 MB
    gc start 83.96875 MB
    gc end 16.2890625 MB


# 完