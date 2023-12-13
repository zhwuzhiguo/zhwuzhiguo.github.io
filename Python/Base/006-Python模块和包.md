# 006-Python模块和包

目录结构：

    tree .
    .
    ├── cal
    │   ├── __init__.py
    │   ├── calculator.py
    │   └── math
    │       ├── __init__.py
    │       └── utility.py
    ├── hello.py
    ├── main.py
    ├── main2.py
    ├── main3.py
    ├── main_package.py
    ├── main_package2.py
    └── main_package3.py

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

## utility.py

```python
def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)

```

## hello.py

```python
def say(content):
    print('say:{}'.format(content))


def sing(name):
    print('sing:{}'.format(name))

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
import hello

# 使用 模块名.函数名 调用
hello.say("OK..")
hello.sing("SONG..")

```

## main2.py

```python
# 从模块中导入指定的符号（变量、函数、类等）到当前模块
from hello import say
from hello import sing

# 直接使用
# 而不需要前缀模块名
say("OK..")
sing("SONG..")

```

## main3.py

```python
# 把一个模块的所有内容全都导入到当前的命名空间
from hello import *

# 直接使用
# 而不需要前缀模块名
say("OK..")
sing("SONG..")

```

## main_package.py

```python
# 常见的包结构如下(包路径下必须存在 __init__.py 文件)：
# packageName
# ----__init__.py
# ----moduleName1.py
# ----moduleName2.py
# ---- ...

# 包导入的语法：
# import 包名.包名.模块名

import cal.calculator
import cal.math.utility

print(cal.calculator.add(1, 2))
print(cal.math.utility.fact(5))

```

## main_package2.py

```python
# 简化导入
from cal import calculator
from cal.math import utility

# 简化调用
print(calculator.add(1, 2))
print(utility.fact(5))

```

## main_package3.py

```python
# 简化导入
import cal.calculator as cal
import cal.math.utility as util

# 简化调用
print(cal.add(1, 2))
print(util.fact(5))

```


# 完