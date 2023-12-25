# 019-Python-之装饰器

## main.py

```python
# 装饰器（decorator）又称装饰函数
# 即一种返回值也是函数的函数
# 可以称之为函数的函数
# 其目的是在不对现有函数进行修改的情况下
# 实现额外的功能
import functools

# Python 中装饰器属于纯粹的语法糖
# 使用的话能够大大简化代码
# 使代码更加易读

# 运行机制
# 使用装饰器的@语法
# 就相当于是将具体定义的函数作为参数传入装饰器函数
# 而装饰器函数则经过一系列操作
# 返回一个新的函数
# 然后再将这个新的函数赋值给原先的函数名
# 最终得到的是一个在代码中显式定义的函数同名而异质的新函数

# 装饰函数有且只能有一个参数
# 即要被修饰的原函数

# 装饰函数
# def decorator_fun(fun):
#     print("我是装饰函数")
#     fun()
#
# @decorator_fun
# def be_decorator_fun():
#     print("我是被装饰函数")

# 等价于:

# def decorator_fun(fun):
#     print("我是装饰函数")
#     fun()
#
# def be_decorator_fun():
#     print("我是被装饰函数")
#
# be_decorator_fun = decorator_fun(be_decorator_fun)

# 函数装饰器
# 由于要求装饰函数返回值也为一个函数的缘故
# 为了在原函数的基础上对功能进行扩充
# 并且使得扩充的功能能够以函数的形式返回
# 因此需要在装饰函数的定义中再定义一个内部函数
# 在这个内部函数中增加装饰代码
# 最后返回的对象就是这个内部函数对象
# 也只有这样才能够正确地返回一个附加了新功能的函数

# 装饰函数就像一个包装
# 将原函数装在了装饰函数的内部
# 从而通过在原函数的基础上附加功能实现了扩展
# 装饰函数再将这个新的整体返回
# 同时对于原函数本身又不会有影响
print("函数装饰器:")


# 装饰函数
# 装饰器本身的函数体中的操作都是当且仅当函数定义时会执行一次
# 以后再以新函数名调用函数
# 执行的是内部函数的操作
def decorator_fun(fun):
    print("我是装饰函数")

    # 装饰函数内部定义的用于扩展功能的函数可以随意取名
    # 一般约定俗成命名为 wrapper
    # 内部函数参数设置为 (*args, **kw)
    # 可以接收任意参数
    # 之所以要能够接收任意参数
    # 是因为在定义装饰器的时候并不知道会用来装饰什么函数
    # 具体函数的参数又是什么情况
    # 定义为可以接收任意参数能够增强代码的适应性

    # 可以使用内置模块 functools 中的 wraps 工具
    # 实现在使用装饰器扩展函数功能的同时
    # 保留原函数属性这一目的
    @functools.wraps(fun)
    def wrapper(*args, **kwargs):
        print("我是内部函数")
        # 在内部函数中对原函数进行调用
        return fun(*args, **kwargs)

    # 装饰器目的是返回一个函数对象
    # 返回语句的对象一定是不带参数的函数名
    return wrapper


@decorator_fun
def foo(a, b):
    print("我是被装饰函数")
    return a + b


obj = foo(1, 2)
print(obj)

# 函数名称变成了装饰器中内部函数的名称 wrapper
# print(foo.__name__)  # wrapper

# 可以使用内置模块 functools 中的 wraps 工具
# 实现在使用装饰器扩展函数功能的同时
# 保留原函数属性这一目的
print(foo.__name__)  # foo

# 多个装饰器的情况
print("多个装饰器的情况:")


def foo3(fun):
    print("我是装饰函数foo3")

    @functools.wraps(fun)
    def wrapper(*args, **kwargs):
        print("我是内部函数foo3")
        return fun(*args, **kwargs)

    return wrapper


def foo2(fun):
    print("我是装饰函数foo2")

    @functools.wraps(fun)
    def wrapper(*args, **kwargs):
        print("我是内部函数foo2")
        return fun(*args, **kwargs)

    return wrapper


@foo3
@foo2
def foo1(a, b):
    print("foo1")
    return a + b


obj = foo1(100, 200)
print(obj)
print(foo1.__name__)  # foo1

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    函数装饰器:
    我是装饰函数
    我是内部函数
    我是被装饰函数
    3
    foo
    多个装饰器的情况:
    我是装饰函数foo2
    我是装饰函数foo3
    我是内部函数foo3
    我是内部函数foo2
    foo1
    300
    foo1


# 完