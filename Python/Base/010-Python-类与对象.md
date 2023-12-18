# 010-Python-类与对象

## main.py

```python
# 定义类
class Car(object):
    # 定义属性
    name = 'Car'

    # 构造函数
    def __init__(self, name):
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


# 完