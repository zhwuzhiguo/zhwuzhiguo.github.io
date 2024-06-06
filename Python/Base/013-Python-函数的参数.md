# 013-Python-函数的参数

## main.py

```python
# 默认值参数
# 定义函数参数中一个或多个赋予默认值
# 可以使用更少的参数去调用此函数
# 默认参数只能在最后定义
def fun_default_param1(param1, param2='222', param3='333'):
    print('fun_default_param1:')
    print('param1:', param1)
    print('param2:', param2)
    print('param3:', param3)


fun_default_param1('aaa')
fun_default_param1('aaa', 'bbb')
fun_default_param1('aaa', 'bbb', 'ccc')
fun_default_param1('aaa', param3='ccc')


# 使用默认值参数时
# 如果默认值是一个可变对象时
# 调用函数可能出现不符合预期的结果
# 由于函数在初始化时
# 默认值只会执行一次
# 所以在默认值为可变对象(列表、字典以及大多数类实例)
# 每次使用默认值进行函数调用使用的都是同一个参数
def fun_default_param2(item, ll=[0, 1, 2]):
    ll.append(item)
    print('fun_default_param2:', ll)


# fun_default_param2: [0, 1, 2, 'a']
# fun_default_param2: [0, 1, 2, 'a', 'a']
fun_default_param2('a')
fun_default_param2('a')


# 正确定义方法
def fun_default_param3(item, ll=None):
    if ll is None:
        ll = [0, 1, 2]
    ll.append(item)
    print('fun_default_param3:', ll)


fun_default_param3('a')
fun_default_param3('a')


# 允许调用函数时指定参数名设置参数值
# 可以灵活进行参数的调用
def fun_default_param4(param1, param2='222', param3='333'):
    print('fun_key_param:')
    print('param1:', param1)
    print('param2:', param2)
    print('param3:', param3)


fun_default_param4('aaa')
fun_default_param4(param1='aaa')
fun_default_param4('aaa', 'bbb')
fun_default_param4('aaa', param2='bbb')
fun_default_param4('aaa', param3='ccc')


# 可变参数:
# 可以传入的参数个数是可变的
# *args 可变参数在函数调用时自动组装为一个tuple
# 关键字参数:
# 可以传入任意个含参数名的参数
# **args 关键字参数在函数内部自动组装为一个dict
def fun_variable_param(param1, *param2, **param3):
    print('fun_variable_param:')
    print('param1:', param1)
    for param in param2:
        print('param2:', param)
    for param in param3.items():
        print('param3:', param)


fun_variable_param('aaa', '111', '222', '333', aaa=111, bbb=222, ccc=333)
fun_variable_param('aaa', *['111', '222', '333'], **{'aaa': 111, 'bbb': 222, 'ccc': 333})
fun_variable_param('aaa', *('111', '222', '333'), **{'aaa': 111, 'bbb': 222, 'ccc': 333})

# 使用list和dict变量
p2 = ['111', '222', '333']
p3 = {'aaa': 111, 'bbb': 222, 'ccc': 333}
fun_variable_param('aaa', *p2, **p3)


# 命名关键字参数
# 如果要限制关键字参数的名字
# 可以用命名关键字参数
# 命名关键字参数需要一个特殊分隔符(*)
# 特殊分隔符(*)后面的参数被视为命名关键字参数
def fun_key_param(name, age, *, height, weight):
    print(name, age, height, weight)


# 如果函数定义中已经有一个可变参数
# 后面的命名关键字参数就不再需要一个特殊分隔符(*)了
def fun_key_param2(name, age, *args, height, weight):
    print(name, age, args, height, weight)


# 命名关键字参数可以有缺省值
def fun_key_param3(name, age, *args, height=165, weight=80):
    print(name, age, args, height, weight)


print("命名关键字参数:")
fun_key_param("aaa", 111, height=100, weight=10)
fun_key_param2("aaa", 111, "xxx", "yyy", height=100, weight=10)
fun_key_param3("aaa", 111, "xxx", "yyy")


# 参数组合
# 函数参数可以有必选参数、默认参数、可变参数、关键字参数和命名关键字参数
# 这5种参数都可以组合使用
# 但参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数
def fun(a, b, c=0, *args, d, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'd =', d, 'kw =', kw)


print("参数组合:")
fun(111, 222, 333, 444, 555, d=666, e=777, f=888, g=999)
fun(111, 222, d=444)

# 任意函数都可以通过类似func(*args, **kw)的形式调用
fun(*(111, 222, 333, 444, 555), **{"d": 666, "e": 777, "f": 888, "g": 999})
fun(*(111, 222), **{"d": 666})

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    fun_default_param1:
    param1: aaa
    param2: 222
    param3: 333
    fun_default_param1:
    param1: aaa
    param2: bbb
    param3: 333
    fun_default_param1:
    param1: aaa
    param2: bbb
    param3: ccc
    fun_default_param1:
    param1: aaa
    param2: 222
    param3: ccc
    fun_default_param2: [0, 1, 2, 'a']
    fun_default_param2: [0, 1, 2, 'a', 'a']
    fun_default_param3: [0, 1, 2, 'a']
    fun_default_param3: [0, 1, 2, 'a']
    fun_key_param:
    param1: aaa
    param2: 222
    param3: 333
    fun_key_param:
    param1: aaa
    param2: 222
    param3: 333
    fun_key_param:
    param1: aaa
    param2: bbb
    param3: 333
    fun_key_param:
    param1: aaa
    param2: bbb
    param3: 333
    fun_key_param:
    param1: aaa
    param2: 222
    param3: ccc
    fun_variable_param:
    param1: aaa
    param2: 111
    param2: 222
    param2: 333
    param3: ('aaa', 111)
    param3: ('bbb', 222)
    param3: ('ccc', 333)
    fun_variable_param:
    param1: aaa
    param2: 111
    param2: 222
    param2: 333
    param3: ('aaa', 111)
    param3: ('bbb', 222)
    param3: ('ccc', 333)
    fun_variable_param:
    param1: aaa
    param2: 111
    param2: 222
    param2: 333
    param3: ('aaa', 111)
    param3: ('bbb', 222)
    param3: ('ccc', 333)
    fun_variable_param:
    param1: aaa
    param2: 111
    param2: 222
    param2: 333
    param3: ('aaa', 111)
    param3: ('bbb', 222)
    param3: ('ccc', 333)
    命名关键字参数:
    aaa 111 100 10
    aaa 111 ('xxx', 'yyy') 100 10
    aaa 111 ('xxx', 'yyy') 165 80
    参数组合:
    a = 111 b = 222 c = 333 args = (444, 555) d = 666 kw = {'e': 777, 'f': 888, 'g': 999}
    a = 111 b = 222 c = 0 args = () d = 444 kw = {}
    a = 111 b = 222 c = 333 args = (444, 555) d = 666 kw = {'e': 777, 'f': 888, 'g': 999}
    a = 111 b = 222 c = 0 args = () d = 666 kw = {}


# 完