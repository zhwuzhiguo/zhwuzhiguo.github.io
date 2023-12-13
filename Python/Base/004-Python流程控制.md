# 004-Python流程控制

## main.py

```python
# if 语句
print("if 语句")
x = 3
if x == 0:
    print("x == 0")
elif x == 1:
    print("x == 1")
elif x == 2:
    print("x == 2")
else:
    print("x == {}".format(x))

# for 循环
# for 循环可以遍历任何序列的项目
# 如一个列表或者一个字符串
print("for 循环")
for letter in 'abc':
    print(letter)

fruits = ['apple', 'banana', 'orange']
for fruit in fruits:
    print(fruit)

# 通过索引遍历
for index in range(len(fruits)):
    print(fruits[index])

# while 循环
print("while 循环")
count = 5
while count > 0:
    print(count)
    count = count - 1

# 也可以在 while 循环中添加判断逻辑
print("while 循环中添加判断逻辑")
count = 5
while count > 0:
    print(count)
    count = count - 1
else:
    print("count={}".format(count))

# range() 函数
# range() 会很方便生成一个等差数值序列
# range (start， end， scan):
# start:
# 计数从 start 开始
# 默认是从 0 开始
# 如 range(5) 等价于 range(0, 5)
# end:
# 计数到 end 结束(不包括 end)
# scan：
# 每次跳跃的间距(默认为1)
# 如 range(0, 5) 等价于 range(0, 5, 1)
print("range() 函数")
print(len(range(0, 5)))
print(len(range(0, 5, 1)))
print(len(range(0, 5, 2)))

print("range() 用于 for 循环")
for index in range(2, 6):
    print(index)
print(range(2, 6), 'finish')

for index in range(0, 10, 2):
    print(index)
print(range(0, 10, 2), 'finish')

print("range() 用于 for 循环遍历列表")
a = ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
for i in range(len(a)):
    print(i, a[i])

# break 用法
print("break 用法")
fruits = ['apple', 'banana', 'orange']
for fruit in fruits:
    if fruit == 'banana':
        break
    print(fruit)

# continue 用法
print("continue 用法")
fruits = ['apple', 'banana', 'orange']
for fruit in fruits:
    if fruit == 'banana':
        continue
    print(fruit)

# pass 语句
# pass 是空语句
# 是为了保持程序结构的完整性
# 用于那些语法上必须要有什么语句但程序什么也不做的场合
print("pass 语句")


class MyClass:
    pass

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    if 语句
    x == 3
    for 循环
    a
    b
    c
    apple
    banana
    orange
    apple
    banana
    orange
    while 循环
    5
    4
    3
    2
    1
    while 循环中添加判断逻辑
    5
    4
    3
    2
    1
    count=0
    range() 函数
    5
    5
    3
    range() 用于 for 循环
    2
    3
    4
    5
    range(2, 6) finish
    0
    2
    4
    6
    8
    range(0, 10, 2) finish
    range() 用于 for 循环遍历列表
    0 aaa
    1 bbb
    2 ccc
    3 ddd
    4 eee
    break 用法
    apple
    continue 用法
    apple
    orange
    pass 语句
    

# 完