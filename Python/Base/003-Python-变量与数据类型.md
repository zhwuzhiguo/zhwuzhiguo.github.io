# 003-Python-变量与数据类型

## main.py

```python
# Python 中的变量不需要声明
# 每个变量在使用前都必须赋值
# 变量赋值以后该变量才会被创建
a = 123

# Python 中变量没有类型
# 我们所说的类型是变量所指的内存中对象的类型
b = "abc"

# 同一个变量可以反复赋值
# 而且可以是不同类型的值
# 这种变量本身类型不固定的语言称之为动态语言
c = 123
print(c)
c = "abc"
print(c)

# 多个变量赋值
a = b = c = 1
print("a:", a)
print("b:", b)
print("c:", c)

a, b, c = 1, 2, "ccc"
print("a:", a)
print("b:", b)
print("c:", c)

# 常量就是不能变的变量
# Python 中通常用全部大写的变量名表示常量
# Python 无法保证常量不会被改变
BI = 3.14
print(BI)

# 数据类型
# 六个标准的数据类型：
# 不可变：
# Number（数字）
# String（字符串）
# Tuple（元组）
# 可变：
# List（列表）
# Sets（集合）
# Dictionary（字典）

# Number（数字）
# Python3 支持 int、float、bool、complex（复数）
# Python3 整型没有限制大小
# 可以当作 Long 类型使用
print("Number（数字）")
a = 123
b = 3.14
c = True
d = False
comp = 123 + 456j
print(a)
print(b)
print(c)
print(d)
print(comp)

# 数字类型转换
a = int("123")
b = float("3.14")
c = bool("True")
d = bool("False")
comp = complex(123.12, 456.45)
print(a)
print(b)
print(c)
print(d)
print(comp)

# 数值运算
print(5 + 4)  # 加法 输出 9
print(4.3 - 2)  # 减法 输出 2.3
print(3 * 7)  # 乘法 输出 21
print(2 / 4)  # 除法得到一个浮点数 输出 0.5
print(2 // 4)  # 除法得到一个整数 输出 0
print(17 % 3)  # 取余 输出 2
print(2 ** 5)  # 乘方 输出 32

# String（字符串）
# 创建字符串可以使用单引号、双引号、三个单引号和三个双引号
# 三个引号可以多行定义字符串
# 不支持单字符类型
# 单字符也是一个字符串
print("String（字符串）")
print('aaa')
print("bbb")
print('''aaa''')
print("""aaa""")
print('''aaa
bbb
ccc''')
print("""ddd
eee
fff""")

# 字符串常见操作
# 取子串：
# str[start:end:step]
# start:开始位置
# end:结束位置(不包含)
# step:步长(正负步长都可以)
s = '0123456789'
print("字符串常见操作:")
print(s[0])  # 0
print(s[1])  # 1
print(s[-1])  # 9
print(s[-2])  # 8

print(s[1:8])  # 1234567
print(s[1:8:1])  # 1234567
print(s[1:8:2])  # 1357
print(s[1:])  # 123456789 正步长不指定end默认结尾
print(s[:8])  # 01234567 正步长不指定start默认开头

print(s[8:1])  # 输出空
print(s[8:1:-1])  # 8765432
print(s[8:1:-2])  # 8642
print(s[8::-1])  # 876543210 负步长不指定end默认开头
print(s[:1:-1])  # 98765432 负步长不指定start默认结尾

print(s[::])  # 0123456789
print(s[::1])  # 0123456789
print(s[::-1])  # 9876543210

s = 'Abcde'
print(s.replace('bcd', 'xxx'))  # Axxxe
print(s.find('A'))  # 0
print(s.find('c', 2))  # 2
print(s.find('c', 3))  # -1
print(s.find('3333'))  # -1
print(s.index('A'))  # 0
print(s.index('b'))  # 1
# print(s.index('x'))  # 不存在报错

print(s.upper())  # ABCDE
print(s.lower())  # abcde
print(s.islower())  # False
print(s.isupper())  # False
print(s.istitle())  # True
print(s.swapcase())  # aBCDE

print('abc'.islower())  # True
print('ABC'.isupper())  # True
print('Abc'.istitle())  # True
print('ABC'.istitle())  # False
print('abc'.istitle())  # False
print('ABc'.istitle())  # False

# 去空格
print(" aa ".strip())  # aa
print(" aa ".lstrip())  # aa
print(" aa ".rstrip())  # aa

# 格式化
print('{}, {}'.format(21, 'jack'))  # 21, jack
print('{0}, {1}, {0}'.format('jack', 21))  # jack, 21, jack
print('{name}: {age}'.format(age=21, name='jack'))  # jack: 21

# 格式化补充
print("格式化补充:")
age = 123
name = "jack"
print("%s is %d years old." % (name, age))  # jack is 123 years old.
print(f"{name} is {age} years old.")  # jack is 123 years old.
print("{} is {} years old.".format(name, age))  # jack is 123 years old.
print("{name} is {age} years old.".format(name=name, age=age))  # jack is 123 years old.

# 字符串前加r表示字符串不转义
print("字符串前加r表示字符串不转义:")
print("abc\tdef")
print(r"abc\tdef")

# 连接与分割
# 使用 + 连接字符串
# 每次操作会重新计算、开辟、释放内存，效率很低
# 所以推荐使用join
s = ['2017', '03', '29', '22:00']
s1 = '-'.join(s)
s2 = s1.split('-')
print(s)  # ['2017', '03', '29', '22:00']
print(s1)  # 2017-03-29-22:00
print(s2)  # ['2017', '03', '29', '22:00']

# 字符串编码
# Python 字符串都是 Unicode 字符串
# 当需要将文件保存到外设或进行网络传输时
# 就要进行编码转换
# 将字符转换为字节以提高效率
print("字符串编码:")
s = '学习Python'
print(s.encode())  # b'\xe5\xad\xa6\xe4\xb9\xa0Python'
print(s.encode('gbk'))  # b'\xd1\xa7\xcf\xb0Python'
print(s.encode().decode())  # 学习Python
print(s.encode('utf8').decode('utf8'))  # 学习Python
print(s.encode('gbk').decode('gbk'))  # 学习Python

# 字符编码
print("字符编码:")
print(ord("A"))  # 65
print(chr(65))  # A

# Tuple（元组）
# 元组（tuple）与列表类似
# 不同之处在于元组的元素不能修改
# 元组写在小括号里
# 元素之间用逗号隔开
# 组中的元素类型可以不同
print("Tuple（元组）")
people = ('jack', 20, 175.5, 'BJ')
print(people)
print(people[0])
print(people[1])
print(people[2])
print(people[3])
print(people[1:3])
print(people[1:])
print(people[:3])
print(people[0:3])

# List（列表）
# 列表是写在方括号之间用逗号分隔开的元素列表
# 列表中元素的类型可以不相同
# 表中的元素是可以改变
print("List（列表）")
data = [111, 222, 'aaa', 'bbb', 'ccc']
print(data)
print(data[0])
print(data[1])
print(data[2])
print(data[3])
print(data[4])
data[0] = 0
data.append(222)
print(data)
data.remove(222)  # 只删除第一个相等的元素
print(data)
data.insert(3, 222)
print(data)
print(data.count(222))
print(data.index(222))
print(len(data))

# Sets（集合）
# 集合是一个无序不重复元素的序列
# 使用大括号或者 set() 函数创建集合
# 创建一个空集合必须用 set() 而不是 {}
# 因为 {} 是用来创建一个空字典
print("Sets（集合）")
data = {111, 222, 'aaa', 'bbb', 'ccc'}
print(data)
data.add(222)
data.add(333)
print(data)
data.remove(222)  # 删除不存在元素报错
data.discard('ddd')  # 删除不存在元素不报错
print(data)
print(len(data))
data = set()
print(data)

# Dictionary（字典）
# 字典是一种映射类型
# 它的元素是键值对
# 字典的关键字必须为不可变类型且不能重复
# 创建空字典使用 {}
print("Dictionary（字典）")
data = {
    'aaa': 111,
    'bbb': 222,
    333: 'ccc',
    'ddd': 444
}

print(data)
print(data['aaa'])
print(data[333])
print(data.keys())
print(data.values())
print(data.items())
print(len(data))

data['ddd'] = 444000
data['eee'] = 555
print(data)

data.pop(333)
print(data)

data.clear()
print(data)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    123
    abc
    a: 1
    b: 1
    c: 1
    a: 1
    b: 2
    c: ccc
    3.14
    Number（数字）
    123
    3.14
    True
    False
    (123+456j)
    123
    3.14
    True
    True
    (123.12+456.45j)
    9
    2.3
    21
    0.5
    0
    2
    32
    String（字符串）
    aaa
    bbb
    aaa
    aaa
    aaa
    bbb
    ccc
    ddd
    eee
    fff
    字符串常见操作:
    0
    1
    9
    8
    1234567
    1234567
    1357
    123456789
    01234567
    
    8765432
    8642
    876543210
    98765432
    0123456789
    0123456789
    9876543210
    Axxxe
    0
    2
    -1
    -1
    0
    1
    ABCDE
    abcde
    False
    False
    True
    aBCDE
    True
    True
    True
    False
    False
    False
    aa
    aa 
     aa
    21, jack
    jack, 21, jack
    jack: 21
    格式化补充:
    jack is 123 years old.
    jack is 123 years old.
    jack is 123 years old.
    jack is 123 years old.
    字符串前加r表示字符串不转义:
    abc	def
    abc\tdef
    ['2017', '03', '29', '22:00']
    2017-03-29-22:00
    ['2017', '03', '29', '22:00']
    字符串编码:
    b'\xe5\xad\xa6\xe4\xb9\xa0Python'
    b'\xd1\xa7\xcf\xb0Python'
    学习Python
    学习Python
    学习Python
    字符编码:
    65
    A
    Tuple（元组）
    ('jack', 20, 175.5, 'BJ')
    jack
    20
    175.5
    BJ
    (20, 175.5)
    (20, 175.5, 'BJ')
    ('jack', 20, 175.5)
    ('jack', 20, 175.5)
    List（列表）
    [111, 222, 'aaa', 'bbb', 'ccc']
    111
    222
    aaa
    bbb
    ccc
    [0, 222, 'aaa', 'bbb', 'ccc', 222]
    [0, 'aaa', 'bbb', 'ccc', 222]
    [0, 'aaa', 'bbb', 222, 'ccc', 222]
    2
    3
    6
    Sets（集合）
    {'aaa', 'ccc', 'bbb', 222, 111}
    {'aaa', 'ccc', 'bbb', 333, 222, 111}
    {'aaa', 'ccc', 'bbb', 333, 111}
    5
    set()
    Dictionary（字典）
    {'aaa': 111, 'bbb': 222, 333: 'ccc', 'ddd': 444}
    111
    ccc
    dict_keys(['aaa', 'bbb', 333, 'ddd'])
    dict_values([111, 222, 'ccc', 444])
    dict_items([('aaa', 111), ('bbb', 222), (333, 'ccc'), ('ddd', 444)])
    4
    {'aaa': 111, 'bbb': 222, 333: 'ccc', 'ddd': 444000, 'eee': 555}
    {'aaa': 111, 'bbb': 222, 'ddd': 444000, 'eee': 555}
    {}


# 完