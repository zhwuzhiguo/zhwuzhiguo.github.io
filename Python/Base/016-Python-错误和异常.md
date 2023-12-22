# 016-Python-错误和异常

## main.py

```python
import traceback

# 异常是一个事件
# 该事件会在程序执行过程中发生
# 从而影响程序的正常执行
# Python 遇到无法处理的程序时就会引发一个异常
# Python 中异常是一个对象
# 用于表示一个错误
# 当 Python 脚本发生异常时需要捕获和处理它
# 否则程序会终止执行

# 处理异常
# Python 提供 try/except 语句用来捕获和处理异常
# try 语句用来检测语句块中是否有错误
# except 语句用来捕获 try 语句中的异常并进行处理
# 附加的 else 可以在 try 语句没有异常时执行
print("处理异常:")
try:
    s = input("请输入除数:")
    n = int(s)
    result = 100 / n
except ZeroDivisionError:
    print("ZeroDivisionError..")
except ValueError:
    print("ValueError..")
else:
    print("OK..")


# 异常继承
# 父类异常可以捕获子类异常
# 所以捕获异常的顺序:
# 先捕获子类异常
# 再捕获父类异常
class AException(Exception):
    pass


class BException(AException):
    pass


class CException(BException):
    pass


print("异常继承:")
for exception in (AException, BException, CException):
    try:
        raise exception()
    except CException:
        print("CException..")
    except BException:
        print("BException..")
    except AException:
        print("AException..")

# 不带异常类型的 except
# 在所有 except 的最后加上不带异常类型的 except 子句
# 可以捕获前面任何 except 没有捕获的所有异常
print("不带异常类型的 except:")
for exception in (AException, BException, CException, Exception):
    try:
        raise exception()
    except CException:
        print("CException..")
    except BException:
        print("BException..")
    except AException:
        print("AException..")
    except:
        print("Exception..")

# except 语句捕获多种异常类型
print("except 语句捕获多种异常类型:")
for exception in (AException, BException, CException, Exception):
    try:
        raise exception()
    except (AException, BException, CException):
        print("AException, BException, CException..")
    except:
        print("Exception..")

# try - finally 语句
# finally 语句用于无论是否发生异常都将执行最后的代码
# 也就是说如果没有异常 finally 和 else 都会执行
print("try - finally 语句:")
for exception in (AException, BException, CException, Exception):
    try:
        raise exception()
    except CException:
        print("CException..")
    except BException:
        print("BException..")
    except AException:
        print("AException..")
    except:
        print("Exception..")
    else:
        print("OK..")
    finally:
        print("finally..")

# 异常的参数
# except 子句可以在异常名称后面指定一个变量
# 这个变量和一个异常实例绑定
# 它的参数是一个元组
# 通常包含错误字符串，错误数字，错误位置
# 存储在 args 中
# 为了方便起见
# 异常实例定义了__str__()
# 因此可以直接打印参数而无需引用 args
print("异常的参数:")
try:
    s = input("请输入除数:")
    n = int(s)
    result = 100 / n
except ZeroDivisionError as err:
    print("ZeroDivisionError..")
    print(err.args)
    print(err)
    print(type(err))
except ValueError as err:
    print("ValueError..")
    print(err.args)
    print(err)
    print(type(err))

# 触发异常
# raise 语句用于手动引发一个异常
# 语法:
# raise [Exception [, args [, traceback]]]
# 参数:
# Exception - 异常的类型(例如ZeroDivisionError)
# args - 异常参数值(可选，默认值None)
# traceback - 用于设置是否跟踪异常对象(可选)
# 异常参数值可以是一个字符串,类或对象
print("触发异常:")
try:
    raise Exception('aaa', 'bbb', 'ccc')
except Exception as err:
    print(err)
    traceback.print_exception(err)
    traceback.print_exc()


# 用户自定义异常
# 只需要创建一个类
# 并继承 Exception 类或其子类
class CustomError(Exception):
    message = ''

    def __init__(self, message):
        self.message = message


print("用户自定义异常:")
try:
    raise CustomError('this is a custom error')
except CustomError as err:
    print(err)

# 预定义的清理行为
# 一些对象定义了标准的清理行为
# 无论系统是否成功的使用了它
# 一旦不需要它了
# 那么这个标准的清理行为就会执行
# 关键词 with 语句可以保证:
# 诸如文件之类的对象在使用完之后一定会正确执行他的清理方法
# 即使期间出现了异常
print("预定义的清理行为:")
try:
    filename = 'temp.data'
    with open(filename) as file:
        data = file.read(5)
        print(data)
        raise IOError('模拟读文件异常')
except IOError as err:
    print(err)
    print('{} closed: {}'.format(filename, file.closed))

# 完成异常处理示例
print("完成异常处理示例:")
try:
    raise Exception('模拟异常')
except ZeroDivisionError as err:
    print(err)
except ValueError as err:
    print(err)
except Exception as err:
    traceback.print_exception(err)
finally:
    print("finally..")

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    处理异常:
    请输入除数:5
    OK..
    异常继承:
    AException..
    BException..
    CException..
    不带异常类型的 except:
    AException..
    BException..
    CException..
    Exception..
    except 语句捕获多种异常类型:
    AException, BException, CException..
    AException, BException, CException..
    AException, BException, CException..
    Exception..
    try - finally 语句:
    AException..
    finally..
    BException..
    finally..
    CException..
    finally..
    Exception..
    finally..
    异常的参数:
    请输入除数:5
    触发异常:
    ('aaa', 'bbb', 'ccc')
    用户自定义异常:
    this is a custom error
    预定义的清理行为:
    01234
    模拟读文件异常
    temp.data closed: True
    完成异常处理示例:
    finally..
    Traceback (most recent call last):
      File "/Users/wuzhiguo/py/pydemo/main.py", line 140, in <module>
        raise Exception('aaa', 'bbb', 'ccc')
    Exception: ('aaa', 'bbb', 'ccc')
    Traceback (most recent call last):
      File "/Users/wuzhiguo/py/pydemo/main.py", line 140, in <module>
        raise Exception('aaa', 'bbb', 'ccc')
    Exception: ('aaa', 'bbb', 'ccc')
    Traceback (most recent call last):
      File "/Users/wuzhiguo/py/pydemo/main.py", line 185, in <module>
        raise Exception('模拟异常')
    Exception: 模拟异常


# 完