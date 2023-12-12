# 002-Python基础语法

## main.py

```python
# Python 是一门脚本语言
# 脚本语言一边解释一边执行

# 标识符
# 字母、数字、下划线
# 第一个字符必须是字母或下划线
# 以单下划线开头 _foo 的代表不能直接访问的类属性: 需通过类提供的接口进行访问
# 以双下划线开头的 __foo 代表类的私有成员
# 以双下划线开头和结尾的 __foo__ 代表 Python 里特殊方法专用的标识(如 __init__() 代表类的构造函数)
# 无需指定变量类型
# 也不需要提前声明变量
a = 123
print(a)

# 同一行多条语句分号分开
# print("aa");print("bb")

# 关键字
# and         exec        not
# assert      finally     or
# break       for         pass
# class       from        print
# continue    global      raise
# def         if          return
# del         import      try
# elif        in          while
# else        is          with
# except      lambda      yield

# 缩进
# Python 用缩进层次来组织代码块
# 约定一个缩进是用4个空格来表示
# 务必遵守约定俗成的习惯
# 坚持使用4个空格的缩进
if True:
    print("true")
    print("true")
else:
    print("false")
    print("false")

# 多行语句
# Python 一般以新行作为语句的结束符
# 可以使用斜杠将一行的语句分为多行显示
a = 1 + \
    2 + \
    3
print(a)

# 语句中包含括号就不需要使用多行连接符
days = ['Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday']
print(days)

# 引号
# 单引号、双引号、三引号都表示字符串
# 引号的开始与结束必须是相同类型
a = 'a'
print(a)
b = "b"
print(b)
c = '''cccc
dddd
eeee
ffff'''
print(c)

# print 输出
# print 默认换行
# sep 指定分隔字符串
# end 指定结束字符串
print("aaa", "bbb", "ccc", sep="|", end="")
print("ddd", "eee", "fff", sep="___", end=";;")
print("xxx")

# input 输入
print("input:")
a = input()
print(a)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    123
    true
    true
    6
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    a
    b
    cccc
    dddd
    eeee
    ffff
    aaa|bbb|cccddd___eee___fff;;xxx
    input:
    345
    345


# 完