# 006-Python-模块和包

目录结构：

    pydemo tree .
    .
    ├── calculate
    │   ├── __init__.py
    │   ├── calculator.py
    │   └── utility
    │       ├── __init__.py
    │       └── math.py
    ├── main.py
    ├── main2.py
    ├── main3.py
    └── people.py

## people.py

```python
def say(content):
    print('say:{}'.format(content))


def sing(name):
    print('sing:{}'.format(name))

```

## calculator.py

```python
def add(a, b):
    return a + b


def reduce(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    return a / b

```

## math.py

```python
def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)

```

## main.py

```python
# 模块其实是一个 py 文件
# 用来封装一些函数、类、变量等

# 包是多个模块组成的文件夹
# 将一类模块归集到一起
# 也可以嵌套文件夹
# 比模块的概念更大一些

# 库就是由其它程序员封装好的功能组
# 包括模块和包
# 比包的概念更大一些

# 导入模块
import people

# 使用 模块名.函数名 调用
people.say("OK..")
people.sing("SONG..")

# 常见的包结构如下(包路径下必须存在 __init__.py 文件)：
# packageName
# ----__init__.py
# ----moduleName1.py
# ----moduleName2.py
# ---- ...

# 包导入的语法：
# import 包名.包名.模块名
import calculate.calculator
import calculate.utility.math

print(calculate.calculator.add(1, 2))
print(calculate.utility.math.fact(5))

# 简化导入包
from calculate import calculator
from calculate.utility import math

print(calculator.add(1, 2))
print(math.fact(5))


```

## main2.py

```python
# 从模块中导入指定的符号（变量、函数、类等）到当前模块
from people import say
from people import sing

# 直接使用
# 而不需要前缀模块名
say("OK..")
sing("SONG..")

# 简化导入包
from calculate.calculator import add
from calculate.utility.math import fact

print(add(1, 2))
print(fact(5))

```

## main3.py

```python
# 把一个模块的所有内容全都导入到当前的命名空间
from people import *

# 直接使用
# 而不需要前缀模块名
say("OK..")
sing("SONG..")

# 简化导入包
from calculate.calculator import *
from calculate.utility.math import *

print(add(1, 2))
print(fact(5))

# 简化导入包
import calculate.calculator as ca
import calculate.utility.math as ma

print(ca.add(1, 2))
print(ma.fact(5))

```

# 完