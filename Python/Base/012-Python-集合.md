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
    {'bbb', 'ccc', 'aaa', 'ddd'}
    {0, 1, 2, 'a', 'aaa', 'c', 'x', 'd', '222', 'b', 'ddd', 'bbb', 'y', 'ccc', '111'}
    移除元素
    {'bbb', 'ccc', 'aaa', 'ddd'}
    {'aaa', 'ddd'}
    {'bbb', 'ccc', 'aaa', 'ddd'}
    bbb
    ccc
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
    {'1', '0', 'b', 'a'}
    {'9', 'b', 'a', '8'}
    {'1', '0'}
    {'0', '9', 'a', 'b', '8', '1'}
    {'a', 'b'}
    {'0', '9', '8', '1'}
    列表推导式:
    [0, 200, 400, 600, 800]
    字典推导式:
    {'bbb': 200, 'ddd': 400}
    集合推导式:
    {'1', '0', '3', '2'}
    推导式前面使用if必须有else:
    [0, 20, 40, 600, 800]
    集合内置方法:
    difference()
    {'1', '0'}
    difference_update()
    {'0', '1'}
    intersection()
    {'a', 'b'}
    intersection_update()
    {'a', 'b'}
    union()
    {'0', '9', 'a', 'b', '8', '1'}
    isdisjoint()
    False
    issubset()
    True
    issuperset()
    True
    symmetric_difference()
    {'0', '9', '8', '1'}
    symmetric_difference_update()
    {'0', '9', '8', '1'}


# 完