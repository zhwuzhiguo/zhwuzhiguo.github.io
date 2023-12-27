# 021-Python-StandardLibrary01

## main.py

```python
# Python3 标准库概览
import math
import os
import sys

# os 模块
# os 模块提供了很多与操作系统相关联的函数
print("os:")

# 操作系统平台
print(os.name)
# 获取环境变量
print(os.getenv("JAVA_HOME"))

# 利用系统调用运行命令
os.system("pwd")
os.system("touch test.txt")
# 删除文件
os.remove("test.txt")

# 改变当前目录
os.chdir("/Users/wuzhiguo/py/pydemo")
# 获取当前目录
print(os.getcwd())
# 获取目录下所有文件名
print(os.listdir("/Users/wuzhiguo/py/pydemo"))

# 路径是否存在
print(os.path.exists("/Users/wuzhiguo/py/pydemo"))
# 判断是否为文件夹
print(os.path.isdir("/Users/wuzhiguo/py/pydemo"))
# 判断是否为文件
print(os.path.isfile("/Users/wuzhiguo/py/pydemo"))

# 获得绝对路径
print(os.path.abspath("temp.txt"))
# 分离文件名与扩展名
print(os.path.splitext("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 把一个路径拆分为目录+文件名的形式
print(os.path.split("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 返回文件名
print(os.path.basename("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 返回文件路径
print(os.path.dirname("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 连接目录与文件名或目录
print(os.path.join("/Users/wuzhiguo/py/pydemo", "temp.txt"))

# math 模块
# 开平方
print(math.sqrt(4))

# sys 模块
# 终止脚本
sys.exit(123)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    os:
    posix
    /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home
    /Users/wuzhiguo/py/pydemo
    /Users/wuzhiguo/py/pydemo
    ['.DS_Store', 'calculate', '__pycache__', 'temp.txt', '.gitignore', '.venv', '.git', 'main.py', '.idea']
    True
    True
    False
    /Users/wuzhiguo/py/pydemo/temp.txt
    ('/Users/wuzhiguo/py/pydemo/temp', '.txt')
    ('/Users/wuzhiguo/py/pydemo', 'temp.txt')
    temp.txt
    /Users/wuzhiguo/py/pydemo
    /Users/wuzhiguo/py/pydemo/temp.txt
    2.0
    
    进程已结束，退出代码为 123

# 完