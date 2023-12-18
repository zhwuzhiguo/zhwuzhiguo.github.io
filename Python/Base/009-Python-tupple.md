# 009-Python-tupple

## main.py

```python
# Python 的元组与列表类似
# 不同之处在于元组的元素不能修改
# 元组使用小括号()
# 列表使用方括号[]

# 1.元组基本操作
print("元组基本操作")
# 创建元组
# 元组创建很简单
# 只需要在括号中添加元素(不需要括号也可以)
# 并使用逗号隔开即可
tup1 = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
tup2 = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
# 元组中只包含一个元素时
# 需要在元素后面添加逗号
# 否则括号会被当作运算符使用
tup3 = (1,)
tup4 = 1,
# 创建空元组
tup5 = ()

print(tup1)
print(tup2)
print(tup3)
print(tup4)
print(tup5)

print(type(tup1))
print(type(tup2))
print(type(tup3))
print(type(tup4))
print(type(tup5))

# 访问元组
# 元组的访问和序列访问元素一样
# 都是通过下标索引进行访问操作
tup = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
print(tup[0])
print(tup[5])
print(tup[-1])
print(tup[0:5])
print(tup[0:10])

# 修改元组
# 元组中的值一旦定义就不能修改
# 但可以通过元组与元组之间的连接关系来创建新元组
tup1 = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
tup2 = (10, 11, 12)
tup3 = tup1 + tup2
print(tup3)

# 删除元组
# 由于元组的不可修改性
# 所以元组中的元素值是不允许删除的
# 可以使用 del 语句来删除整个元组
tup = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
print(tup)
# del tup
print(tup)

# 2.元组运算符
# 元组之间可以使用 + 号和 * 号进行运算
# 这就意味着他们可以组合和复制
# 运算后会生成一个新的元组
print("元组运算符")

# 元组求长度
tup = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
print(len(tup))

# 连接元组
tup1 = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
tup2 = (10, 11, 12)
tup3 = tup1 + tup2
print(tup3)

# 复制元组
tup1 = (0, 1, 2, 3)
tup2 = tup1 * 3
print(tup2)

# 判断元素
tup = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
hasValue = 5 in tup
print(hasValue)

# 元组中指定位置元素访问
tup = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
print(tup[0])
print(tup[5])
print(tup[-1])
print(tup[-2])
print(tup[0:5])

# 3.元组内置函数
print("元组内置函数")
tup = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

# 元组元素个数
print(len(tup))

# 元组中元素最大值
print(max(tup))

# 元组中元素最小值
print(min(tup))

# 将列表转换为元组。
ll = ['a', 'b', 'c']
tup = tuple(ll)
print(ll)
print(tup)
print(type(ll))
print(type(tup))

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    元组基本操作
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    (1,)
    (1,)
    ()
    <class 'tuple'>
    <class 'tuple'>
    <class 'tuple'>
    <class 'tuple'>
    <class 'tuple'>
    0
    5
    9
    (0, 1, 2, 3, 4)
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    元组运算符
    10
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)
    (0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3)
    True
    0
    5
    9
    8
    (0, 1, 2, 3, 4)
    元组内置函数
    10
    9
    0
    ['a', 'b', 'c']
    ('a', 'b', 'c')
    <class 'list'>
    <class 'tuple'>


# 完