# 025-Python-到底是值传递还是引用传递

## main.py

```python
# 当调用函数时会把实际参数传递给形式参数
# 这个传递过程有两种:
# 1 值传递 - 不可变数据类型(数字，字符串，元组)
# 2 引用传递 - 可变数据类型(列表，字典，集合)

# 值传递
# 不可变数据类型
print("值传递:")


def swap(a, b):
    n = a
    a = b
    b = n
    print("swap a:{} b:{}".format(a, b))


num1 = 100
num2 = 200
swap(num1, num2)
print("num1:{} num2:{}".format(num1, num2))


# 引用传递
# 可变数据类型
print("引用传递:")


def process1(ll):
    print("process1 ll", "id", id(ll))
    # 改变变量
    # 改变实参指向的对象
    ll.append(400)
    print("process1 ll", "id", id(ll))
    print("process1 ll:", ll)


def process2(ll):
    print("process2 ll", "id", id(ll))
    # 重新赋值
    # 改变形参的指向
    # 实参指向的对象不变
    ll = ll + [400]
    print("process2 ll", "id", id(ll))
    print("process2 ll:", ll)


ll1 = [100, 200, 300]
process1(ll1)
print("ll1:", ll1)
print("ll1", "id", id(ll1))

ll2 = [100, 200, 300]
process2(ll2)
print("ll2:", ll2)
print("ll2", "id", id(ll2))

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    值传递:
    swap a:200 b:100
    num1:100 num2:200
    引用传递:
    process1 ll id 4361144704
    process1 ll id 4361144704
    process1 ll: [100, 200, 300, 400]
    ll1: [100, 200, 300, 400]
    ll1 id 4361144704
    process2 ll id 4362524608
    process2 ll id 4362528896
    process2 ll: [100, 200, 300, 400]
    ll2: [100, 200, 300]
    ll2 id 4362524608


# 完