# 027-Python-进程线程协程

## process1.py

```python
# 创建子进程
import os
from multiprocessing import Process


# 进程执行函数
def process(name):
    print("Processing {} pid={}".format(name, os.getpid()))


if __name__ == '__main__':
    print("Main Processing pid={}".format(os.getpid()))
    # 子进程对象
    p1 = Process(target=process, args=("proc1",))
    p2 = Process(target=process, args=("proc2",))
    # 启动子进程
    p1.start()
    p2.start()
    # 等待子进程结束
    p1.join()
    p2.join()
    print("Process end..")


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/process1.py 
    Main Processing pid=4788
    Processing proc1 pid=4790
    Processing proc2 pid=4791
    Process end..


## process2.py

```python
# 进程间通信
# 父进程创建两个子进程
# 一个往Queue里写数据
# 一个从Queue里读数据
import os
import random
import time
from multiprocessing import Process, Queue


# 进程执行函数
def write(q):
    print("Process write pid={}".format(os.getpid()))
    for i in range(5):
        q.put(i)
        print("Process write {}".format(i))
        time.sleep(random.randint(1, 2))


def read(q):
    print("Process read pid={}".format(os.getpid()))
    while True:
        i = q.get(block=True)
        print("Process read {}".format(i))


if __name__ == '__main__':
    print("Main Processing pid={}".format(os.getpid()))
    q = Queue()
    p1 = Process(target=write, args=(q,))
    p2 = Process(target=read, args=(q,))
    p1.start()
    p2.start()
    # 等待写进程结束
    p1.join()
    # 终止读进程
    p2.terminate()
    print("Process end..")


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/process2.py 
    Main Processing pid=4896
    Process write pid=4898
    Process write 0
    Process read pid=4899
    Process read 0
    Process write 1
    Process read 1
    Process write 2
    Process read 2
    Process write 3
    Process read 3
    Process write 4
    Process read 4
    Process end..


## thread1.py

```python
# Python的线程是真正的线程
# 但解释器执行代码时有一个GIL锁(Global Interpreter Lock)
# 任何Python线程执行前必须先获得GIL锁
# 然后每执行100条字节码
# 解释器就自动释放GIL锁
# 让别的线程有机会执行
# 这个GIL全局锁实际上把所有线程的执行代码都给上了锁
# 所以多线程在Python中只能交替执行
# 即使100个线程跑在100核CPU上也只能用到1个核

# GIL是Python解释器设计的历史遗留问题
# 通常我们用的解释器是官方实现的CPython
# 要真正利用多核除非重写一个不带GIL的解释器
# 所以在Python中可以使用多线程
# 但不要指望能有效利用多核

# Python虽然不能利用多线程实现多核任务
# 但可以通过多进程实现多核任务
# 多个进程有各自独立的GIL锁互不影响
import threading
import time


# 线程函数
def loop():
    print("thread {} is begin...".format(threading.current_thread().name))
    for i in range(5):
        print("thread {} is running...".format(threading.current_thread().name))
        time.sleep(1)
    print("thread {} is end...".format(threading.current_thread().name))


# 创建一个线程
# 指定线程函数
# 指定线程名称
t = threading.Thread(target=loop, name="LoopThread")
# 启动线程
t.start()
# 等待线程结束
t.join()

print("thread {} is end...".format(threading.current_thread().name))


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/thread1.py 
    thread LoopThread is begin...
    thread LoopThread is running...
    thread LoopThread is running...
    thread LoopThread is running...
    thread LoopThread is running...
    thread LoopThread is running...
    thread LoopThread is end...
    thread MainThread is end...



## thread2.py

```python
# 多线程并发使用锁
import threading

num = 0
# 定义锁
numLock = threading.Lock()


# 修改数据
# 使用锁
# 避免多线程并发问题
def change(n):
    try:
        # 获取锁
        numLock.acquire()
        global num
        num = num + n
        num = num - n
    finally:
        # 释放锁
        numLock.release()


# 线程函数
def run(n):
    for i in range(10000):
        change(n)


# 启动多个线程
print("begin num:", num)
t1 = threading.Thread(target=run, args=(1,))
t2 = threading.Thread(target=run, args=(2,))
t1.start()
t2.start()
t1.join()
t2.join()
print("end num:", num)


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/thread2.py 
    begin num: 0
    end num: 0


## thread3.py

```python
# ThreadLocal解决参数在一个线程中各个函数之间互相传递的问题
# 一个ThreadLocal变量虽然是全局变量
# 但每个线程都只能读写自己线程的独立副本
import threading

# 定义全局ThreadLocal
threadLocal = threading.local()


# 处理函数
def process():
    # 获取线程变量
    name = threadLocal.name
    print(name)


# 线程函数
def run(name):
    # 设置线程变量
    threadLocal.name = name
    process()


# 启动多个线程
t1 = threading.Thread(target=run, args=("Jack",))
t2 = threading.Thread(target=run, args=("Jim",))
t1.start()
t2.start()
t1.join()
t2.join()


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/thread3.py 
    Jack
    Jim


## coroutine1.py

```python
# 协程(Coroutine)
# Python对协程的支持是通过generator实现的

# 例子
# 传统的生产者-消费者模型
# 整个流程无锁
# 由一个线程执行
# produce和consumer协作完成任务
# 而非线程的抢占式多任务
def consumer():
    r = ''
    while True:
        # 重点
        # 分成两部分:
        # yield r 将 r 返回给外部调用程序，交出控制权，暂停
        # n = yield 可以接收外部程序通过send()发送的信息并赋值给n
        n = yield r
        if not n:
            return
        print('[CONSUMER] Consuming %s...' % n)
        r = '200 OK'


def produce(c):
    # 类似于next(c)
    # yield r 执行
    # 返回 r
    # 注意：
    # 在一个生成器函数未启动之前
    # 不能传递值进去
    # 也就是说在使用c.send(n)之前
    # 必须先使用c.send(None)或者next(c)来返回生成器的第一个值
    c.send(None)
    n = 0
    while n < 5:
        n = n + 1
        print('[PRODUCER] Producing %s...' % n)
        # n = yield 执行
        # 并继续执行后续代码
        # yield r 执行
        # 返回 r
        r = c.send(n)
        print('[PRODUCER] Consumer return: %s' % r)
    # 关闭consumer
    c.close()


c = consumer()
produce(c)


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/coroutine1.py 
    [PRODUCER] Producing 1...
    [CONSUMER] Consuming 1...
    [PRODUCER] Consumer return: 200 OK
    [PRODUCER] Producing 2...
    [CONSUMER] Consuming 2...
    [PRODUCER] Consumer return: 200 OK
    [PRODUCER] Producing 3...
    [CONSUMER] Consuming 3...
    [PRODUCER] Consumer return: 200 OK
    [PRODUCER] Producing 4...
    [CONSUMER] Consuming 4...
    [PRODUCER] Consumer return: 200 OK
    [PRODUCER] Producing 5...
    [CONSUMER] Consuming 5...
    [PRODUCER] Consumer return: 200 OK



## coroutine2.py

```python
# 异步IO
import asyncio
import threading
import time


async def func1():
    print('func1 begin: %s' % threading.current_thread())
    await asyncio.sleep(3)
    print('func1 end: %s' % threading.current_thread())


async def func2():
    print('func2 begin: %s' % threading.current_thread())
    await asyncio.sleep(3)
    print('func2 end: %s' % threading.current_thread())


async def func3():
    print('func3 begin: %s' % threading.current_thread())
    await asyncio.sleep(3)
    print('func3 end: %s' % threading.current_thread())


# 此时的函数是异步协程函数
# 此时函数执行得到的是一个协程对象
f1 = func1()
f2 = func2()
f3 = func3()

# 记录耗时
# 同一个线程执行多个协程
# 线程不等待
t1 = time.time()
loop = asyncio.new_event_loop()
tasks = [loop.create_task(f1),
         loop.create_task(f2),
         loop.create_task(f3)]
loop.run_until_complete(asyncio.wait(tasks))
loop.close()
t2 = time.time()
print("耗时: %s" % (t2 - t1))


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/coroutine2.py 
    func1 begin: <_MainThread(MainThread, started 4491507200)>
    func2 begin: <_MainThread(MainThread, started 4491507200)>
    func3 begin: <_MainThread(MainThread, started 4491507200)>
    func1 end: <_MainThread(MainThread, started 4491507200)>
    func2 end: <_MainThread(MainThread, started 4491507200)>
    func3 end: <_MainThread(MainThread, started 4491507200)>
    耗时: 3.000903367996216



# 完