# 012-Python-集合

## main.py

```python
# 集合是由不重复元素组成的无序的集
# 它的基本用法包括成员检测和消除重复元素
# 集合对象也支持像 联合，交集，差集，对称差分等数学运算

# 集合创建
# 使用大括号 {} 或者 set() 函数创建集合
# 创建一个空集合必须用 set() 而不是 {} 因为 {} 是用来创建一个空字典
print("集合创建")
set1 = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
set2 = set()
dict2 = {}
print(set1)
print(set2)
print(dict2)
print(type(set2))
print(type(dict2))

# 使用列表构建集合
ll3 = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
set3 = set(ll3)
print(ll3)
print(set3)

# 集合的基本操作
print("集合的基本操作:")
print("添加元素")
set4 = {'aaa', 'bbb', 'ccc'}
# 添加单个元素
set4.add('bbb')
set4.add('ddd')
print(set4)

# update 也可以添加元素
# 参数可以是:
# 字符串: 按序列元素添加
# 列表: 按序列元素添加
# 元组: 按序列元素添加
# 字典: 只添加key列表
# {0, 'c', 'bbb', 'd', 1, 2, 'x', 'b', 'y', 'ccc', '222', 'ddd', 'a', '111', 'aaa'}
set4.update('abcd', ['111', '222'], (0, 1, 2), {'x': 333, 'y': 444})
print(set4)

print("移除元素")
set5 = {'aaa', 'bbb', 'ccc', 'ddd'}
print(set5)
# 移除不存在的元素会报错
set5.remove('bbb')
# 移除不存在的元素不会报错
set5.discard('ccc')
set5.discard('ccc')
print(set5)

# pop() 随机删除集合中的一个元素
set6 = {'aaa', 'bbb', 'ccc', 'ddd'}
print(set6)
print(set6.pop())
print(set6.pop())
print(set6.pop())
print(set6.pop())

print("元素个数")
set7 = {'aaa', 'bbb', 'ccc'}
print(len(set7))

print("清空集合")
set8 = {'aaa', 'bbb', 'ccc'}
set8.clear()
print(set8)

print("判断元素是否存在")
set9 = {'aaa', 'bbb', 'ccc', 'ddd'}
print('bbb' in set9)
print('eee' in set9)

# 集合之间的运算符分别是:
# - 代表前者中包含后者中不包含的元素
# | 代表两者中全部元素聚在一起去重后的结果
# & 两者中都包含的元素
# ^ 不同时包含于两个集合中的元素
print("集合运算")
set11 = set('01ab')
set12 = set('ab89')
print(set11)
print(set12)
print(set11 - set12)
print(set11 | set12)
print(set11 & set12)
print(set11 ^ set12)

# 集合推导式
# 推导式又称解析式
# Python 中常见的语法糖
# 推导式可以从一个数据序列构建另一个新的数据序列
# 常用于数据处理场景
# 语法:
# 表达式 for 迭代变量 in 可迭代对象 [if 条件表达式]
# if条件可选

# 推导式的核心为 for 循环
# 根据返回对象的不同
# 推导式可区分为:
# 1 列表推导式
# 2 字典推导式
# 3 集合推导式
# 不同推导式在语法上基本一致
print("列表推导式:")
ll1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
ll2 = [i * 100 for i in ll1 if i % 2 == 0]
print(ll2)

print("字典推导式:")
dict1 = {'aaa': 1, 'bbb': 2, 'ccc': 3, 'ddd': 4}
dict2 = {key: value * 100 for key, value in dict1.items() if value % 2 == 0}
print(dict2)

print("集合推导式:")
set1 = set('ab01cd23ef')
set2 = {value for value in set1 if '0' <= value <= '9'}
print(set2)

print("推导式前面使用if必须有else:")
a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
b = [i * 10 if i < 5 else i * 100 for i in a if i % 2 == 0]
print(b)

# 集合内置方法
print("集合内置方法:")

# difference()
# 返回集合的差集
# 返回的集合元素包含在第一个集合中
# 但不包含在第二个集合中
# 返回一个新的集合
print("difference()")
set21 = set('01ab')
set22 = set('ab89')
print(set21.difference(set22))

# difference_update()
# 将第一个集合中存在于第二个集合的元素移除
# 直接在第一个集合中移除元素
# 没有返回值
print("difference_update()")
set21 = set('01ab')
set22 = set('ab89')
set21.difference_update(set22)
print(set21)

# intersection()
# 返回两个或更多集合中都包含的元素即交集
# 返回一个新的集合
print("intersection()")
set21 = set('01ab')
set22 = set('ab89')
print(set21.intersection(set22))

# intersection_update()
# 计算两个或更多集合中都包含的元素即交集
# 更新到第一个集合
print("intersection_update()")
set21 = set('01ab')
set22 = set('ab89')
set21.intersection_update(set22)
print(set21)

# union()
# 返回两个或更多集合的并集
# 包含了所有集合的元素
# 重复的元素只会出现一次
# 返回值返回一个新的集合
print("union()")
set21 = set('01ab')
set22 = set('ab89')
print(set21.union(set22))

# isdisjoint()
# 判断两个集合是否包含相同的元素
# 如果没有返回 True
# 否则返回 False
print("isdisjoint()")
set21 = set('01ab')
set22 = set('ab89')
print(set21.isdisjoint(set22))

# issubset()
# 判断集合的所有元素是否都包含在指定集合中
# 如果是则返回 True
# 否则返回 False
print("issubset()")
set21 = set('01ab')
set22 = set('ab8901')
print(set21.issubset(set22))

# issuperset()
# 判断指定集合的所有元素是否都包含在原始的集合中
# 如果是则返回 True
# 否则返回 False
print("issuperset()")
set21 = set('01ab89')
set22 = set('ab89')
print(set21.issuperset(set22))

# symmetric_difference()
# 返回两个集合中不重复的元素集合
# 会移除两个集合中都存在的元素
# 结果返回一个新的集合
print("symmetric_difference()")
set21 = set('01ab')
set22 = set('ab89')
print(set21.symmetric_difference(set22))

# symmetric_difference_update()
# 移除当前集合中在另外一个指定集合相同的元素
# 并将另外一个指定集合中不同的元素插入到当前集合中
# 更新到第一个集合
print("symmetric_difference_update()")
set21 = set('01ab')
set22 = set('ab89')
set21.symmetric_difference_update(set22)
print(set21)

# 生成器
# 如果列表元素可以按照某种算法推算出来
# 在循环的过程中不断推算出后续的元素
# 这种一边循环一边计算的机制
# 称为生成器(generator)

# 创建一个generator的第一种方法
# 把一个列表推导式的[]改成()
# 就创建了一个generator
print("创建一个generator的第一种方法:")
g = (x * x for x in range(3))
print(g)
# next()函数获得generator的下一个返回值
# 每次调用next()就计算下一个元素的值
# 直到计算到最后一个元素
# 没有更多的元素时抛出StopIteration错误
print(next(g))
print(next(g))
print(next(g))
# print(next(g))

# 正确的方法是使用for循环来迭代
# 不需要关心StopIteration的错误
print("使用for循环来迭代:")
g = (x * x for x in range(3))
for n in g:
    print(n)

# 创建一个generator的另一种方法
# 如果一个函数定义中包含yield关键字
# 那么这个函数就不再是一个普通函数
# 而是一个generator函数
# 调用一个generator函数将返回一个generator对象
print("创建一个generator的另一种方法:")


# 斐波拉契数列
# 除第一个和第二个数外
# 任意一个数都是前两个数的和
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'


# 最难理解的就是generator函数和普通函数的执行流程不一样
# 普通函数遇到return语句或者最后一行函数语句就返回
# generator函数在每次调用next()的时候执行
# 遇到yield语句返回
# 再次执行时从上次返回的yield语句处继续执行
f = fib(6)
print(f)
print(next(f))
print(next(f))
print(next(f))
print(next(f))

print("使用for循环来迭代:")
for n in fib(6):
    print(n)

# 用for循环调用generator时
# 拿不到 return 语句的返回值
# 如果想要拿到 return 语句返回值
# 必须捕获 StopIteration 错误
# 返回值包含在 StopIteration 的 value 中
print("获取return返回值:")
f = fib(6)
while True:
    try:
        print(next(f))
    except StopIteration as e:
        print(f"return: {e.value}")
        break

# generator是非常强大的工具
# 在Python中可以简单地把列表生成式改成generator
# 也可以通过函数实现复杂逻辑的generator

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    集合创建
    {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
    set()
    {}
    <class 'set'>
    <class 'dict'>
    [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
    {1, 2, 3, 4, 5}
    集合的基本操作:
    添加元素
    {'bbb', 'ddd', 'aaa', 'ccc'}
    {0, 1, 2, 'x', 'd', '111', 'c', 'b', 'a', 'bbb', 'ddd', 'y', '222', 'aaa', 'ccc'}
    移除元素
    {'ccc', 'bbb', 'aaa', 'ddd'}
    {'aaa', 'ddd'}
    {'ccc', 'bbb', 'aaa', 'ddd'}
    ccc
    bbb
    aaa
    ddd
    元素个数
    3
    清空集合
    set()
    判断元素是否存在
    True
    False
    集合运算
    {'a', '0', '1', 'b'}
    {'a', '8', '9', 'b'}
    {'0', '1'}
    {'1', '8', 'b', 'a', '9', '0'}
    {'a', 'b'}
    {'1', '8', '9', '0'}
    列表推导式:
    [0, 200, 400, 600, 800]
    字典推导式:
    {'bbb': 200, 'ddd': 400}
    集合推导式:
    {'0', '1', '2', '3'}
    推导式前面使用if必须有else:
    [0, 20, 40, 600, 800]
    集合内置方法:
    difference()
    {'0', '1'}
    difference_update()
    {'1', '0'}
    intersection()
    {'a', 'b'}
    intersection_update()
    {'a', 'b'}
    union()
    {'1', '8', 'b', 'a', '9', '0'}
    isdisjoint()
    False
    issubset()
    True
    issuperset()
    True
    symmetric_difference()
    {'1', '8', '9', '0'}
    symmetric_difference_update()
    {'1', '8', '9', '0'}
    创建一个generator的第一种方法:
    <generator object <genexpr> at 0x10f8f8520>
    0
    1
    4
    使用for循环来迭代:
    0
    1
    4
    创建一个generator的另一种方法:
    <generator object fib at 0x10f9f5a80>
    1
    1
    2
    3
    使用for循环来迭代:
    1
    1
    2
    3
    5
    8
    获取return返回值:
    1
    1
    2
    3
    5
    8
    return: done


# 完