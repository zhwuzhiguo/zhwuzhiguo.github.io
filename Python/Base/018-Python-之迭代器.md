# 018-Python-之迭代器

## main.py

```python
# Python 在实现for语句的时候使用了迭代器的概念
# 迭代器在 Python 中随处可见并且具有统一的标准
from typing import Iterable
from typing import Iterator

# 迭代器的定义
# Python 中迭代器也属于内置的标准类之一
# 与序列是同一层次的概念
# 迭代器对象需要具有 __iter__() 和 __next__() 两种方法
# 二者合称为迭代器协议
# 如果一个对象同时具有这两种方法解释器就会认为该对象是一个迭代器
# 如果一个对象只具有其中一个方法或者二者都不具有解释器则认为该对象不是一个迭代器
# 内置函数 isinstance() 来判断一个对象是否是某个类的实例
print("迭代器的定义:")


class BothIterAndNext:
    def __iter__(self):
        pass

    def __next__(self):
        pass


class OnlyIter:
    def __iter__(self):
        pass


class OnlyNext:
    def __next__(self):
        pass


# Python 判断一个对象是否是迭代器的标准仅仅是是否同时具有 __iter__() 和 __next__() 这两个方法
# 只有方法 __next__() 的对象既不是可迭代的也不是一个迭代器
# 只有方法 __iter__() 的对象居然是可迭代的
print(isinstance(BothIterAndNext(), Iterable))  # True
print(isinstance(BothIterAndNext(), Iterator))  # True
print(isinstance(OnlyIter(), Iterable))  # True
print(isinstance(OnlyIter(), Iterator))  # False
print(isinstance(OnlyNext(), Iterable))  # False
print(isinstance(OnlyNext(), Iterator))  # False

# 迭代器的实质
# 迭代器对象本质上代表的是一个数据流
# 通过反复调用其方法 __next__() 或将其作为参数传入 next() 函数
# 即可按顺序逐个返回数据流中的每一项
# 直到流中不再有数据项
# 从而抛出一个 StopIteration 异常终止迭代

# Python 中内置了两个函数:
# iter() - 将参数对象转换为迭代器对象
# next() - 从迭代器中取出下一项

# 所有具有方法 __iter__() 的对象均被视作可迭代的
# 方法 __iter__() 进行的操作其实就是返回一个该对象对应的迭代器
# 也就是说可迭代的的真实含义其实是可以被转换为迭代器的
# 而内置函数 iter() 也是调用对象本身具有的 __iter__() 方法来实现特定对象到迭代器的转换

# 内置函数 next() 其实是调用了对象本身的方法 __next__()
# 而该方法执行的操作就是从对象对应的数据流中取出下一项

# 因此直接调用对象的 __iter__() 和 __next__() 方法与将对象作为参数传入内置函数 iter() 和 next() 是等效的
# 要注意的一点在于:
# 对迭代器调用其本身的 __iter__() 方法
# 得到的将会是这个迭代器自身
# 该迭代器相关的状态都会被保留
# 包括该迭代器目前的迭代状态
print("迭代器的实质:")
ll1 = [1, 2, 3, 4, 5]
li1 = iter(ll1)
print(isinstance(ll1, Iterator))  # False
print(isinstance(li1, Iterator))  # True
print(next(li1))  # 1
print(next(li1))  # 2
print(next(li1))  # 3

# 取迭代器的迭代器还是自己
# 在对象本身就是一个迭代器的情况下
# 生成的对应迭代器的时候不会进行另外的操作
# 就返回这个迭代器本身作为结果
li2 = iter(li1)
print(next(li2))  # 4
print(next(li2))  # 5
# print(next(li2))  # error: StopIteration
print('ll1', ll1, id(ll1))
print('li1', li1, id(li1))
print('li2', li2, id(li2))

# 实现一个迭代器类
# 定义一个数据类型:
# 具有 __iter__() 方法并且该方法返回一个带有 __next__() 方法的对象
# 而当该类已经具有 __next__() 方法时则返回其本身
print("实现一个迭代器类:")


class Reverse:
    def __init__(self, data):
        self.data = data
        self.index = len(data)

    def __iter__(self):
        # return self
        # 支持多次迭代
        return Reverse(self.data)

    def __next__(self):
        if self.index == 0:
            raise StopIteration()
        self.index = self.index - 1
        return self.data[self.index]


re = Reverse('0123456789')
ri = iter(re)
print('re', re, id(re))
print('ri', ri, id(ri))
print(next(re))
print(next(re))
print(next(re))
print(next(re))
print(next(re))
print(next(ri))
print(next(ri))
print(next(ri))
print(next(ri))
print(next(ri))
# print(next(ri))  # StopIteration


# for语句与迭代器
# 在执行for语句的时候
# Python 悄悄调用了内置函数 iter()
# 并将for语句中的容器对象作为参数传入
# iter()返回值则是一个迭代器对象
# 然后调用迭代器对象的 __next__() 方法
# 逐个访问原容器中的各个对象
# 直到遍历完所有元素
# 抛出一个StopIteration异常时终止for循环
print("for语句与迭代器:")
re = Reverse('0123456789')

print("第一次迭代:")
for item in re:
    print(item)

print("第二次迭代:")
for item in re:
    print(item)

# 总结
# 迭代器（iterator）首先要是可迭代的（iterable）
# 即迭代器一定是可迭代的
# 但可迭代的不一定是迭代器
# 可迭代的对象意味着可以被转换为迭代器
# 迭代器需要同时具有方法 __iter__() 和 __next__()
# 对迭代器调用iter()函数得到的是这个迭代器本身
# for循环实际上使用了迭代器
# 并且一般情况下将异常StopIteration作为循环终止条件

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    迭代器的定义:
    True
    True
    True
    False
    False
    False
    迭代器的实质:
    False
    True
    1
    2
    3
    4
    5
    ll1 [1, 2, 3, 4, 5] 4422275136
    li1 <list_iterator object at 0x107ab3310> 4423627536
    li2 <list_iterator object at 0x107ab3310> 4423627536
    实现一个迭代器类:
    re <__main__.Reverse object at 0x107acc740> 4423731008
    ri <__main__.Reverse object at 0x107acc800> 4423731200
    9
    8
    7
    6
    5
    9
    8
    7
    6
    5
    for语句与迭代器:
    第一次迭代:
    9
    8
    7
    6
    5
    4
    3
    2
    1
    0
    第二次迭代:
    9
    8
    7
    6
    5
    4
    3
    2
    1
    0


# 完