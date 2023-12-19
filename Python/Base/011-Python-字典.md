# 011-Python-字典

## main.py

```python
# 字典是键值对组成的集合
# 键唯一不重复，必须是不可变类型，如字符串、数字、元组
# 值可以重复，可以取任何数据类型
dictionary = {'name': 'jack', 'age': 20, 123: 'abc', ('一年级', '数学'): 100}
print(dictionary)
print(dictionary['name'])
print(dictionary[('一年级', '数学')])

# 访问字典数据
print("访问字典数据")
dict1 = {'name': 'jack', 'age': 20, 123: 'abc'}
print(dict1['name'])
print(dict1['age'])
print(dict1[123])
# 访问不存在的键会报错
# print(dict1['aaa'])

# 修改字典元素
print("修改字典元素")
dict2 = {'name': 'jack'}
print(dict2)
# 键不存在添加
dict2['age'] = 20
# 键存在更新
dict2['name'] = 'jim'
print(dict2)
# 删除键值对
del dict2['name']
print(dict2)
# 清空字典
dict2.clear()
print(dict2)
# 删除字典
del dict2
# 不能再打印
# print(dict2)

# 字典键的特性
print("字典键的特性")
# 不允许同一个键出现两次
# 键必须不可变
# 所以可以用数字，字符串或元组充当
# 所以用列表就不行
dict3 = {'name': 'jack', 'age': 20, 'name': 'jim'}
print(dict3)
# 列表当键不行
# dict4 = {['name']: 'jack'}
# print(dict4)
dict5 = {('name',): 'jack'}
print(dict5)

# 字典的函数
print("字典的函数")
dict6 = {'name': 'jack', 'age': 20, 123: 'abc'}
# len()
# 计算字典元素个数
print(len(dict6))
# str()
# 输出字典中可以打印的字符串标识
print(str(dict6))
# type()
# 返回输入的变量类型
print(type(dict6))

# 字典的方法
print("字典的方法")

# clear()
# 删除字典内所有元素
print("clear()")
dict7 = {'name': 'jack', 'age': 20}
dict7.clear()
print(dict7)

# copy()
# 对字典进行复制
print("copy()")
dict8 = {'name': 'jack', 'age': 20}
dict9 = dict8  # 浅拷贝: 引用对象赋值
dict10 = dict8.copy()  # 深拷贝
dict8['name'] = 'jim'
print(dict8)
print(dict9)
print(dict10)

# dict.fromkeys()
# 创建一个新字典
# 以序列seq中元素做字典的键
# val为字典所有键对应的初始值
# 该方法返回一个新的字典
# 语法:
# dict.fromkeys(seq[, value])
# 参数:
# seq - 字典键值列表
# value - 可选参数, 设置键序列对应的值, 默认为 None
print("dict.fromkeys()")
seq = ('aaa', 'bbb', 'ccc', 'ddd')
dict11 = dict.fromkeys(seq)
dict12 = dict.fromkeys(seq, 123)
print(dict11)
print(dict12)

# get()
# 返回指定键的值
# 如果值不在字典中返回default值
# 语法:
# dict.get(key, default=None)
# 参数:
# key - 字典中要查找的键
# default - 如果指定键的值不存在时, 返回该默认值值
print("get()")
dict13 = {'name': 'jack', 'age': 20}
print('name: {}'.format(dict13.get('name')))
print('age: {}'.format(dict13.get('age')))
print('other: {}'.format(dict13.get('other')))
print('other: {}'.format(dict13.get('other', 'other')))

# key in dict
# 如果键在字典dict里返回true
# 否则返回false
print("key in dict")
dict14 = {'name': 'jack', 'age': 20}
if 'name' in dict14:
    print('name: {}'.format(dict14.get('name')))
elif 'other' in dict14:
    print('other: {}'.format(dict14.get('other')))
else:
    print('false')

# items()
# 以列表返回可遍历的(键, 值)元组
print("items()")
dict15 = {'name': 'jack', 'age': 20}
print(dict15.items())
for key, value in dict15.items():
    print('{}: {}'.format(key, value))

# keys()
# 返回一个迭代器
# 可以使用 list() 来转换为列表
print("keys()")
dict16 = {'name': 'jack', 'age': 20}
print(dict16.keys())
print(list(dict16.keys()))
for key in dict16.keys():
    print('key:{}'.format(key))

# setdefault()
# 如果 key 存在返回对应的值
# 如果 key 不存在则插入 key 及设置的默认值 default 并返回 default
# default 默认值为 None
# 语法:
# dict.setdefault(key, default=None)
# 参数
# key - 查找的键值
# default - 键不存在时设置的默认键值
print("setdefault()")
dict17 = {'name': 'jack', 'age': 20}
print(dict17.setdefault('name', 'other'))
print(dict17.setdefault('other', 'other'))
print(dict17)

# update(dict2)
# 把字典参数 dict2 的键值对更新到字典 dict 里
# 存在更新, 不存在添加
# 语法:
# dict.update(dict2)
# 参数
# dict2 - 添加到指定字典dict里的字典
print("update(dict2)")
dict18 = {'name': 'jack', 'age': 20}
dict19 = {'age': 30, 'other': 'other'}
dict18.update(dict19)
print(dict18)
print(dict19)

# values()
# 返回一个迭代器
# 可以使用 list() 来转换为列表
print("values()")
dict20 = {'name': 'jack', 'age': 20}
print(dict20.values())
print(list(dict20.values()))
for value in dict20.values():
    print('value:{}'.format(value))

# pop()
# 删除给定键 key 所对应的值
# 返回值为被删除的值
# key 值必须给出
# 否则返回default值
# 语法:
# pop(key[,default])
# 参数:
# key - 要删除的键值
# default - 如果没有 key 返回 default 值
print("pop()")
dict21 = {'name': 'jack', 'age': 20}
print(dict21.pop('name'))
# print(dict21.pop('name')) # key 不存在报错
print(dict21.pop('name', 'other'))
print(dict21)

# popitem()
# 随机返回一个键值对
# 按照 LIFO（后进先出法） 顺序规则
# 如果字典已经为空报错
print("popitem()")
dict22 = {'name': 'jack', 'age': 20, 'other': 'other'}
dict23 = {'name': 'jack', 'other': 'other', 'age': 20}
print(dict22 == dict23)
print(dict22)
print(dict22.popitem())
print(dict22.popitem())
print(dict22.popitem())
print(dict23)
print(dict23.popitem())
print(dict23.popitem())
print(dict23.popitem())

# 字典和列表
print("字典和列表")
# 列表中的元素表项从0开始递增存放
# 列表中的元素表是排序的
# 字典的元素表是不排序的
ll1 = ['aaa', 'bbb', 'ccc', 'ddd']
ll2 = ['ccc', 'ddd', 'aaa', 'bbb']
print(ll1 == ll2)
dt1 = {'name': 'jack', 'age': 20}
dt2 = {'age': 20, 'name': 'jack'}
print(dt1 == dt2)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    {'name': 'jack', 'age': 20, 123: 'abc', ('一年级', '数学'): 100}
    jack
    100
    访问字典数据
    jack
    20
    abc
    修改字典元素
    {'name': 'jack'}
    {'name': 'jim', 'age': 20}
    {'age': 20}
    {}
    字典键的特性
    {'name': 'jim', 'age': 20}
    {('name',): 'jack'}
    字典的函数
    3
    {'name': 'jack', 'age': 20, 123: 'abc'}
    <class 'dict'>
    字典的方法
    clear()
    {}
    copy()
    {'name': 'jim', 'age': 20}
    {'name': 'jim', 'age': 20}
    {'name': 'jack', 'age': 20}
    dict.fromkeys()
    {'aaa': None, 'bbb': None, 'ccc': None, 'ddd': None}
    {'aaa': 123, 'bbb': 123, 'ccc': 123, 'ddd': 123}
    get()
    name: jack
    age: 20
    other: None
    other: other
    key in dict
    name: jack
    items()
    dict_items([('name', 'jack'), ('age', 20)])
    name: jack
    age: 20
    keys()
    dict_keys(['name', 'age'])
    ['name', 'age']
    key:name
    key:age
    setdefault()
    jack
    other
    {'name': 'jack', 'age': 20, 'other': 'other'}
    update(dict2)
    {'name': 'jack', 'age': 30, 'other': 'other'}
    {'age': 30, 'other': 'other'}
    values()
    dict_values(['jack', 20])
    ['jack', 20]
    value:jack
    value:20
    pop()
    jack
    other
    {'age': 20}
    popitem()
    True
    {'name': 'jack', 'age': 20, 'other': 'other'}
    ('other', 'other')
    ('age', 20)
    ('name', 'jack')
    {'name': 'jack', 'other': 'other', 'age': 20}
    ('age', 20)
    ('other', 'other')
    ('name', 'jack')
    字典和列表
    False
    True


# 完