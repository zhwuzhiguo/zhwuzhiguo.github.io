# 015-Python-输入输出

## main.py

```python
import json
import math

# 格式化输出
# 如果想要将输出的值转成字符串
# 可以使用函数:
# repr() 返回一个解释器易读的表达形式
# str() 返回一个用户易读的表达形式

# 对输出进行格式化控制
# 可以采用 str.format() 方式
print("格式化输出:")
print('{}-{}-{}'.format('aaa', 'bbb', 'ccc'))
print('{0}-{1}-{2}-{0}-{1}-{2}'.format('aaa', 'bbb', 'ccc'))
print('{aaa}-{bbb}-{ccc}-{aaa}-{bbb}-{ccc}'.format(aaa=111, bbb=222, ccc=333))
print('{0}-{aaa}-{1}-{bbb}'.format('aaa', 'bbb', aaa=111, bbb=222))
print('{aaa}-{bbb}-{ccc}-{aaa}-{bbb}-{ccc}'.format(**{'aaa': 111, 'bbb': 222, 'ccc': 333}))

# 可选的:格式指令
# 指定保留小数位数
print('{:.0f}-{:.1f}-{:.3f}'.format(math.pi, math.pi, math.pi))
print('{0:.0f}-{1:.1f}-{2:.3f}'.format(math.pi, math.pi, math.pi))
print('{aaa:.0f}-{bbb:.1f}-{ccc:.3f}'.format(aaa=math.pi, bbb=math.pi, ccc=math.pi))

# 可选的:格式指令
# :后加一个整数限定该字段的最小宽度
print('{:4.0f}-{:4.1f}-{:4.3f}'.format(math.pi, math.pi, math.pi))
print('{0:4.0f}-{1:4.1f}-{2:4.3f}'.format(math.pi, math.pi, math.pi))
print('{aaa:4.0f}-{bbb:4.1f}-{ccc:4.3f}'.format(aaa=math.pi, bbb=math.pi, ccc=math.pi))

# 使用index[key]表示参数中第几个字典的建对应值
dict0 = {'aaa': 1, 'bbb': 2, 'ccc': 3}
dict1 = {'aaa': 111, 'bbb': 222, 'ccc': 333}
print('{0[aaa]:d}-{0[bbb]:f}-{1[ccc]:5d}'.format(dict0, dict1))
# 也可以参数传: **dict
print('{aaa:d}-{bbb:f}-{ccc:5d}'.format(**dict0))

# 读取键盘输入
print("读取键盘输入:")
#  input() 内置函数从标准输入读入一行文本
#  默认的标准输入是键盘
#  input() 可以接收一个表达式作为输入
#  并将运算结果返回
num = input()
print(num)
print(type(num))

s = input('请输入字符串：')
print(s)

# 文件读写
# open() 返回文件对象
# 需要两个参数:
# open(filename, mode)
# filename 是要访问的文件名
# mode 是描述如何使用该文件:
# 'r' 读取文件
# 'w' 只是写入文件(已经存在的同名文件将被删掉)
# 'a' 打开文件进行追加(自动添加到末尾)
# 'r+' 打开文件进行读取和写入
# 'rb+' 以二进制格式打开一个文件用于读写
# mode 参数是可选的(默认为'r')
print("文件读写:")

# 文件对象方法
print("文件对象方法:")

# read()
# 读取文件内容:
# read(size)
# size为可选参数
f = open('temp.data', 'r+')
s = f.read(5)
print(s)
f.close()

# readline()
# 读取一行(换行符为\n)
f = open('temp.data', 'r+')
s = f.readline()
print(s)
f.close()

# readlines()
# 读取文件中包含的所有行
f = open('temp.data', 'r+')
s = f.readlines()
print(s)
f.close()

# write()
# write(string)
# 将 string 的内容写入文件
f = open('temp.data', 'r+')
n = f.write('abcde')
print(n)
f.seek(0)
s = f.readlines()
print(s)
f.close()

# seek()
# 改变文件当前的位置
# seek(offset, from_what)
# offset 移动距离
# from_what 起始位置(默认值为0):
# 0 表示开头
# 1 表示当前位置
# 2 表示结尾
f = open('temp.data', 'r+')
f.seek(5)
n = f.write('abcde')
print(n)
f.seek(0)
s = f.readlines()
print(s)
f.close()

# tell()
# 返回文件对象当前所处的位置
# 它是从文件开头开始算起的字节数
f = open('temp.data', 'r+')
print(f.tell())
f.seek(5)
print(f.tell())
f.close()

# close()
# 关闭文件并释放系统的资源
# 也可以使用 with 关键字处理文件对象
# 实现文件用完后自动关闭
with open('temp.data', 'r+') as f:
    s = f.readlines()
    print(s)
    print(f.closed)
print(f.closed)

# 操作 json 格式数据
print("操作 json 格式数据:")
# json.dumps(obj)
# 序列化 obj 为 json 格式的字符串
# json.dump(obj, fp)
# 序列化 obj 转换为 json 格式的字符串写入文件
# json.loads(str)
# 反序列化 json 格式的字符串为一个 Python 对象
# json.load(fp)
# 反序列化文件中读取含 json 格式的数据为一个 Python 对象
obj = {'aaa': 123, 'bbb': 3.1415926535, 'ccc': 'jack'}
s = json.dumps(obj)
print(s)
obj2 = json.loads(s)
print(obj2)

fp = open('temp.json', 'w')
json.dump(obj, fp)
fp.close()

fp = open('temp.json', 'r')
obj3 = json.load(fp)
print(obj3)
fp.close()

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    格式化输出:
    aaa-bbb-ccc
    aaa-bbb-ccc-aaa-bbb-ccc
    111-222-333-111-222-333
    aaa-111-bbb-222
    111-222-333-111-222-333
    3-3.1-3.142
    3-3.1-3.142
    3-3.1-3.142
       3- 3.1-3.142
       3- 3.1-3.142
       3- 3.1-3.142
    1-2.000000-  333
    1-2.000000-    3
    读取键盘输入:
    123
    123
    <class 'str'>
    请输入字符串：abc
    abc
    文件读写:
    文件对象方法:
    01234
    0123456789
    
    ['0123456789\n', '0123456789\n', '0123456789\n', '0123456789\n', '0123456789\n']
    5
    ['abcde56789\n', '0123456789\n', '0123456789\n', '0123456789\n', '0123456789\n']
    5
    ['abcdeabcde\n', '0123456789\n', '0123456789\n', '0123456789\n', '0123456789\n']
    0
    5
    ['abcdeabcde\n', '0123456789\n', '0123456789\n', '0123456789\n', '0123456789\n']
    False
    True
    操作 json 格式数据:
    {"aaa": 123, "bbb": 3.1415926535, "ccc": "jack"}
    {'aaa': 123, 'bbb': 3.1415926535, 'ccc': 'jack'}
    {'aaa': 123, 'bbb': 3.1415926535, 'ccc': 'jack'}


# 完