# 003-Python模块-sys-模块

## main.py

```python
# sys 模块提供了一些接口用于访问解释器自身使用和维护的变量
# sys 模块提供了一部分函数可以与解释器进行比较深度的交互
import sys

print("常用功能:")

# 命令行参数
# 是一个列表对象
print(sys.argv)

# 运行平台信息
print(sys.platform)

# 字节序
# 指的是计算机内部存储数据时数据的低位字节存储在存储空间中的高位还是低位
# little - 小端存储时数据的低位也存储在存储空间的低位地址上
# big - 大端存储数据的高位字节存储在存储空间的低位地址上
print(sys.byteorder)

# Python解释器对应的可执行程序所在的绝对路径
print(sys.executable)

# 包含各种已加载的模块的模块名到模块具体位置映射的字典
print(sys.modules)

# 解释器内置的模块名字符串元组
print(sys.builtin_module_names)

# Python搜索模块的路径组成的字符串列表
print(sys.path)

print("进阶功能:")

# 标准输入
fi = open("input.txt", "r")
# 修改标准输入为文件
sys.stdin = fi
print(input())
print(input())
print(input())
fi.close()

# 标准输入
fo = open("output.txt", "w", encoding="utf-8")
# 修改标准输入为文件
sys.stdout = fo
print("你好111")
print("你好222")
print("你好333")
fo.close()

# 标准错误
fe = open("error.txt", "w", encoding="utf-8")
# 修改标准输入为文件
sys.stderr = fe
# 暂时注释让程序继续执行
# print(10 / 0)
fe.close()

# 恢复为初始值
sys.stdin = sys.__stdin__
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

# Python最大递归数目
print(sys.getrecursionlimit())
sys.setrecursionlimit(2000)
print(sys.getrecursionlimit())

# 对象所占用的字节数
print(sys.getsizeof(123))
print(sys.getsizeof("123"))

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py aaa bbb ccc 
    常用功能:
    ['/Users/wuzhiguo/py/pydemo/main.py', 'aaa', 'bbb', 'ccc']
    darwin
    little
    /Users/wuzhiguo/py/pydemo/.venv/bin/python
    {'sys': <module 'sys' (built-in)>, 'builtins': <module 'builtins' (built-in)>, '_frozen_importlib': <module '_frozen_importlib' (frozen)>, '_imp': <module '_imp' (built-in)>, '_thread': <module '_thread' (built-in)>, '_warnings': <module '_warnings' (built-in)>, '_weakref': <module '_weakref' (built-in)>, '_io': <module '_io' (built-in)>, 'marshal': <module 'marshal' (built-in)>, 'posix': <module 'posix' (built-in)>, '_frozen_importlib_external': <module '_frozen_importlib_external' (frozen)>, 'time': <module 'time' (built-in)>, 'zipimport': <module 'zipimport' (frozen)>, '_codecs': <module '_codecs' (built-in)>, 'codecs': <module 'codecs' (frozen)>, 'encodings.aliases': <module 'encodings.aliases' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/encodings/aliases.py'>, 'encodings': <module 'encodings' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/encodings/__init__.py'>, 'encodings.utf_8': <module 'encodings.utf_8' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/encodings/utf_8.py'>, '_signal': <module '_signal' (built-in)>, '_abc': <module '_abc' (built-in)>, 'abc': <module 'abc' (frozen)>, 'io': <module 'io' (frozen)>, '__main__': <module '__main__' from '/Users/wuzhiguo/py/pydemo/main.py'>, '_stat': <module '_stat' (built-in)>, 'stat': <module 'stat' (frozen)>, '_collections_abc': <module '_collections_abc' (frozen)>, 'genericpath': <module 'genericpath' (frozen)>, 'posixpath': <module 'posixpath' (frozen)>, 'os.path': <module 'posixpath' (frozen)>, 'os': <module 'os' (frozen)>, '_sitebuiltins': <module '_sitebuiltins' (frozen)>, '__future__': <module '__future__' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/__future__.py'>, 'itertools': <module 'itertools' (built-in)>, 'keyword': <module 'keyword' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/keyword.py'>, '_operator': <module '_operator' (built-in)>, 'operator': <module 'operator' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/operator.py'>, 'reprlib': <module 'reprlib' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/reprlib.py'>, '_collections': <module '_collections' (built-in)>, 'collections': <module 'collections' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/collections/__init__.py'>, 'types': <module 'types' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/types.py'>, '_functools': <module '_functools' (built-in)>, 'functools': <module 'functools' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/functools.py'>, 'contextlib': <module 'contextlib' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/contextlib.py'>, '_virtualenv': <module '_virtualenv' from '/Users/wuzhiguo/py/pydemo/.venv/lib/python3.12/site-packages/_virtualenv.py'>, 'collections.abc': <module 'collections.abc' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/collections/abc.py'>, 'enum': <module 'enum' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/enum.py'>, '_sre': <module '_sre' (built-in)>, 're._constants': <module 're._constants' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/re/_constants.py'>, 're._parser': <module 're._parser' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/re/_parser.py'>, 're._casefix': <module 're._casefix' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/re/_casefix.py'>, 're._compiler': <module 're._compiler' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/re/_compiler.py'>, 'copyreg': <module 'copyreg' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/copyreg.py'>, 're': <module 're' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/re/__init__.py'>, 'token': <module 'token' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/token.py'>, '_tokenize': <module '_tokenize' (built-in)>, 'tokenize': <module 'tokenize' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/tokenize.py'>, 'linecache': <module 'linecache' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/linecache.py'>, 'textwrap': <module 'textwrap' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/textwrap.py'>, 'traceback': <module 'traceback' from '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/traceback.py'>, 'sitecustomize': <module 'sitecustomize' from '/Applications/PyCharm.app/Contents/plugins/python/helpers/pycharm_matplotlib_backend/sitecustomize.py'>, 'site': <module 'site' (frozen)>}
    ('_abc', '_ast', '_codecs', '_collections', '_functools', '_imp', '_io', '_locale', '_operator', '_signal', '_sre', '_stat', '_string', '_symtable', '_thread', '_tokenize', '_tracemalloc', '_typing', '_warnings', '_weakref', 'atexit', 'builtins', 'errno', 'faulthandler', 'gc', 'itertools', 'marshal', 'posix', 'pwd', 'sys', 'time')
    ['/Users/wuzhiguo/py/pydemo', '/Users/wuzhiguo/py/pydemo', '/Applications/PyCharm.app/Contents/plugins/python/helpers/pycharm_display', '/Library/Frameworks/Python.framework/Versions/3.12/lib/python312.zip', '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12', '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/lib-dynload', '/Users/wuzhiguo/py/pydemo/.venv/lib/python3.12/site-packages', '/Applications/PyCharm.app/Contents/plugins/python/helpers/pycharm_matplotlib_backend']
    进阶功能:
    aaa
    bbb
    ccc
    1000
    2000
    28
    44


# 完