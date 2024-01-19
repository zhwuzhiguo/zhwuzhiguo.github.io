# 004-Python模块-queue-模块

## main.py

```python
# queue 模块即队列
# 适合处理信息在多个线程间安全交换的多线程程序中
import queue

# queue 模块定义了四种不同类型的队列
# 区别在于数据入队列之后出队列的顺序不同

# 先进先出队列
print("先进先出队列:")
# maxsize 设置队列的最大长度
# maxsize 默认0队列的长度没有限制
q = queue.Queue(maxsize=100)
for i in range(3):
    q.put(i)

for i in range(3):
    print(q.get())

# 后进先出队列
print("后进先出队列:")
q = queue.LifoQueue()
for i in range(3):
    q.put(i)

for i in range(3):
    print(q.get())

# 优先级队列
print("优先级队列:")
# 比较队列中每个数据的大小
# 值最小的数据拥有出队列的优先权
# 数据一般以元组的形式插入
# 典型形式为(priority_number, data)
q = queue.PriorityQueue()
q.put((1, "aaa"))
q.put((0, "bbb"))
q.put((2, "ccc"))
print(q.get())
print(q.get())
print(q.get())

# 先进先出类型的简单队列
# 没有大小限制
# 缺少一些高级功能
print("先进先出类型的简单队列:")
q = queue.SimpleQueue()
for i in range(3):
    q.put(i)

for i in range(3):
    print(q.get())

# queue.Empty 异常
print("queue.Empty 异常:")
try:
    q = queue.Queue()
    q.put(111)
    q.get()
    q.get(block=False)
except queue.Empty:
    print("queue.Empty")

# queue.Full 异常
print("queue.Full 异常:")
try:
    q = queue.Queue(3)
    q.put(111)
    q.put(222)
    q.put(333)
    q.put(444, block=False)
except queue.Full:
    print("queue.Full")

# 对象的基本使用方法
# - Queue
# - LifoQueue
# - PriorityQueue
# - SimpleQueue
print("对象的基本使用方法:")
q = queue.Queue(3)
q.put(111)
q.put(222)
q.put(333)

# 队列状态
print("q.qsize()", q.qsize())
print("q.empty()", q.empty())
print("q.full()", q.full())

# put 元素阻塞超时
print("put 元素阻塞超时:")
try:
    q = queue.Queue(3)
    q.put(111)
    q.put(222)
    q.put(333)
    q.put(444, block=True, timeout=1)
except queue.Full:
    print("queue.Full")

# put_nowait 元素超时
print("put_nowait 元素超时:")
try:
    q = queue.Queue(3)
    q.put(111)
    q.put(222)
    q.put(333)
    q.put_nowait(444)
except queue.Full:
    print("queue.Full")

# get 元素阻塞超时
print("get 元素阻塞超时:")
try:
    q = queue.Queue(3)
    q.get(block=True, timeout=1)
except queue.Empty:
    print("queue.Empty")

# get_nowait 元素超时
print("get_nowait 元素超时:")
try:
    q = queue.Queue(3)
    q.get_nowait()
except queue.Empty:
    print("queue.Empty")

# 对象的高级使用方法
# - Queue
# - LifoQueue
# - PriorityQueue
# - SimpleQueue 缺少了 task_done 和 join 的高级使用方法

# task_done 表示队列内的数据元素已经被取出
# 每个 get 用于获取一个数据元素
# 调用 task_done 告诉队列该数据的处理已经完成

# join 一直阻塞直到队列中的所有数据元素都被取出和执行
# 当未完成任务的计数等于 0 时 join 就不会阻塞
print("对象的高级使用方法:")
q = queue.Queue()
for i in range(3):
    q.put(i)

for i in range(3):
    print(q.get())
    # 保证join能解除阻塞
    q.task_done()

q.join()
print("q.join() finished..")

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py aaa bbb ccc 
    先进先出队列:
    0
    1
    2
    后进先出队列:
    2
    1
    0
    优先级队列:
    (0, 'bbb')
    (1, 'aaa')
    (2, 'ccc')
    先进先出类型的简单队列:
    0
    1
    2
    queue.Empty 异常:
    queue.Empty
    queue.Full 异常:
    queue.Full
    对象的基本使用方法:
    q.qsize() 3
    q.empty() False
    q.full() True
    put 元素阻塞超时:
    queue.Full
    put_nowait 元素超时:
    queue.Full
    get 元素阻塞超时:
    queue.Empty
    get_nowait 元素超时:
    queue.Empty
    对象的高级使用方法:
    0
    1
    2
    q.join() finished..


# 完