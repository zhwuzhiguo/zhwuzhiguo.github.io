# 020-Python-NameSpace-Scope

## main.py

```python
# 命名空间定义了在某个作用域内变量名和绑定值之间的对应关系
# 命名空间是键值对的集合
# 变量名与值是一一对应关系
# 作用域定义了命名空间中的变量能够在多大范围内起作用

# 命名空间在Python解释器中是以字典的形式存在的
# 是以一种可以看得见摸得着的实体存在的
# 作用域是Python解释器定义的一种规则
# 该规则确定了运行时变量查找的顺序
# 是一种虚的规定

# 命名空间
# 命名空间提供了一个在大型项目下避免名字冲突的方法
# 各个命名空间都是独立的无任何关系
# 一个命名空间中不能有重名
# 但不同的命名空间可以重名

# 命名空间种类
# 命名空间分为3类
# 命名空间的种类也体现了命名空间的生命周期
# 1 内置名称（built-in names）
#   语言内置的名称
#   在解释器启动的时候被创建
#   在解释器退出的时候才被删除
# 2 全局名称（global names）
#   模块中定义的名称
#   记录了模块的变量
#   包括函数、类、其它导入的模块、模块级的变量和常量
#   在这个模块被import的时候创建
#   在解释器退出的时候退出
# 3 局部名称（local names）
#   函数中定义的名称
#   记录了函数的变量
#   包括函数的参数和局部定义的变量
#   在函数每次被调用的时候创建
#   函数返回的时候被删除

# 命名空间查找、创建、销毁顺序
# 查找变量:
# 局部的命名空间 -> 全局命名空间 -> 内置命名空间
# 如果找不到相应的变量将抛出NameError异常
# 各命名空间创建顺序:
# 解释器启动 -> 创建内建命名空间 -> 加载模块 -> 创建全局命名空间 -> 函数被调用 -> 创建局部命名空间
# 各命名空间销毁顺序:
# 函数调用结束 -> 销毁函数对应的局部命名空间 -> 解释器退出 -> 销毁全局命名空间 -> 销毁内建命名空间

# 一个模块的引入，函数调用，类定义都会引入命名空间
# 函数中再定义函数
# 类中成员函数定义
# 会在局部命名空间中再次引入局部命名空间

# 作用域
# 作用域就是一个 Python 程序可以直接访问命名空间的正文区域
# Python 中直接访问一个变量，会从内到外依次访问所有的作用域直到找到，否则会报未定义错误
# Python 中程序的变量并不是在哪个位置都可以访问的，访问权限决定于这个变量是在哪里赋值的
# Python 中变量的作用域决定了在哪一部分程序可以访问哪个特定的变量名称

# 作用域种类
# 作用域分为4类:
# 1 L(Local) - 最内层，包含局部变量
#   比如一个函数内部
# 2 E(Enclosing) - 包含了非局部也非全局的变量
#   比如两个嵌套函数，一个函数 A 里面又包含了一个函数 B
#   那么对于函数 B 中的名称来说函数 A 中的作用域就为非局部也非全局
# 3 G(Global) - 当前脚本的最外层
#   比如当前模块的全局变量
# 4 B(Built-in) - 包含了内建的变量和关键字等，最后被搜索

# 作用域规则顺序为：L->E->G->B
# 如果变量在局部内找不到
# 便会去局部外的局部找
# 再找不到就会去全局找
# 再找不到就去内置中找

# 全局作用域和局部作用域
# 局部作用域是脚本中的最内层(包含局部变量)
# 闭包函数外函数包含了非局部也非全局的变量
# 全局作用域是当前脚本的最外层(当前模块的全局变量)

# # 全局作用域
# scope_global = 0
#
# # 定义闭包函数中的局部作用域
# def outer():
#     # 闭包函数外的函数中
#     # 非局部作用域
#     scope_enclosing = 1
#
#     def inner():
#         # 局部作用域
#         scope_local = 2
#

# 内建作用域
# 内建作用域是通过一个名为 builtins 的标准模块来实现的
# 但是这个变量名自身并没有放入内置作用域内
# 必须导入这个文件才能够使用它
# 可以使用以下的代码来查看到底预定义了哪些变量:
import builtins

print("内建作用域:")
print(dir(builtins))

# Python 中只有模块，类以及函数才会引入新的作用域
# 其它的代码块(if/elif/else/、try/except、for/while等)是不会引入新的作用域的
# 也就是说这些语句内定义的变量
# 外部也可以访问
try:
    a = 123
except NameError:
    print("NameError")
finally:
    print("finally")
    print("a", a)  # 123

print("a", a)  # 123

# 全局变量和局部变量
# 全局变量：定义在函数外部拥有全局作用域的变量
# 局部变量：定义在函数内部拥有局部作用域的变量

# 局部变量只能在其被声明的函数内部访问
# 而全局变量可以在整个程序范围内访问
# 调用函数时所有在函数内声明的变量名称都将被加入到局部作用域中
print("全局变量和局部变量:")

# 全局变量
total = 0


def add(arg1, arg2):
    # 这里的复值使total成为局部变量
    total = arg1 + arg2
    print("函数内是局部变量(total)", total)
    return total


add(100, 200)
print("函数外是局部变量(total)", total)

# 输出
# 函数内是局部变量(total) 300
# 函数外是局部变量(total) 0

# global 和 nonlocal 关键字
# 当内部作用域想修改外部作用域的变量时
# 就要用到 global 和 nonlocal 关键字了

# 变量访问顺序:
# 当前作用域局部变量 -> 外层作用域变量 -> 再外层作用域变量 -> ... -> 当前模块全局变量 -> 内置变量

# global:
# 全局变量
# 当局部作用域改变全局变量用global
# 同时global还可以定义新的全局变量

# nonlocal:
# 外层嵌套函数的变量
# nonlocal不能定义新的外层函数变量
# 只能改变已有的外层函数变量
# 同时nonlocal不能改变全局变量

# 修改全局变量
print("修改全局变量:")

# 全局变量
num = 1


def fun1():
    # 使用 global 关键字
    # 声明访问全局变量
    global num
    print(num)  # 1
    num = 123
    print(num)  # 123

    # 使用 global 关键字
    # 定义新的全局变量
    global num2
    num2 = 456
    print(num2)  # 456


fun1()
print(num)  # 123
print(num2)  # 456

# 修改嵌套作用域
print("修改嵌套作用域:")


# 定义函数
def outer():
    # 定义变量
    num3 = 10

    # 定义嵌套函数
    def inner():
        # nonlocal 关键字声明
        # 使用外层函数中变量
        nonlocal num3
        num3 = 100
        print(num3)  # 100

        # 不能定义外层变量
        # nonlocal num4
        # num4 = 200
        # print(num4)

    inner()
    print(num3)  # 100


# 调用
outer()

# global 和 nonlocal 的区别
# 两者的功能不同:
# global关键字修饰变量后标识该变量是全局变量，对该变量进行修改就是修改全局变量
# nonlocal关键字修饰变量后标识该变量是上一级函数中的局部变量，如果上一级函数中不存在该局部变量会发生错误
# 两者使用的范围不同:
# global关键字可以用在任何地方，包括最上层函数中和嵌套函数中，即使之前未定义该变量，global修饰后也可以直接定义全局变量。
# nonlocal关键字只能用于嵌套函数中，并且需要外层函数中定义了相应的局部变量，否则会发生错误

# 注意:
# 只有需要修改全局变量或非局部变量的值的时候才需要使用 global 和 nonlocal 申明全局或非局部变量
# 只是使用全局变量或非局部变量的时候直接使用即可
# 如果在函数内定义了和上级作用域内同名的变量
# 定义的局部变量会隐藏上级作用域内同名的变量

# 综合示例
print("综合示例:")
# 全局变量
n = 100


def fun1():
    # 局部变量
    n1 = 200
    print("fun1:")
    print("n", n)
    print("n1", n1)

    # 定义嵌套函数
    def fun2():
        # 局部变量
        n2 = 300
        print("fun2:")
        print("n", n)
        print("n1", n1)
        print("n2", n2)

    fun2()


# 调用
fun1()
print("module:")
print("n", n)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    内建作用域:
    ['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException', 'BaseExceptionGroup', 'BlockingIOError', 'BrokenPipeError', 'BufferError', 'BytesWarning', 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionError', 'ConnectionRefusedError', 'ConnectionResetError', 'DeprecationWarning', 'EOFError', 'Ellipsis', 'EncodingWarning', 'EnvironmentError', 'Exception', 'ExceptionGroup', 'False', 'FileExistsError', 'FileNotFoundError', 'FloatingPointError', 'FutureWarning', 'GeneratorExit', 'IOError', 'ImportError', 'ImportWarning', 'IndentationError', 'IndexError', 'InterruptedError', 'IsADirectoryError', 'KeyError', 'KeyboardInterrupt', 'LookupError', 'MemoryError', 'ModuleNotFoundError', 'NameError', 'None', 'NotADirectoryError', 'NotImplemented', 'NotImplementedError', 'OSError', 'OverflowError', 'PendingDeprecationWarning', 'PermissionError', 'ProcessLookupError', 'RecursionError', 'ReferenceError', 'ResourceWarning', 'RuntimeError', 'RuntimeWarning', 'StopAsyncIteration', 'StopIteration', 'SyntaxError', 'SyntaxWarning', 'SystemError', 'SystemExit', 'TabError', 'TimeoutError', 'True', 'TypeError', 'UnboundLocalError', 'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeError', 'UnicodeTranslateError', 'UnicodeWarning', 'UserWarning', 'ValueError', 'Warning', 'ZeroDivisionError', '__build_class__', '__debug__', '__doc__', '__import__', '__loader__', '__name__', '__package__', '__spec__', 'abs', 'aiter', 'all', 'anext', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright', 'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'exit', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip']
    finally
    a 123
    a 123
    全局变量和局部变量:
    函数内是局部变量(total) 300
    函数外是局部变量(total) 0
    修改全局变量:
    1
    123
    456
    123
    456
    修改嵌套作用域:
    100
    100
    综合示例:
    fun1:
    n 100
    n1 200
    fun2:
    n 100
    n1 200
    n2 300
    module:
    n 100


# 完