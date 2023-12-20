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


# 可变参数
# 函数中定义的参数可以是一个或多个可以变化的
# 其中:
# *args 代表可以传入一个 list 或者 tuple
# **args 代表着可以传入一个 dict
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


# 关键字参数
# 允许调用函数时指定参数名设置参数值
# 可以灵活进行参数的调用
def fun_key_param(param1, param2='222', param3='333'):
    print('fun_key_param:')
    print('param1:', param1)
    print('param2:', param2)
    print('param3:', param3)


fun_key_param('aaa')
fun_key_param(param1='aaa')
fun_key_param('aaa', 'bbb')
fun_key_param('aaa', param2='bbb')
fun_key_param('aaa', param3='ccc')

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


# 完