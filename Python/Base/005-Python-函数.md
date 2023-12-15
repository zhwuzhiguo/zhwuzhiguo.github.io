# 005-Python-函数

## main.py

```python
def say():
    """
    无参函数
    :return: 无
    """
    print('say..')


print('无参函数')
say()


def say(content):
    print('say:{}'.format(content))


print('有参函数')
say('ok..')


def add(a, b):
    return a + b


def reduce(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    return a / b


print('计算函数')
print(add(1, 2))
print(reduce(12, 2))
print(multiply(6, 3))
print(divide(10, 3))
value = add(100, 200)
print(value)


def more(x, y):
    """
    函数返回多值
    :param x: 参数x
    :param y: 参数y
    :return: 返回nx,ny
    """
    nx = x * 2
    ny = y * 2
    return nx, ny


print('函数返回多值')
x = 2
y = 4
nx, ny = more(x, y)
print(nx, ny)
print(more(x, y))


def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)


print('递归函数')
print('fact({})={}'.format(5, fact(5)))

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    无参函数
    say..
    有参函数
    say:ok..
    计算函数
    3
    10
    18
    3.3333333333333335
    300
    函数返回多值
    4 8
    (4, 8)
    递归函数
    fact(5)=120
    

# 完