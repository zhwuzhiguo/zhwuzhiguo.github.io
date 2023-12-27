# 026-Python-之对象的比较与拷贝

## main.py

```python
# 如何判断两个对象是否是同一个对象呢
# == 操作符比较两个对象的值是否相等
# is 操作符比较二者是否是同一个对象
import copy

# Python 中一切皆是对象
# 对象包含三个要素:
# id - 唯一身份标识
# type - 类型
# value - 值

# id 可以通过函数 id(obj) 来获取
# is 操作符就相当于比较两个对象的 id 是否相同
# == 操作符则相当于比较两个对象的 value 是否相同

# 比较操作符 is 的效率要优于 ==
# 因为 is 操作符无法被重载
# 执行 is 操作只是对比对象的 id 而已
# 而 == 操作符则会递归地遍历对象的所有值并逐一比较
print("== 操作符和 is:")

num1 = 256
num2 = 256
print("num1 == num2", num1 == num2)
print("num1 is num2", num1 is num2)
# 输出:
# num1 == num2 True
# num1 is num2 True

num3 = 257
num4 = 257
print("num3 == num4", num3 == num4)
print("num3 is num4", num3 is num4)
# 输出:
# num3 == num4 True
# num3 is num4 True

ll1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
ll2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print("ll1 == ll2", ll1 == ll2)
print("ll1 is ll2", ll1 is ll2)
# 输出:
# ll1 == ll2 True
# ll1 is ll2 False

# 在交互模式下执行
# 257 不是同一个对象
# num1 = 256
# num2 = 256
# print("num1 == num2", num1 == num2)
# num1 == num2 True
# print("num1 is num2", num1 is num2)
# num1 is num2 True
#
# num3 = 257
# num4 = 257
# print("num3 == num4", num3 == num4)
# num3 == num4 True
# print("num3 is num4", num3 is num4)
# num3 is num4 False

# 在交互模式
# 下每一条命令就是一个代码块
# Python 逐行编译执行
# 事实上 a is b 为 True 的结论只适用于 -5 到 256 的数值，因为
# 出于性能的考虑
# Python 对 -5 到 256 这个范围内的数值进行了缓存
# 当为整数对象赋值时 -5 到 256 时并不会生成新的对象
# 而是使用事先创建好的缓存对象
# 如果超过了缓存范围
# 那么就会申请新的内存地址

# 在编辑器中
# 一个函数、一个类或者一个文件才是一个代码块
# Python 会整体编译执行
# 因此相同值的变量只会初始化一次
# 第二次初始化相同值的变量时会重用旧值


# 对象的拷贝
# Python 中共有两种拷贝模式
# 浅拷贝
# 深拷贝

# 浅拷贝和深拷贝的区别:
# 浅拷贝只拷贝顶层对象
# 不会去拷贝内部的子元素对象
# 深拷贝则会递归地拷贝顶层对象内部的子元素对象
# 新对象和原来的旧对象没有任何关联
# Python 使用 copy.copy() 实现浅拷贝(还有构造器、分片)
# Python 使用 copy.deepcopy() 实现深拷贝

# 具体到拷贝对象的时候:
# 如果顶层对象和子元素对象都是不可变类型，浅拷贝和深拷贝无区别，都指向原对象。
# 如果顶层对象和子元素对象存在可变类型，深拷贝创建全新顶层对象和全新子元素对象。
# 浅拷贝只需考虑顶层对象，子元素对象是直接引用赋值。
# 如果顶层对象是不可变类型，浅拷贝目标顶层对象指向原顶层对象。
# 如果顶层对象是可变类型，浅拷贝目标顶层对象指向新顶层对象。
print("对象的拷贝:")

print("情况一:")
print("顶层对象不可变:")
print("子元素对象不可变:")
a = (1, "abc", (1, 2))
b = copy.copy(a)
c = copy.deepcopy(a)
print("a", a)
print("b", b)
print("c", c)
print("a is b", a is b)
print("a is c", a is c)

print("情况二:")
print("顶层对象不可变:")
print("子元素对象可变:")
a = (1, "abc", [1, 2])
b = copy.copy(a)
c = copy.deepcopy(a)
print("a", a)
print("b", b)
print("c", c)
print("a is b", a is b)
print("a is c", a is c)
a[2][0] = 100
print("a", a)
print("b", b)
print("c", c)

print("情况三:")
print("顶层对象可变:")
print("子元素对象不可变:")
a = [1, "abc", (1, 2)]
b = copy.copy(a)
c = copy.deepcopy(a)
print("a", a)
print("b", b)
print("c", c)
print("a is b", a is b)
print("a is c", a is c)
a[0] = 100
print("a", a)
print("b", b)
print("c", c)

print("情况四:")
print("顶层对象可变:")
print("子元素对象可变:")
a = [1, "abc", [1, 2]]
b = copy.copy(a)
c = copy.deepcopy(a)
print("a", a)
print("b", b)
print("c", c)
print("a is b", a is b)
print("a is c", a is c)
a[0] = 100
a[2][0] = 100
print("a", a)
print("b", b)
print("c", c)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    == 操作符和 is:
    num1 == num2 True
    num1 is num2 True
    num3 == num4 True
    num3 is num4 True
    ll1 == ll2 True
    ll1 is ll2 False
    对象的拷贝:
    情况一:
    顶层对象不可变:
    子元素对象不可变:
    a (1, 'abc', (1, 2))
    b (1, 'abc', (1, 2))
    c (1, 'abc', (1, 2))
    a is b True
    a is c True
    情况二:
    顶层对象不可变:
    子元素对象可变:
    a (1, 'abc', [1, 2])
    b (1, 'abc', [1, 2])
    c (1, 'abc', [1, 2])
    a is b True
    a is c False
    a (1, 'abc', [100, 2])
    b (1, 'abc', [100, 2])
    c (1, 'abc', [1, 2])
    情况三:
    顶层对象可变:
    子元素对象不可变:
    a [1, 'abc', (1, 2)]
    b [1, 'abc', (1, 2)]
    c [1, 'abc', (1, 2)]
    a is b False
    a is c False
    a [100, 'abc', (1, 2)]
    b [1, 'abc', (1, 2)]
    c [1, 'abc', (1, 2)]
    情况四:
    顶层对象可变:
    子元素对象可变:
    a [1, 'abc', [1, 2]]
    b [1, 'abc', [1, 2]]
    c [1, 'abc', [1, 2]]
    a is b False
    a is c False
    a [100, 'abc', [100, 2]]
    b [1, 'abc', [100, 2]]
    c [1, 'abc', [1, 2]]


# 完