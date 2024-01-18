# 001-Python模块-os-模块

## main.py

```python
# os 模块
import os

# 操作系统平台
print(os.name)

# 获取环境变量
print(os.environ["JAVA_HOME"])
print(os.environ["HOME"])

# 获取环境变量
print(os.getenv("JAVA_HOME"))
print(os.getenv("HOME"))

# 新建目录
os.mkdir("data")
os.mkdir("data/data1")
os.mkdir("data/data2")
# 新建文件
os.system("touch data/test1.txt")
os.system("touch data/test2.txt")

# 遍历目录树
# 返回每个目录对应的一个元组:
# - 路径
# - 目录列表
# - 文件列表
print("遍历目录树:")
items = os.walk("data")
print(items)
for path, dirs, files in items:
    print(path, dirs, files)

    # 遍历输出完整目录路径
    for item in dirs:
        print(os.path.join(path, item))

    # 遍历输出完整文件路径
    for item in files:
        print(os.path.join(path, item))

# 遍历目录
print("遍历目录:")
items = os.listdir("data")
print(items)
for item in items:
    print("目录项: ", item)

# 删除文件
os.remove("data/test1.txt")
os.remove("data/test2.txt")
# 删除目录
os.rmdir("data/data1")
os.rmdir("data/data2")
os.rmdir("data")

# 新建级联目录
os.makedirs("data/data1/data2")
# 删除级联目录
os.removedirs("data/data1/data2")

# 重命名
os.mkdir("data")
os.system("touch data/test1.txt")
os.rename("data/test1.txt", "data/test2.txt")
os.rename("data", "data2")
os.remove("data2/test2.txt")
os.rmdir("data2")

# 改变当前目录
# 获取当前目录
os.chdir("/Users/wuzhiguo/py")
print(os.getcwd())
os.chdir("/Users/wuzhiguo/py/pydemo")
print(os.getcwd())

# os.path 模块
# os.path 中的函数基本上是纯粹的字符串操作
# 传入该模块函数的参数甚至不需要是一个有效路径
# 该模块也不会试图访问这个路径
# 仅仅是按照路径的通用格式对字符串进行处理
# 该模块的作用是不必考虑具体的系统
# 尤其是不需要过多关注文件系统分隔符的问题
print("os.path 模块:")

# 连接目录与文件名或目录
print(os.path.join("/Users/wuzhiguo/py/pydemo", "temp.txt"))
# 获得绝对路径
print(os.path.abspath("temp.txt"))
# 返回文件名
# 实际上是传入路径最后一个分隔符之后的子字符串
# 也可能是目录名
print(os.path.basename("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 返回文件路径
# 实际上是最后一个分隔符前的整个字符串
print(os.path.dirname("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 把一个路径拆分为目录+文件名的形式
# 实际上是将传入路径以最后一个分隔符为界分成两个字符串并打包成元组的形式返回
print(os.path.split("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 分离文件名与扩展名
print(os.path.splitext("/Users/wuzhiguo/py/pydemo/temp.txt"))
# 路径是否存在
print(os.path.exists("/Users/wuzhiguo/py/pydemo"))
# 判断是否为绝对路径
print(os.path.isabs("/Users/wuzhiguo/py/pydemo"))
# 判断是否为文件夹
print(os.path.isdir("/Users/wuzhiguo/py/pydemo"))
# 判断是否为文件
print(os.path.isfile("/Users/wuzhiguo/py/pydemo"))

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    posix
    /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home
    /Users/wuzhiguo
    /Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home
    /Users/wuzhiguo
    遍历目录树:
    <generator object walk at 0x1071d2710>
    data ['data1', 'data2'] ['test1.txt', 'test2.txt']
    data/data1
    data/data2
    data/test1.txt
    data/test2.txt
    data/data1 [] []
    data/data2 [] []
    遍历目录:
    ['test1.txt', 'test2.txt', 'data1', 'data2']
    目录项:  test1.txt
    目录项:  test2.txt
    目录项:  data1
    目录项:  data2
    /Users/wuzhiguo/py
    /Users/wuzhiguo/py/pydemo
    os.path 模块:
    /Users/wuzhiguo/py/pydemo/temp.txt
    /Users/wuzhiguo/py/pydemo/temp.txt
    temp.txt
    /Users/wuzhiguo/py/pydemo
    ('/Users/wuzhiguo/py/pydemo', 'temp.txt')
    ('/Users/wuzhiguo/py/pydemo/temp', '.txt')
    True
    True
    True
    False


# 完