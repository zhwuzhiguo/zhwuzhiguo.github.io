# 017-Python-之引用

## main.py

```python
# Python 中的变量具有一个特殊的属性：
# identity 身份标识
# 这种特殊的属性也在很多地方被称为引用
import sys

# 先要介绍两个工具:
# 一个内置函数:
# id()
# 一个运算符:
# is
# 还有一个sys模块内的函数：
# getrefcount()

# 内置函数id()
# id(object)
# 返回值为传入对象的标识
# 该标识是一个唯一的常数
# 在传入对象的生命周期内与之一一对应
# 生命周期没有两个对象可能拥有相同的id()返回值
# CPython 实现细节:
# 标识实际上就是对象在内存中的地址
# 不论是否是 CPython 实现
# 一个对象的id就可以视作是其虚拟的内存地址
print("内置函数id():")
num1 = 123
num2 = 123
num3 = 456
str1 = 'aaa'
str2 = 'aaa'
str3 = 'bbb'
print('num1', num1, id(num1))
print('num2', num2, id(num2))
print('num3', num3, id(num3))
print('str1', str1, id(str1))
print('str2', str2, id(str2))
print('str3', str3, id(str3))

# 运算符is
# is 的作用是比较对象的标识是否相同
print("运算符is:")
print(num1 is num2)
print(num1 is num3)
print(str1 is str2)
print(str1 is str3)


# sys模块函数getrefcount()
# sys.getrefcount(object)
# 返回值是传入对象的引用计数
# 由于作为参数传入getrefcount()的时候产生了一次临时引用
# 因此返回的计数值一般要比预期多1
# 引用计数被定义为对象被引用的次数
# 一旦引用计数归零
# 则对象所在的内存被释放
# 这是 Python 内部进行自动内存管理的一个机制
class User:
    pass


print("getrefcount():")
user = User()
user1 = user
user2 = user
print(sys.getrefcount(user))

# 问题示例
# Python 中变量不是一段固定的地址
# 而是各个对象所附着的标签。
# 理解这一点对于理解 Python 的很多特性十分重要

# 对同一变量赋值
# 每次将一个新的对象赋值给一个变量
# 都在内存中重新创建了一个对象
# 这个对象就具有新引用值
# 变量也就指向了新对象的新引用值

# 相同整数对象标识相同
# 不同整数对象标识不同
print("对同一变量赋值:")
num = 1000000000
print('num', num, id(num))
num = 1000000000
print('num', num, id(num))
num = 1234567890
print('num', num, id(num))

# 俩个相同列表的对象标识不同
ll = [1, 2]
print('ll', ll, id(ll))
ll = [1, 2]
print('ll', ll, id(ll))

# 对数值进行加减乘除并将结果赋给原来的变量
# 都会改变变量对应的引用值
num = 123
print('num', num, id(num))
num = num + 123
print('num', num, id(num))
# 值不变对象标识不变
num = num * 1
print('num', num, id(num))

# 列表计算赋值
# 即使列表内容相同
# 对象标识也不同
ll = [1, 2, 3]
print('ll', ll, id(ll))
ll = [1, 2] + [3]
print('ll', ll, id(ll))
ll = ll + [4]
print('ll', ll, id(ll))

# 不变的情况
# 列表可以通过直接操作变量本身
# 从而在不改变其引用的情况下改变所引用的值
# 也就是说:
# 对于变量本身进行的操作并不会创建新的对象
# 而是会直接改变原有对象的值
print("不变的情况:")
ll = [1, 2, 3]
print('ll', ll, id(ll))
ll[1] = 0
print('ll', ll, id(ll))
ll.append(4)
print('ll', ll, id(ll))

# 两个变量同时引用一个列表
# 对其中一个变量本身直接进行操作
# 也会影响到另一个变量的值
ll1 = [1, 2, 3]
ll2 = ll1
print('ll1', ll1, id(ll1))
print('ll2', ll2, id(ll2))
ll1[1] = 0
ll1.append(4)
del ll1[2]
print('ll1', ll1, id(ll1))
print('ll2', ll2, id(ll2))

# 一个特殊的地方
# 数值数据和列表还存在一个特殊的差异
print("一个特殊的地方:")

# 数值数据加法
# 对象标识不同
num = 123
print('num', num, id(num))
num += 1
print('num', num, id(num))

# 列表加法
# + 对象标识不同
# += 对象标识相同
# 这是因为加法运算符在 Python 中存在重载的情况
# 对列表对象和数值对象来说
# 加法运算的底层实现是完全不同的
# 在简单的加法(+)中列表的运算还是创建了一个新列表对象
# 在简写的加法运算(+=)实现中并没有创建新列表对象
ll = [1, 2, 3]
print('ll', ll, id(ll))
ll = ll + [4]  # 对象标识改变
print('ll', ll, id(ll))
ll += [5]  # 对象标识不变
print('ll', ll, id(ll))

# 原理解析
print("原理解析:")
# Python 中的六个标准数据类型分为两大类:
# 1 可变数据类型: 列表、字典和集合
# 2 不可变数据类型: 数字、字符串和元组
# 上面数值数据和列表之间的差异正是这两种不同的数据类型导致的:
# 由于数字是不可变对象:
# 不能够对数值本身进行任何可以改变数据值的操作
# 因此每出现一个数值都意味着需要另外分配一个新的内存空间(常量池中的数值例外)
# 而对于可变对象:
# 列表的值是可以在不新建对象的情况下进行改变的
# 因此对列表对象本身直接进行操作
# 是可以达到改变变量值而不改变引用的目的的

# 一个测试:
# 不可变数据类型: 数字、字符串和元组
# 相等的值都有相同的对象标识
# 说明不可变数据类型对象会缓存

# num 和 10000 使用同一个对象
num = 10000
print('num == 10000', num == 10000)
print('num is 10000', num is 10000)
print('num', num, id(num))
print('10000', 10000, id(10000))
print('sys.getrefcount(num)', sys.getrefcount(num))
print('sys.getrefcount(10000)', sys.getrefcount(10000))

# tup 和 (1, 2, 3) 使用同一个对象
tup = (1, 2, 3)
print('tup == (1, 2, 3)', tup == (1, 2, 3))
print('tup is (1, 2, 3)', tup is (1, 2, 3))
print('tup', tup, id(tup))
print('(1, 2, 3)', (1, 2, 3), id((1, 2, 3)))
print('sys.getrefcount(tup)', sys.getrefcount(tup))
print('sys.getrefcount((1, 2, 3))', sys.getrefcount((1, 2, 3)))

# s 和 'abcdefg' 使用同一个对象
s = 'abcdefg'
print("s == 'abcdefg'", s == 'abcdefg')
print("s is 'abcdefg'", s is 'abcdefg')
print('s', s, id(s))
print('abcdefg', 'abcdefg', id('abcdefg'))
print('sys.getrefcount(s)', sys.getrefcount(s))
print("sys.getrefcount('abcdefg')", sys.getrefcount('abcdefg'))

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    /Users/wuzhiguo/py/pydemo/main.py:188: SyntaxWarning: "is" with 'int' literal. Did you mean "=="?
      print('num is 10000', num is 10000)
    /Users/wuzhiguo/py/pydemo/main.py:197: SyntaxWarning: "is" with 'tuple' literal. Did you mean "=="?
      print('tup is (1, 2, 3)', tup is (1, 2, 3))
    /Users/wuzhiguo/py/pydemo/main.py:206: SyntaxWarning: "is" with 'str' literal. Did you mean "=="?
      print("s is 'abcdefg'", s is 'abcdefg')
    内置函数id():
    num1 123 4498134640
    num2 123 4498134640
    num3 456 4476679792
    str1 aaa 4478618624
    str2 aaa 4478618624
    str3 bbb 4478619056
    运算符is:
    True
    False
    True
    False
    getrefcount():
    4
    对同一变量赋值:
    num 1000000000 4476679920
    num 1000000000 4476679920
    num 1234567890 4478064016
    ll [1, 2] 4477274496
    ll [1, 2] 4477767040
    num 123 4498134640
    num 246 4498138576
    num 246 4498138576
    ll [1, 2, 3] 4477274496
    ll [1, 2, 3] 4477665024
    ll [1, 2, 3, 4] 4477765824
    不变的情况:
    ll [1, 2, 3] 4477665024
    ll [1, 0, 3] 4477665024
    ll [1, 0, 3, 4] 4477665024
    ll1 [1, 2, 3] 4477765824
    ll2 [1, 2, 3] 4477765824
    ll1 [1, 0, 4] 4477765824
    ll2 [1, 0, 4] 4477765824
    一个特殊的地方:
    num 123 4498134640
    num 124 4498134672
    ll [1, 2, 3] 4477274496
    ll [1, 2, 3, 4] 4477767040
    ll [1, 2, 3, 4, 5] 4477767040
    原理解析:
    num == 10000 True
    num is 10000 True
    num 10000 4478064080
    10000 10000 4478064080
    sys.getrefcount(num) 4
    sys.getrefcount(10000) 4
    tup == (1, 2, 3) True
    tup is (1, 2, 3) True
    tup (1, 2, 3) 4478713088
    (1, 2, 3) (1, 2, 3) 4478713088
    sys.getrefcount(tup) 3
    sys.getrefcount((1, 2, 3)) 3
    s == 'abcdefg' True
    s is 'abcdefg' True
    s abcdefg 4478749024
    abcdefg abcdefg 4478749024
    sys.getrefcount(s) 4294967295
    sys.getrefcount('abcdefg') 4294967295


# 完