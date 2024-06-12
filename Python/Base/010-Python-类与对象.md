# 010-Python-类与对象

## main.py

```python
# 定义类
class Car(object):
    # 定义类变量
    name = 'Car'

    # 构造函数
    def __init__(self, name):
        # 定义实例变量(无需声明)
        self.name = name

    # 类方法
    # 将类本身作为对象进行操作的方法
    # 可调类变量
    # 可被类调用
    # 可被实例调用
    # 通过 @classmethod 装饰器实现
    # 只能访问类变量
    # 不能访问实例变量
    # 通过 cls 参数传递当前类对象(不需要实例化)
    @classmethod
    def run_class(cls, speed):
        print(cls.name, speed, '行驶')

    # 静态方法
    # 是类中的函数(不需要实例)
    # 可调类变量
    # 可被类调用
    # 可被实例调用
    # 通过 @staticmethod 装饰器实现
    # 可以访问类变量
    # 不能访问实例变量
    # 不带 cls 参数
    @staticmethod
    def run_static(speed):
        print(Car.name, speed, '行驶')

    # 实例方法
    # 就是类的实例能够使用的方法
    # 可调类变量
    # 可调实例变量
    # 可被实例调用
    # 第一个参数强制为实例对象 self
    def run(self, speed):
        print(self.name, speed, '行驶')


# 类的继承
# 基本语法：
# class ClassName(BaseClassName)
class MiniCar(Car):
    desc = 'mini car'


# 类的多态
class BMWCar(Car):
    def run(self, speed):
        print('BMWCar: ' + self.name, speed, '行驶')


# 类的多态
class BENCar(Car):
    def run(self, speed):
        print('BENCar: ' + self.name, speed, '行驶')


# 创建类对象
car = Car('大众')

# 类方法
print("类方法:")
Car.run_class('100km/h')
car.run_class('100km/h')

# 静态方法
print("静态方法:")
Car.run_static('100km/h')
car.run_static('100km/h')

# 实例方法
print("实例方法:")
car.run('100km/h')
print(car.name)

# 类的继承
print("类的继承:")
mini_car = MiniCar('MINI')
mini_car.run('50km/h')
print(mini_car.name)
print(mini_car.desc)

# 类的多态
print("类的多态:")
bmw_car = BMWCar('宝马')
ben_car = BENCar('奔驰')
bmw_car.run('100km/h')
ben_car.run('100km/h')

# 多重继承
print("多重继承:")


# Python允许使用多重继承
# MixIn(混入类)是一种常见的设计
class Animal:
    def __init__(self, name):
        self.name = name


# 可跑动物
class RunnableMixIn:
    def __init__(self, speed):
        self.speed = speed

    def run(self):
        print(f"Running {self.speed} ...")


# 多重继承
class Dog(Animal, RunnableMixIn):
    def __init__(self, name, speed, color):
        # 通过父类名调用父类的构造函数
        Animal.__init__(self, name)
        RunnableMixIn.__init__(self, speed)
        self.color = color


dog = Dog("Jack", "100km/h", "black")
print(dog.name)
print(dog.speed)
print(dog.color)
dog.run()

# 类的私有属性
print("类的私有属性:")


class Student:
    def __init__(self, name):
        self.name = name
        # 以双下划线开始的属性
        # 是私有属性
        # 外部不能访问
        self.__age = 18

    def print(self):
        print(f"name={self.name} age={self.__age}")


s = Student('John')
print(s.name)
# 不能访问
# 以双下划线开始的属性是私有属性
# print(s.__age)
# 只能通过类方法访问
s.print()

# 和静态语言不同
# Python允许对实例变量绑定任何数据
# 也就是说
# 对于两个实例变量
# 虽然它们都是同一个类的不同实例
# 但拥有的变量可能不同
s.score = 90
print(s.score)


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    类方法:
    Car 100km/h 行驶
    Car 100km/h 行驶
    静态方法:
    Car 100km/h 行驶
    Car 100km/h 行驶
    实例方法:
    大众 100km/h 行驶
    大众
    类的继承:
    MINI 50km/h 行驶
    MINI
    mini car
    类的多态:
    BMWCar: 宝马 100km/h 行驶
    BENCar: 奔驰 100km/h 行驶
    多重继承:
    Jack
    100km/h
    black
    Running 100km/h ...
    类的私有属性:
    John
    name=John age=18
    90


## main2.py

```python
from dataclasses import dataclass


# 定义类似其他语言的类
@dataclass
class Employee:
    name: str
    age: int


employee1 = Employee('jack', 20)
employee2 = Employee('jim', 30)
print(employee1)
print(employee2)
print(employee1.name)
print(employee2.name)

```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main2.py 
    Employee(name='jack', age=20)
    Employee(name='jim', age=30)
    jack
    jim


## main3.py

```python
# 内置@property装饰器负责把一个方法变成属性
# 把一个getter方法变成属性只需要加上@property就可以了
# 此时@property本身又创建了另一个装饰器比如@age.setter
# 负责把一个setter方法变成属性赋值
# 于是就拥有一个可控的属性操作
# 只定义getter方法不定义setter方法就是一个只读属性
# @property广泛应用在类的定义中
# 可以让调用者写出简短的代码
# 同时保证对参数进行必要的检查
# 要特别注意:
# 属性的方法名不要和实例变量重名
# 否则会造成无限递归
class People:

    def __init__(self, name):
        self.__name = name
        self.__age = 0

    # 只读属性name
    @property
    def name(self):
        return self.__name

    # 读写属性age
    @property
    def age(self):
        return self.__age

    # 读写属性age
    @age.setter
    def age(self, value: int):
        if value < 0:
            raise ValueError("age must be greater than or equal to 0")
        self.__age = value


p = People("Jack")
# 不能设置只读属性
# p.name = "Jim"
p.age = 18
print(p.name)
print(p.age)


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main3.py 
    Jack
    18


## main4.py

```python
from enum import Enum, unique

# 枚举类
# Enum 可以把一组相关常量定义在一个class中
# 且class不可变
# 而且成员可以直接比较
Month = Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))
print(Month.Jan)
# value属性默认从1开始计数
print(Month.Jan.value)
# 遍历枚举
for month in Month:
    print(month)
    print(month.name)
    print(month.value)


# 从Enum派生出自定义类
# @unique装饰器检查保证没有重复值
@unique
class Color(Enum):
    RED = 1
    BLUE = 2
    GREEN = 3


print(Color.RED)
print(Color["RED"])
print(Color(1))
print(Color.RED.name)
print(Color["RED"].name)
print(Color(1).name)
print(Color.RED.value)
print(Color["RED"].value)
print(Color(1).value)
# 枚举比较
red = Color.RED
print(red == Color.RED)


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main4.py 
    Month.Jan
    1
    Month.Jan
    Jan
    1
    Month.Feb
    Feb
    2
    Month.Mar
    Mar
    3
    Month.Apr
    Apr
    4
    Month.May
    May
    5
    Month.Jun
    Jun
    6
    Month.Jul
    Jul
    7
    Month.Aug
    Aug
    8
    Month.Sep
    Sep
    9
    Month.Oct
    Oct
    10
    Month.Nov
    Nov
    11
    Month.Dec
    Dec
    12
    Color.RED
    Color.RED
    Color.RED
    RED
    RED
    RED
    1
    1
    1
    True


## main5.py

```python
# 定制类
class MyClass:
    def __init__(self, name):
        self.name = name

    # 打印实例时调用
    def __str__(self):
        return f"MyClass {self.name}"

    # 设置俩个函数一样的功能
    # 直接显示变量时调用
    # 比如在交互模式或调试时
    __repr__ = __str__

    # 直接对实例进行调用
    def __call__(self, *args, **kwargs):
        print(f"Calling {self.name}")


my = MyClass("Jack")
print(my)
# 直接对实例进行调用
my()
# 判断一个对象是否能被调用
print(callable(my))


```

## 运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main5.py 
    MyClass Jack
    Calling Jack
    True


# 完