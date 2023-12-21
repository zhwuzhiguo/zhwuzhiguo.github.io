# 014-Python-高阶函数

## main.py

```python
# 使用函数式编程
from functools import reduce
from math import sqrt


# 高阶函数概念
# 在函数式编程中
# 可以将函数当作变量一样自由使用
# 一个函数接收另一个函数作为参数
# 这种函数称之为高阶函数
def fun_high(fun, array):
    return [fun(item) for item in array if item > 0]


def fact(number):
    if number == 1:
        return 1
    return number * fact(number - 1)


print("高阶函数概念:")
print(fun_high(fact, [0, 1, 2, 3, 4]))
print(fun_high(fact, [1, 2, 3, 4]))
print(fun_high(sqrt, [1, 2, 3, 4]))

# 常用高阶函数
# 各种语言常用的高阶函数基本都一致
# 开发中经常使用的最基本的高阶函数其实就几个
# 我们也可以基于这些函数去进行适当的扩展
print("常用高阶函数:")


def square(number):
    return number ** 2


def add(num1, num2):
    return num1 + num2


def even(number):
    return number % 2 == 0


# map
# 根据提供的函数对指定序列做映射
# 并返回映射后的序列
# 定义:
# map(func, *iterables) --> map object
# func - 序列中的每个元素需要执行的操作(可以是匿名函数)
# *iterables - 一个或多个序列
print("map:")
map1 = map(square, (1, 2, 3, 4))
map2 = map(square, [1, 2, 3, 4])
map3 = map(add, (1, 2, 3, 4), (1, 2, 3, 4))
map4 = map(add, [1, 2, 3, 4], [1, 2, 3, 4])
print(list(map1))
print(list(map2))
print(list(map3))
print(list(map4))
# 列表长度不一致按短的算
map5 = map(add, [1, 2, 3], [1, 2, 3, 4])
print(list(map5))
# 使用匿名函数
map6 = map(lambda a, b: a + b, [1, 2, 3], [1, 2, 3, 4])
print(list(map6))

# reduce
# reduce 函数需要传入一个有两个参数的函数
# 然后用这个函数从左至右顺序遍历序列并生成结果
# 定义:
# reduce(function, sequence[, initial]) -> value
# function - 序列中的每个元素需要执行的操作(可以是匿名函数)
# sequence - 需要执行操作的序列
# initial - 可选初始参数
# 最后返回函数的计算结果和初始参数类型相同
# 注意:
# 现在 reduce() 函数已经放入到functools包中
print("reduce:")
reduce1 = reduce(add, [1, 2, 3])
reduce2 = reduce(add, [1, 2, 3], 10)
reduce3 = reduce(lambda a, b: a + b, [1, 2, 3])
reduce4 = reduce(lambda a, b: a + b, [1, 2, 3], 10)
print(reduce1)
print(reduce2)
print(reduce3)
print(reduce4)

# filter
# filter() 函数用来过滤序列中不符合条件的值
# 返回一个迭代器
# 该迭代器生成那些函数(项)为 true 的 iterable 项
# 如果函数为 None 则返回为 true 的项
# 定义:
# filter(function or None, iterable) --> filter object
# function or None - 过滤操作执行的函数
# iterable - 需要过滤的序列
print("filter:")
filter1 = filter(even, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
filter2 = filter(None, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
filter3 = filter(None, [True, True, False, True])
filter4 = filter(lambda x: x % 2 == 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
print(list(filter1))
print(list(filter2))
print(list(filter3))
print(list(filter4))

# sorted
# sorted 函数默认将序列升序排列后返回一个新的 list
# 还可以自定义键函数来进行排序
# 也可以设置 reverse 参数确定是升序还是降序
# 如果 reverse = True 则为降序
# 定义:
# def sorted(iterable: Iterable[_T], *, key: Optional[Callable[[_T], Any]] = ..., reverse: bool = ...) -> List[_T]: ...
# iterable - 序列
# key - 可以用来计算的排序函数
# reverse - 排序规则
# True降序
# False升序(默认)
print("sorted:")
sorted1 = sorted([10, -20, 30, -40, 50])
sorted2 = sorted([10, -20, 30, -40, 50], key=abs)
sorted3 = sorted([10, -20, 30, -40, 50], reverse=True)
sorted4 = sorted([10, -20, 30, -40, 50], key=abs, reverse=True)
sorted5 = sorted(['a', 'aa', 'aaaa', 'bbb'], key=lambda x: len(x))
print(sorted1)
print(sorted2)
print(sorted3)
print(sorted4)
print(sorted5)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    高阶函数概念:
    [1, 2, 6, 24]
    [1, 2, 6, 24]
    [1.0, 1.4142135623730951, 1.7320508075688772, 2.0]
    常用高阶函数:
    map:
    [1, 4, 9, 16]
    [1, 4, 9, 16]
    [2, 4, 6, 8]
    [2, 4, 6, 8]
    [2, 4, 6]
    [2, 4, 6]
    reduce:
    6
    16
    6
    16
    filter:
    [0, 2, 4, 6, 8]
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
    [True, True, True]
    [0, 2, 4, 6, 8]
    sorted:
    [-40, -20, 10, 30, 50]
    [10, -20, 30, -40, 50]
    [50, 30, 10, -20, -40]
    [50, -40, 30, -20, 10]
    ['a', 'aa', 'bbb', 'aaaa']


# 完