# 002-Python数据库-SQLAlchemy

目录结构：

    pydemo tree .
    .
    ├── db
    │   ├── __init__.py
    │   ├── database.py
    │   ├── database_orm.py
    │   ├── database_table.py
    │   ├── object
    │   │   ├── __init__.py
    │   │   ├── department.py
    │   │   └── employee.py
    │   └── table
    │       └── __init__.py
    ├── main_database.py
    ├── main_database_orm.py
    └── main_database_table.py


## db/__init__.py

```python
"""
CREATE TABLE user (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  username varchar(32) NOT NULL COMMENT '用户名',
  password varchar(32) NOT NULL COMMENT '用户密码',
  nickname varchar(32) NOT NULL COMMENT '用户昵称',
  telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id) USING BTREE,
  UNIQUE KEY uk_username (username) USING BTREE COMMENT '用户名唯一索引',
  UNIQUE KEY uk_telephone (telephone) USING BTREE COMMENT '用户手机唯一索引',
  KEY idx_status (status) USING BTREE COMMENT '用户状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE department (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  name varchar(32) NOT NULL COMMENT '名称',
  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

CREATE TABLE employee (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  dept_id bigint(20) unsigned NOT NULL COMMENT '部门ID',
  name varchar(32) NOT NULL COMMENT '名称',
  status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
  create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工表';
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 创建连接引擎
# 连接mysql数据库
# 使用pymysql连接数据库
engine = create_engine("mysql+pymysql://root:123456@localhost:3306/test?charset=utf8mb4", echo=True)

# ORM 使用
# Session工厂
# 设置会话提交后会话中的所有对象不过期
# 即后续访问对象时不会重新从数据库获取新值
# expire_on_commit=False
Session = sessionmaker(engine, expire_on_commit=False)

```

## db/table/__init__.py

```python
from sqlalchemy import BigInteger
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import MetaData
from sqlalchemy import String
from sqlalchemy import Table

from db import engine

# 元数据
metadata = MetaData()

# 表反射
user_table = Table("user", metadata, autoload_with=engine)

# 表定义
department_table = Table(
    "department", metadata,
    Column("id", BigInteger, primary_key=True),
    Column("name", String(32)),
    Column("status", Integer),
    Column("create_time", DateTime),
    Column("update_time", DateTime)
)

# 表定义
employee_table = Table(
    "employee", metadata,
    Column("id", BigInteger, primary_key=True),
    Column("dept_id", BigInteger),
    Column("name", String(32)),
    Column("status", Integer),
    Column("create_time", DateTime),
    Column("update_time", DateTime)
)

```

## db/object/__init__.py

```python
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

```

## db/object/department.py

```python
from datetime import datetime

from sqlalchemy import BigInteger
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.schema import FetchedValue

from db.object import Base


class Department(Base):
    __tablename__ = 'department'
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String(32))
    status: Mapped[int] = mapped_column(Integer, server_default=FetchedValue())
    create_time: Mapped[datetime] = mapped_column(DateTime, server_default=FetchedValue())
    update_time: Mapped[datetime] = mapped_column(DateTime,
                                                  server_default=FetchedValue(),
                                                  server_onupdate=FetchedValue())

    def __repr__(self):
        return (f"Department("
                f"id={self.id}, "
                f"name={self.name}, "
                f"status={self.status}, "
                f"create_time={self.create_time}, "
                f"update_time={self.update_time}, "
                f")")

```

## db/object/employee.py

```python
from datetime import datetime

from sqlalchemy import BigInteger
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.schema import FetchedValue

from db.object import Base


class Employee(Base):
    __tablename__ = 'employee'
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    dept_id: Mapped[int] = mapped_column(BigInteger)
    name: Mapped[str] = mapped_column(String(32))
    status: Mapped[int] = mapped_column(Integer, server_default=FetchedValue())
    create_time: Mapped[datetime] = mapped_column(DateTime, server_default=FetchedValue())
    update_time: Mapped[datetime] = mapped_column(DateTime,
                                                  server_default=FetchedValue(),
                                                  server_onupdate=FetchedValue())

    def __repr__(self):
        return (f"Employee("
                f"id={self.id}, "
                f"dept_id={self.dept_id}, "
                f"name={self.name}, "
                f"status={self.status}, "
                f"create_time={self.create_time}, "
                f"update_time={self.update_time}, "
                f")")

```


## db/database.py

```python
from sqlalchemy import text

from db import engine


# 在一个连接中执行
# 手动提交回滚事务
def insert_user():
    with engine.connect() as conn:
        result = conn.execute(
            text("INSERT INTO user(username, password, nickname, telephone) "
                 "VALUES (:username, :password, :nickname, :telephone)"),
            [{"username": "admin11", "password": "123456", "nickname": "管理员11", "telephone": "13800000011"},
             {"username": "admin12", "password": "123456", "nickname": "管理员12", "telephone": "13800000012"},
             {"username": "admin13", "password": "123456", "nickname": "管理员13", "telephone": "13800000013"}])

        conn.commit()
        print(result.rowcount)


# 在一个事务中执行
# 事务自动提交回滚
def insert_user_auto():
    with engine.begin() as conn:
        result = conn.execute(
            text("INSERT INTO user(username, password, nickname, telephone) "
                 "VALUES (:username, :password, :nickname, :telephone)"),
            [{"username": "admin21", "password": "123456", "nickname": "管理员21", "telephone": "13800000021"},
             {"username": "admin22", "password": "123456", "nickname": "管理员22", "telephone": "13800000022"},
             {"username": "admin23", "password": "123456", "nickname": "管理员23", "telephone": "13800000023"}])

        print(result.rowcount)


# 访问行-元组分配
def get_user_tuple():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, username FROM user"))
        # 元组数量需要和返回字段数量一致
        for pid, username in result:
            print(f"id: {pid} username: {username}")


# 访问行-整数索引
def get_user_index():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user"))
        for row in result:
            print(f"id: {row[0]} username: {row[1]} password: {row[2]}")


# 访问行-属性名称
def get_user_property():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user"))
        for row in result:
            print(f"id: {row.id} username: {row.username} password: {row.password}")


# 访问行-映射访问
def get_user_key():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user"))
        for row in result.mappings():
            print(f"id: {row['id']} nickname: {row['nickname']}")


# 传递参数
def get_user_param():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user WHERE id >= :id AND username LIKE :username"),
                              {"id": 1, "username": "admin2%"})
        for row in result:
            print(f"id: {row.id} username: {row.username}")


# 获取一行
def get_user_one():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user WHERE id = 1"))
        row = result.fetchone()
        print(row)
        return row


# 获取多行
def get_user_many():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user"))
        rows = result.fetchmany(5)
        print(rows)
        return rows


# 获取全部行
def get_user_all():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user"))
        rows = result.fetchall()
        print(rows)
        return rows

```

## db/database_table.py

```python
from sqlalchemy import and_
from sqlalchemy import delete
from sqlalchemy import func
from sqlalchemy import insert
from sqlalchemy import or_
from sqlalchemy import select
from sqlalchemy import update

from db import engine
from db.table import department_table
from db.table import employee_table


# 插入单行
# 插入多行
# department = {"name": "人力资源部"}
# employees = [
#     {"name": "张三"},
#     {"name": "李四"},
#     {"name": "王五"}]
def add_department(department, employees):
    with engine.begin() as conn:
        result = conn.execute(insert(department_table), department)
        print(result.rowcount)
        print(result.inserted_primary_key)
        pid, = result.inserted_primary_key

        if employees:
            for employee in employees:
                employee["dept_id"] = pid

            result = conn.execute(insert(employee_table), employees)
            print(result.rowcount)

        return pid


# 更新
# pid = 1
# department = {"name": "人事部"}
def update_department(pid, department):
    with engine.begin() as conn:
        result = conn.execute(
            update(department_table)
            .values(department)
            .where(department_table.c.id == pid))
        print(result.rowcount)


# 删除
# pid = 2
def delete_department(pid):
    with engine.begin() as conn:
        result = conn.execute(
            delete(department_table)
            .where(department_table.c.id == pid))
        print(result.rowcount)


# 查询单行
# pid = 1
def get_department(pid):
    with engine.connect() as conn:
        result = conn.execute(
            select(department_table)
            .where(department_table.c.id == pid))

        row = result.fetchone()
        print(row)
        return row


# 查询单行-指定返回列
# pid = 1
def get_department_columns(pid):
    with engine.connect() as conn:
        result = conn.execute(
            select(department_table.c.id,
                   department_table.c.name,
                   department_table.c.status)
            .where(department_table.c.id == pid))

        row = result.fetchone()
        print(row)
        return row


# 查询多行
def get_departments():
    with engine.connect() as conn:
        result = conn.execute(
            select(department_table)
            .where(department_table.c.id >= 0)
            .where(department_table.c.status >= 0)
            .order_by(department_table.c.status)
            .order_by(department_table.c.id.desc()))

        rows = result.fetchall()
        print(rows)
        return rows


# 查询行数
def get_departments_count():
    with engine.connect() as conn:
        result = conn.execute(
            select(func.count("*").label("row_count"))
            .select_from(department_table)
            .where(department_table.c.id >= 0)
            .where(department_table.c.status >= 0))

        row = result.one()
        print(row)
        return row.row_count


# 复杂查询
def get_departments_conditions():
    with engine.connect() as conn:
        result = conn.execute(
            select(department_table)
            .where(and_(
                or_(department_table.c.id == 1,
                    department_table.c.id == 2),
                department_table.c.status == 0))
            .order_by(department_table.c.status)
            .order_by(department_table.c.id.desc()))

        rows = result.fetchall()
        print(rows)
        return rows


# 关联查询-INNER JOIN
def get_departments_inner_join():
    with engine.connect() as conn:
        result = conn.execute(
            select(department_table.c.id.label("department_id"),
                   department_table.c.name.label("department_name"),
                   employee_table.c.id.label("employee_id"),
                   employee_table.c.name.label("employee_name"))
            .join_from(department_table, employee_table, and_(department_table.c.id == employee_table.c.dept_id))
            .where(department_table.c.id > 0)
            .order_by(department_table.c.id))

        rows = result.fetchall()
        print(rows)
        return rows


# 关联查询-LEFT OUTER JOIN
def get_departments_left_join():
    with engine.connect() as conn:
        result = conn.execute(
            select(department_table.c.id.label("department_id"),
                   department_table.c.name.label("department_name"),
                   employee_table.c.id.label("employee_id"),
                   employee_table.c.name.label("employee_name"))
            .join_from(department_table, employee_table, and_(department_table.c.id == employee_table.c.dept_id),
                       isouter=True)
            .where(department_table.c.id > 0)
            .order_by(department_table.c.id))

        rows = result.fetchall()
        print(rows)
        return rows

```

## db/database_orm.py

```python
from sqlalchemy import and_
from sqlalchemy import func
from sqlalchemy import or_
from sqlalchemy import select

from db import Session
from db.object.department import Department
from db.object.employee import Employee


# 插入单行
# 插入多行
# department = Department(name="人力资源部")
# employees = [Employee(name="张三"),
#              Employee(name="李四"),
#              Employee(name="王五")]
def add_department(department, employees):
    # 自动提交回滚
    with Session.begin() as session:
        # 插入主表
        session.add(department)
        # 拿到自增主键
        session.flush()
        print(department)

        if employees:
            for employee in employees:
                employee.dept_id = department.id

            # 插入子表
            session.add_all(employees)
            # 拿到自增主键
            session.flush()
            print(employees)

        return department


# 更新单行
# department = Department(id=1, name="人事部")
def update_department(department):
    # 自动提交回滚
    with Session.begin() as session:
        # 通过主键获取单行
        db_department = session.get(Department, department.id)
        if db_department:
            if department.name:
                db_department.name = department.name
            if department.status:
                db_department.status = department.status


# 删除单行
# pid = 2
def delete_department(pid):
    # 自动提交回滚
    with Session.begin() as session:
        # 通过主键获取单行
        db_department = session.get(Department, pid)
        if db_department:
            session.delete(db_department)


# 查询单行
# pid = 1
def get_department(pid):
    with Session() as session:
        # 通过主键获取单行
        db_department = session.get(Department, pid)
        print(db_department)
        return db_department


# 查询多行
def get_departments():
    with Session() as session:
        result = session.scalars(
            select(Department)
            .where(Department.id >= 0)
            .where(Department.status >= 0)
            .order_by(Department.status)
            .order_by(Department.id.desc()))

        records = result.fetchall()
        print(records)
        return records


# 复杂查询
def get_departments_conditions():
    with Session() as session:
        result = session.scalars(
            select(Department)
            .where(and_(
                or_(Department.id == 1,
                    Department.id == 2),
                Department.status == 0))
            .order_by(Department.status)
            .order_by(Department.id.desc()))

        records = result.fetchall()
        print(records)
        return records


# 查询行数
def get_departments_count():
    with Session() as session:
        result = session.scalar(
            select(func.count("*"))
            .select_from(Department)
            .where(Department.id >= 0)
            .where(Department.status >= 0))

        print(result)
        return result


# 关联查询-INNER JOIN
def get_departments_inner_join():
    with Session() as session:
        result = session.execute(
            select(Department.id.label("department_id"),
                   Department.name.label("department_name"),
                   Employee.id.label("employee_id"),
                   Employee.name.label("employee_name"))
            .join_from(Department, Employee, and_(Department.id == Employee.dept_id))
            .where(Department.id > 0)
            .order_by(Department.id))

        rows = result.fetchall()
        print(rows)
        return rows


# 关联查询-LEFT OUTER JOIN
def get_departments_left_join():
    with Session() as session:
        result = session.execute(
            select(Department.id.label("department_id"),
                   Department.name.label("department_name"),
                   Employee.id.label("employee_id"),
                   Employee.name.label("employee_name"))
            .join_from(Department, Employee, and_(Department.id == Employee.dept_id), isouter=True)
            .where(Department.id > 0)
            .order_by(Department.id))

        rows = result.fetchall()
        print(rows)
        return rows

```


## main_database.py

```python
from db.database import (
    insert_user,
    insert_user_auto,
    get_user_tuple,
    get_user_index,
    get_user_property,
    get_user_key,
    get_user_param,
    get_user_one,
    get_user_many,
    get_user_all)

print("在一个连接中执行:")
print("手动提交回滚事务:")
insert_user()

print("在一个事务中执行:")
print("事务自动提交回滚:")
insert_user_auto()

print("访问行-元组分配:")
get_user_tuple()

print("访问行-整数索引:")
get_user_index()

print("访问行-属性名称:")
get_user_property()

print("访问行-映射访问:")
get_user_key()

print("传递参数:")
get_user_param()

print("获取一行:")
row = get_user_one()
print(f"id: {row.id} username: {row.username}")

print("获取多行:")
rows = get_user_many()
for row in rows:
    print(f"id: {row.id} username: {row.username}")

print("获取全部行:")
rows = get_user_all()
for row in rows:
    print(f"id: {row.id} username: {row.username}")

```

运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main_database.py 
    在一个连接中执行:
    手动提交回滚事务:
    2024-03-19 11:03:58,329 INFO sqlalchemy.engine.Engine SELECT DATABASE()
    2024-03-19 11:03:58,329 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:03:58,330 INFO sqlalchemy.engine.Engine SELECT @@sql_mode
    2024-03-19 11:03:58,330 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:03:58,331 INFO sqlalchemy.engine.Engine SELECT @@lower_case_table_names
    2024-03-19 11:03:58,331 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:03:58,333 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,333 INFO sqlalchemy.engine.Engine INSERT INTO user(username, password, nickname, telephone) VALUES (%(username)s, %(password)s, %(nickname)s, %(telephone)s)
    2024-03-19 11:03:58,333 INFO sqlalchemy.engine.Engine [generated in 0.00023s] [{'username': 'admin11', 'password': '123456', 'nickname': '管理员11', 'telephone': '13800000011'}, {'username': 'admin12', 'password': '123456', 'nickname': '管理员12', 'telephone': '13800000012'}, {'username': 'admin13', 'password': '123456', 'nickname': '管理员13', 'telephone': '13800000013'}]
    2024-03-19 11:03:58,337 INFO sqlalchemy.engine.Engine COMMIT
    3
    在一个事务中执行:
    事务自动提交回滚:
    2024-03-19 11:03:58,338 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,339 INFO sqlalchemy.engine.Engine INSERT INTO user(username, password, nickname, telephone) VALUES (%(username)s, %(password)s, %(nickname)s, %(telephone)s)
    2024-03-19 11:03:58,339 INFO sqlalchemy.engine.Engine [cached since 0.006321s ago] [{'username': 'admin21', 'password': '123456', 'nickname': '管理员21', 'telephone': '13800000021'}, {'username': 'admin22', 'password': '123456', 'nickname': '管理员22', 'telephone': '13800000022'}, {'username': 'admin23', 'password': '123456', 'nickname': '管理员23', 'telephone': '13800000023'}]
    3
    2024-03-19 11:03:58,340 INFO sqlalchemy.engine.Engine COMMIT
    访问行-元组分配:
    2024-03-19 11:03:58,341 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,341 INFO sqlalchemy.engine.Engine SELECT id, username FROM user
    2024-03-19 11:03:58,341 INFO sqlalchemy.engine.Engine [generated in 0.00023s] {}
    id: 1 username: admin11
    id: 2 username: admin12
    id: 3 username: admin13
    id: 4 username: admin21
    id: 5 username: admin22
    id: 6 username: admin23
    2024-03-19 11:03:58,341 INFO sqlalchemy.engine.Engine ROLLBACK
    访问行-整数索引:
    2024-03-19 11:03:58,342 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,342 INFO sqlalchemy.engine.Engine SELECT * FROM user
    2024-03-19 11:03:58,342 INFO sqlalchemy.engine.Engine [generated in 0.00015s] {}
    id: 1 username: admin11 password: 123456
    id: 2 username: admin12 password: 123456
    id: 3 username: admin13 password: 123456
    id: 4 username: admin21 password: 123456
    id: 5 username: admin22 password: 123456
    id: 6 username: admin23 password: 123456
    2024-03-19 11:03:58,343 INFO sqlalchemy.engine.Engine ROLLBACK
    访问行-属性名称:
    2024-03-19 11:03:58,344 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,344 INFO sqlalchemy.engine.Engine SELECT * FROM user
    2024-03-19 11:03:58,344 INFO sqlalchemy.engine.Engine [cached since 0.001956s ago] {}
    id: 1 username: admin11 password: 123456
    id: 2 username: admin12 password: 123456
    id: 3 username: admin13 password: 123456
    id: 4 username: admin21 password: 123456
    id: 5 username: admin22 password: 123456
    id: 6 username: admin23 password: 123456
    2024-03-19 11:03:58,344 INFO sqlalchemy.engine.Engine ROLLBACK
    访问行-映射访问:
    2024-03-19 11:03:58,345 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,345 INFO sqlalchemy.engine.Engine SELECT * FROM user
    2024-03-19 11:03:58,345 INFO sqlalchemy.engine.Engine [cached since 0.002935s ago] {}
    id: 1 nickname: 管理员11
    id: 2 nickname: 管理员12
    id: 3 nickname: 管理员13
    id: 4 nickname: 管理员21
    id: 5 nickname: 管理员22
    id: 6 nickname: 管理员23
    2024-03-19 11:03:58,345 INFO sqlalchemy.engine.Engine ROLLBACK
    传递参数:
    2024-03-19 11:03:58,346 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,346 INFO sqlalchemy.engine.Engine SELECT * FROM user WHERE id >= %(id)s AND username LIKE %(username)s
    2024-03-19 11:03:58,346 INFO sqlalchemy.engine.Engine [generated in 0.00015s] {'id': 1, 'username': 'admin2%'}
    id: 4 username: admin21
    id: 5 username: admin22
    id: 6 username: admin23
    2024-03-19 11:03:58,348 INFO sqlalchemy.engine.Engine ROLLBACK
    获取一行:
    2024-03-19 11:03:58,349 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,349 INFO sqlalchemy.engine.Engine SELECT * FROM user WHERE id = 1
    2024-03-19 11:03:58,349 INFO sqlalchemy.engine.Engine [generated in 0.00017s] {}
    (1, 'admin11', '123456', '管理员11', 13800000011, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58))
    2024-03-19 11:03:58,350 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 1 username: admin11
    获取多行:
    2024-03-19 11:03:58,350 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,350 INFO sqlalchemy.engine.Engine SELECT * FROM user
    2024-03-19 11:03:58,350 INFO sqlalchemy.engine.Engine [cached since 0.008203s ago] {}
    [(1, 'admin11', '123456', '管理员11', 13800000011, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (2, 'admin12', '123456', '管理员12', 13800000012, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (3, 'admin13', '123456', '管理员13', 13800000013, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (4, 'admin21', '123456', '管理员21', 13800000021, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (5, 'admin22', '123456', '管理员22', 13800000022, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58))]
    2024-03-19 11:03:58,351 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 1 username: admin11
    id: 2 username: admin12
    id: 3 username: admin13
    id: 4 username: admin21
    id: 5 username: admin22
    获取全部行:
    2024-03-19 11:03:58,351 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:03:58,351 INFO sqlalchemy.engine.Engine SELECT * FROM user
    2024-03-19 11:03:58,351 INFO sqlalchemy.engine.Engine [cached since 0.009344s ago] {}
    [(1, 'admin11', '123456', '管理员11', 13800000011, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (2, 'admin12', '123456', '管理员12', 13800000012, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (3, 'admin13', '123456', '管理员13', 13800000013, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (4, 'admin21', '123456', '管理员21', 13800000021, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (5, 'admin22', '123456', '管理员22', 13800000022, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58)), (6, 'admin23', '123456', '管理员23', 13800000023, 0, datetime.datetime(2024, 3, 19, 11, 3, 58), datetime.datetime(2024, 3, 19, 11, 3, 58))]
    2024-03-19 11:03:58,352 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 1 username: admin11
    id: 2 username: admin12
    id: 3 username: admin13
    id: 4 username: admin21
    id: 5 username: admin22
    id: 6 username: admin23
    

## main_database_table.py

```python
from db.database_table import (
    add_department,
    update_department,
    delete_department,
    get_department,
    get_department_columns,
    get_departments,
    get_departments_count,
    get_departments_conditions,
    get_departments_inner_join,
    get_departments_left_join)

print("插入单行:")
print("插入多行:")
department = {"name": "人力资源部"}
employees = [
    {"name": "张三"},
    {"name": "李四"},
    {"name": "王五"}]
pid = add_department(department, employees)
print(pid)

department = {"name": "研发部"}
pid = add_department(department, None)
print(pid)

department = {"name": "产品部"}
pid = add_department(department, None)
print(pid)

print("更新:")
pid = 1
department = {"name": "人事部"}
update_department(pid, department)

print("删除:")
pid = 2
delete_department(pid)

print("查询单行:")
pid = 1
row = get_department(pid)
print(f"id: {row.id} name: {row.name} status: {row.status}")

print("查询单行-指定返回列:")
pid = 1
row = get_department_columns(pid)
print(f"id: {row.id} name: {row.name} status: {row.status}")

print("查询多行:")
rows = get_departments()
for row in rows:
    print(f"id: {row.id} name: {row.name} status: {row.status}")

print("查询行数:")
row_count = get_departments_count()
print(row_count)

print("复杂查询:")
rows = get_departments_conditions()
for row in rows:
    print(f"id: {row.id} name: {row.name} status: {row.status}")

print("关联查询-INNER JOIN:")
rows = get_departments_inner_join()
for row in rows:
    print(f"department_id: {row.department_id} "
          f"department_name: {row.department_name} "
          f"employee_id: {row.employee_id} "
          f"employee_name: {row.employee_name}")

print("关联查询-LEFT OUTER JOIN:")
rows = get_departments_left_join()
for row in rows:
    print(f"department_id: {row.department_id} "
          f"department_name: {row.department_name} "
          f"employee_id: {row.employee_id} "
          f"employee_name: {row.employee_name}")

```

运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main_database_table.py 
    2024-03-19 11:05:26,018 INFO sqlalchemy.engine.Engine SELECT DATABASE()
    2024-03-19 11:05:26,018 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:05:26,019 INFO sqlalchemy.engine.Engine SELECT @@sql_mode
    2024-03-19 11:05:26,019 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:05:26,019 INFO sqlalchemy.engine.Engine SELECT @@lower_case_table_names
    2024-03-19 11:05:26,019 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:05:26,032 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,032 INFO sqlalchemy.engine.Engine SHOW CREATE TABLE `user`
    2024-03-19 11:05:26,032 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:05:26,035 INFO sqlalchemy.engine.Engine ROLLBACK
    插入单行:
    插入多行:
    2024-03-19 11:05:26,036 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,037 INFO sqlalchemy.engine.Engine INSERT INTO department (name) VALUES (%(name)s)
    2024-03-19 11:05:26,037 INFO sqlalchemy.engine.Engine [generated in 0.00016s] {'name': '人力资源部'}
    1
    (1,)
    2024-03-19 11:05:26,039 INFO sqlalchemy.engine.Engine INSERT INTO employee (dept_id, name) VALUES (%(dept_id)s, %(name)s)
    2024-03-19 11:05:26,039 INFO sqlalchemy.engine.Engine [generated in 0.00017s] [{'dept_id': 1, 'name': '张三'}, {'dept_id': 1, 'name': '李四'}, {'dept_id': 1, 'name': '王五'}]
    3
    2024-03-19 11:05:26,040 INFO sqlalchemy.engine.Engine COMMIT
    1
    2024-03-19 11:05:26,041 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,041 INFO sqlalchemy.engine.Engine INSERT INTO department (name) VALUES (%(name)s)
    2024-03-19 11:05:26,041 INFO sqlalchemy.engine.Engine [cached since 0.004463s ago] {'name': '研发部'}
    1
    (2,)
    2024-03-19 11:05:26,042 INFO sqlalchemy.engine.Engine COMMIT
    2
    2024-03-19 11:05:26,043 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,043 INFO sqlalchemy.engine.Engine INSERT INTO department (name) VALUES (%(name)s)
    2024-03-19 11:05:26,043 INFO sqlalchemy.engine.Engine [cached since 0.006351s ago] {'name': '产品部'}
    1
    (3,)
    2024-03-19 11:05:26,044 INFO sqlalchemy.engine.Engine COMMIT
    3
    更新:
    2024-03-19 11:05:26,045 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,047 INFO sqlalchemy.engine.Engine UPDATE department SET name=%(name)s WHERE department.id = %(id_1)s
    2024-03-19 11:05:26,047 INFO sqlalchemy.engine.Engine [generated in 0.00014s] {'name': '人事部', 'id_1': 1}
    1
    2024-03-19 11:05:26,048 INFO sqlalchemy.engine.Engine COMMIT
    删除:
    2024-03-19 11:05:26,048 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,049 INFO sqlalchemy.engine.Engine DELETE FROM department WHERE department.id = %(id_1)s
    2024-03-19 11:05:26,049 INFO sqlalchemy.engine.Engine [generated in 0.00011s] {'id_1': 2}
    1
    2024-03-19 11:05:26,050 INFO sqlalchemy.engine.Engine COMMIT
    查询单行:
    2024-03-19 11:05:26,052 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,052 INFO sqlalchemy.engine.Engine SELECT department.id, department.name, department.status, department.create_time, department.update_time 
    FROM department 
    WHERE department.id = %(id_1)s
    2024-03-19 11:05:26,052 INFO sqlalchemy.engine.Engine [generated in 0.00016s] {'id_1': 1}
    (1, '人事部', 0, datetime.datetime(2024, 3, 19, 11, 5, 26), datetime.datetime(2024, 3, 19, 11, 5, 26))
    2024-03-19 11:05:26,052 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 1 name: 人事部 status: 0
    查询单行-指定返回列:
    2024-03-19 11:05:26,053 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,053 INFO sqlalchemy.engine.Engine SELECT department.id, department.name, department.status 
    FROM department 
    WHERE department.id = %(id_1)s
    2024-03-19 11:05:26,053 INFO sqlalchemy.engine.Engine [generated in 0.00016s] {'id_1': 1}
    (1, '人事部', 0)
    2024-03-19 11:05:26,054 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 1 name: 人事部 status: 0
    查询多行:
    2024-03-19 11:05:26,055 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,055 INFO sqlalchemy.engine.Engine SELECT department.id, department.name, department.status, department.create_time, department.update_time 
    FROM department 
    WHERE department.id >= %(id_1)s AND department.status >= %(status_1)s ORDER BY department.status, department.id DESC
    2024-03-19 11:05:26,055 INFO sqlalchemy.engine.Engine [generated in 0.00016s] {'id_1': 0, 'status_1': 0}
    [(3, '产品部', 0, datetime.datetime(2024, 3, 19, 11, 5, 26), datetime.datetime(2024, 3, 19, 11, 5, 26)), (1, '人事部', 0, datetime.datetime(2024, 3, 19, 11, 5, 26), datetime.datetime(2024, 3, 19, 11, 5, 26))]
    2024-03-19 11:05:26,056 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 3 name: 产品部 status: 0
    id: 1 name: 人事部 status: 0
    查询行数:
    2024-03-19 11:05:26,058 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,058 INFO sqlalchemy.engine.Engine SELECT count(%(count_1)s) AS row_count 
    FROM department 
    WHERE department.id >= %(id_1)s AND department.status >= %(status_1)s
    2024-03-19 11:05:26,058 INFO sqlalchemy.engine.Engine [generated in 0.00017s] {'count_1': '*', 'id_1': 0, 'status_1': 0}
    (2,)
    2024-03-19 11:05:26,058 INFO sqlalchemy.engine.Engine ROLLBACK
    2
    复杂查询:
    2024-03-19 11:05:26,059 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,059 INFO sqlalchemy.engine.Engine SELECT department.id, department.name, department.status, department.create_time, department.update_time 
    FROM department 
    WHERE (department.id = %(id_1)s OR department.id = %(id_2)s) AND department.status = %(status_1)s ORDER BY department.status, department.id DESC
    2024-03-19 11:05:26,059 INFO sqlalchemy.engine.Engine [generated in 0.00018s] {'id_1': 1, 'id_2': 2, 'status_1': 0}
    [(1, '人事部', 0, datetime.datetime(2024, 3, 19, 11, 5, 26), datetime.datetime(2024, 3, 19, 11, 5, 26))]
    2024-03-19 11:05:26,060 INFO sqlalchemy.engine.Engine ROLLBACK
    id: 1 name: 人事部 status: 0
    关联查询-INNER JOIN:
    2024-03-19 11:05:26,061 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,061 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, employee.id AS employee_id, employee.name AS employee_name 
    FROM department INNER JOIN employee ON department.id = employee.dept_id 
    WHERE department.id > %(id_1)s ORDER BY department.id
    2024-03-19 11:05:26,061 INFO sqlalchemy.engine.Engine [generated in 0.00018s] {'id_1': 0}
    [(1, '人事部', 1, '张三'), (1, '人事部', 2, '李四'), (1, '人事部', 3, '王五')]
    2024-03-19 11:05:26,062 INFO sqlalchemy.engine.Engine ROLLBACK
    department_id: 1 department_name: 人事部 employee_id: 1 employee_name: 张三
    department_id: 1 department_name: 人事部 employee_id: 2 employee_name: 李四
    department_id: 1 department_name: 人事部 employee_id: 3 employee_name: 王五
    关联查询-LEFT OUTER JOIN:
    2024-03-19 11:05:26,063 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:05:26,063 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, employee.id AS employee_id, employee.name AS employee_name 
    FROM department LEFT OUTER JOIN employee ON department.id = employee.dept_id 
    WHERE department.id > %(id_1)s ORDER BY department.id
    2024-03-19 11:05:26,063 INFO sqlalchemy.engine.Engine [generated in 0.00018s] {'id_1': 0}
    [(1, '人事部', 1, '张三'), (1, '人事部', 2, '李四'), (1, '人事部', 3, '王五'), (3, '产品部', None, None)]
    2024-03-19 11:05:26,064 INFO sqlalchemy.engine.Engine ROLLBACK
    department_id: 1 department_name: 人事部 employee_id: 1 employee_name: 张三
    department_id: 1 department_name: 人事部 employee_id: 2 employee_name: 李四
    department_id: 1 department_name: 人事部 employee_id: 3 employee_name: 王五
    department_id: 3 department_name: 产品部 employee_id: None employee_name: None
    

## main_database_orm.py

```python
from db.database_orm import (
    add_department,
    update_department,
    delete_department,
    get_department,
    get_departments,
    get_departments_conditions,
    get_departments_count,
    get_departments_inner_join,
    get_departments_left_join)

from db.object.department import Department
from db.object.employee import Employee

print("插入单行:")
print("插入多行:")
department = Department(name="人力资源部")
employees = [Employee(name="张三"),
             Employee(name="李四"),
             Employee(name="王五")]

department1 = add_department(department, employees)
print(department1)

department = Department(name="研发部")
department2 = add_department(department, None)
print(department2)

department = Department(name="产品部")
department3 = add_department(department, None)
print(department3)

print("更新单行:")
department = Department(id=1, name="人事部")
update_department(department)

print("删除单行:")
delete_department(2)

print("查询单行:")
department4 = get_department(1)
print(department4)

print("查询多行:")
records = get_departments()
for record in records:
    print(record)

print("复杂查询:")
records = get_departments_conditions()
for record in records:
    print(record)

print("查询行数:")
result = get_departments_count()
print(result)

print("关联查询-INNER JOIN:")
rows = get_departments_inner_join()
for row in rows:
    print(f"department_id: {row.department_id} "
          f"department_name: {row.department_name} "
          f"employee_id: {row.employee_id} "
          f"employee_name: {row.employee_name}")

print("关联查询-LEFT OUTER JOIN:")
rows = get_departments_left_join()
for row in rows:
    print(f"department_id: {row.department_id} "
          f"department_name: {row.department_name} "
          f"employee_id: {row.employee_id} "
          f"employee_name: {row.employee_name}")

```

运行程序

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main_database_orm.py 
    插入单行:
    插入多行:
    2024-03-19 11:08:59,755 INFO sqlalchemy.engine.Engine SELECT DATABASE()
    2024-03-19 11:08:59,756 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:08:59,756 INFO sqlalchemy.engine.Engine SELECT @@sql_mode
    2024-03-19 11:08:59,756 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:08:59,757 INFO sqlalchemy.engine.Engine SELECT @@lower_case_table_names
    2024-03-19 11:08:59,757 INFO sqlalchemy.engine.Engine [raw sql] {}
    2024-03-19 11:08:59,757 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,759 INFO sqlalchemy.engine.Engine INSERT INTO department (name) VALUES (%(name)s)
    2024-03-19 11:08:59,759 INFO sqlalchemy.engine.Engine [generated in 0.00013s] {'name': '人力资源部'}
    2024-03-19 11:08:59,764 INFO sqlalchemy.engine.Engine SELECT department.status AS department_status, department.create_time AS department_create_time, department.update_time AS department_update_time 
    FROM department 
    WHERE department.id = %(pk_1)s
    2024-03-19 11:08:59,764 INFO sqlalchemy.engine.Engine [generated in 0.00014s] {'pk_1': 1}
    Department(id=1, name=人力资源部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    2024-03-19 11:08:59,765 INFO sqlalchemy.engine.Engine INSERT INTO employee (dept_id, name) VALUES (%(dept_id)s, %(name)s)
    2024-03-19 11:08:59,765 INFO sqlalchemy.engine.Engine [generated in 0.00011s] {'dept_id': 1, 'name': '张三'}
    2024-03-19 11:08:59,767 INFO sqlalchemy.engine.Engine INSERT INTO employee (dept_id, name) VALUES (%(dept_id)s, %(name)s)
    2024-03-19 11:08:59,767 INFO sqlalchemy.engine.Engine [cached since 0.001977s ago] {'dept_id': 1, 'name': '李四'}
    2024-03-19 11:08:59,768 INFO sqlalchemy.engine.Engine INSERT INTO employee (dept_id, name) VALUES (%(dept_id)s, %(name)s)
    2024-03-19 11:08:59,768 INFO sqlalchemy.engine.Engine [cached since 0.00251s ago] {'dept_id': 1, 'name': '王五'}
    2024-03-19 11:08:59,770 INFO sqlalchemy.engine.Engine SELECT employee.status AS employee_status, employee.create_time AS employee_create_time, employee.update_time AS employee_update_time 
    FROM employee 
    WHERE employee.id = %(pk_1)s
    2024-03-19 11:08:59,770 INFO sqlalchemy.engine.Engine [generated in 0.00012s] {'pk_1': 1}
    2024-03-19 11:08:59,771 INFO sqlalchemy.engine.Engine SELECT employee.status AS employee_status, employee.create_time AS employee_create_time, employee.update_time AS employee_update_time 
    FROM employee 
    WHERE employee.id = %(pk_1)s
    2024-03-19 11:08:59,771 INFO sqlalchemy.engine.Engine [cached since 0.001123s ago] {'pk_1': 2}
    2024-03-19 11:08:59,772 INFO sqlalchemy.engine.Engine SELECT employee.status AS employee_status, employee.create_time AS employee_create_time, employee.update_time AS employee_update_time 
    FROM employee 
    WHERE employee.id = %(pk_1)s
    2024-03-19 11:08:59,772 INFO sqlalchemy.engine.Engine [cached since 0.001886s ago] {'pk_1': 3}
    [Employee(id=1, dept_id=1, name=张三, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, ), Employee(id=2, dept_id=1, name=李四, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, ), Employee(id=3, dept_id=1, name=王五, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )]
    2024-03-19 11:08:59,772 INFO sqlalchemy.engine.Engine COMMIT
    Department(id=1, name=人力资源部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    2024-03-19 11:08:59,773 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,773 INFO sqlalchemy.engine.Engine INSERT INTO department (name) VALUES (%(name)s)
    2024-03-19 11:08:59,773 INFO sqlalchemy.engine.Engine [cached since 0.01444s ago] {'name': '研发部'}
    2024-03-19 11:08:59,776 INFO sqlalchemy.engine.Engine SELECT department.status AS department_status, department.create_time AS department_create_time, department.update_time AS department_update_time 
    FROM department 
    WHERE department.id = %(pk_1)s
    2024-03-19 11:08:59,776 INFO sqlalchemy.engine.Engine [cached since 0.01239s ago] {'pk_1': 2}
    Department(id=2, name=研发部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    2024-03-19 11:08:59,777 INFO sqlalchemy.engine.Engine COMMIT
    Department(id=2, name=研发部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    2024-03-19 11:08:59,778 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,778 INFO sqlalchemy.engine.Engine INSERT INTO department (name) VALUES (%(name)s)
    2024-03-19 11:08:59,778 INFO sqlalchemy.engine.Engine [cached since 0.01889s ago] {'name': '产品部'}
    2024-03-19 11:08:59,782 INFO sqlalchemy.engine.Engine SELECT department.status AS department_status, department.create_time AS department_create_time, department.update_time AS department_update_time 
    FROM department 
    WHERE department.id = %(pk_1)s
    2024-03-19 11:08:59,782 INFO sqlalchemy.engine.Engine [cached since 0.01878s ago] {'pk_1': 3}
    Department(id=3, name=产品部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    2024-03-19 11:08:59,783 INFO sqlalchemy.engine.Engine COMMIT
    Department(id=3, name=产品部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    更新单行:
    2024-03-19 11:08:59,784 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,785 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, department.status AS department_status, department.create_time AS department_create_time, department.update_time AS department_update_time 
    FROM department 
    WHERE department.id = %(pk_1)s
    2024-03-19 11:08:59,785 INFO sqlalchemy.engine.Engine [generated in 0.00011s] {'pk_1': 1}
    2024-03-19 11:08:59,787 INFO sqlalchemy.engine.Engine UPDATE department SET name=%(name)s WHERE department.id = %(department_id)s
    2024-03-19 11:08:59,787 INFO sqlalchemy.engine.Engine [generated in 0.00011s] {'name': '人事部', 'department_id': 1}
    2024-03-19 11:08:59,789 INFO sqlalchemy.engine.Engine COMMIT
    删除单行:
    2024-03-19 11:08:59,790 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,791 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, department.status AS department_status, department.create_time AS department_create_time, department.update_time AS department_update_time 
    FROM department 
    WHERE department.id = %(pk_1)s
    2024-03-19 11:08:59,791 INFO sqlalchemy.engine.Engine [cached since 0.005654s ago] {'pk_1': 2}
    2024-03-19 11:08:59,792 INFO sqlalchemy.engine.Engine DELETE FROM department WHERE department.id = %(id)s
    2024-03-19 11:08:59,792 INFO sqlalchemy.engine.Engine [generated in 0.00010s] {'id': 2}
    2024-03-19 11:08:59,793 INFO sqlalchemy.engine.Engine COMMIT
    查询单行:
    2024-03-19 11:08:59,794 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,795 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, department.status AS department_status, department.create_time AS department_create_time, department.update_time AS department_update_time 
    FROM department 
    WHERE department.id = %(pk_1)s
    2024-03-19 11:08:59,795 INFO sqlalchemy.engine.Engine [cached since 0.009694s ago] {'pk_1': 1}
    Department(id=1, name=人事部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    2024-03-19 11:08:59,795 INFO sqlalchemy.engine.Engine ROLLBACK
    Department(id=1, name=人事部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    查询多行:
    2024-03-19 11:08:59,796 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,797 INFO sqlalchemy.engine.Engine SELECT department.id, department.name, department.status, department.create_time, department.update_time 
    FROM department 
    WHERE department.id >= %(id_1)s AND department.status >= %(status_1)s ORDER BY department.status, department.id DESC
    2024-03-19 11:08:59,797 INFO sqlalchemy.engine.Engine [generated in 0.00012s] {'id_1': 0, 'status_1': 0}
    [Department(id=3, name=产品部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, ), Department(id=1, name=人事部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )]
    2024-03-19 11:08:59,798 INFO sqlalchemy.engine.Engine ROLLBACK
    Department(id=3, name=产品部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    Department(id=1, name=人事部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    复杂查询:
    2024-03-19 11:08:59,799 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,800 INFO sqlalchemy.engine.Engine SELECT department.id, department.name, department.status, department.create_time, department.update_time 
    FROM department 
    WHERE (department.id = %(id_1)s OR department.id = %(id_2)s) AND department.status = %(status_1)s ORDER BY department.status, department.id DESC
    2024-03-19 11:08:59,800 INFO sqlalchemy.engine.Engine [generated in 0.00011s] {'id_1': 1, 'id_2': 2, 'status_1': 0}
    [Department(id=1, name=人事部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )]
    2024-03-19 11:08:59,800 INFO sqlalchemy.engine.Engine ROLLBACK
    Department(id=1, name=人事部, status=0, create_time=2024-03-19 11:08:59, update_time=2024-03-19 11:08:59, )
    查询行数:
    2024-03-19 11:08:59,801 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,802 INFO sqlalchemy.engine.Engine SELECT count(%(count_2)s) AS count_1 
    FROM department 
    WHERE department.id >= %(id_1)s AND department.status >= %(status_1)s
    2024-03-19 11:08:59,803 INFO sqlalchemy.engine.Engine [generated in 0.00012s] {'count_2': '*', 'id_1': 0, 'status_1': 0}
    2
    2024-03-19 11:08:59,803 INFO sqlalchemy.engine.Engine ROLLBACK
    2
    关联查询-INNER JOIN:
    2024-03-19 11:08:59,804 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,805 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, employee.id AS employee_id, employee.name AS employee_name 
    FROM department INNER JOIN employee ON department.id = employee.dept_id 
    WHERE department.id > %(id_1)s ORDER BY department.id
    2024-03-19 11:08:59,805 INFO sqlalchemy.engine.Engine [generated in 0.00012s] {'id_1': 0}
    [(1, '人事部', 1, '张三'), (1, '人事部', 2, '李四'), (1, '人事部', 3, '王五')]
    2024-03-19 11:08:59,807 INFO sqlalchemy.engine.Engine ROLLBACK
    department_id: 1 department_name: 人事部 employee_id: 1 employee_name: 张三
    department_id: 1 department_name: 人事部 employee_id: 2 employee_name: 李四
    department_id: 1 department_name: 人事部 employee_id: 3 employee_name: 王五
    关联查询-LEFT OUTER JOIN:
    2024-03-19 11:08:59,808 INFO sqlalchemy.engine.Engine BEGIN (implicit)
    2024-03-19 11:08:59,809 INFO sqlalchemy.engine.Engine SELECT department.id AS department_id, department.name AS department_name, employee.id AS employee_id, employee.name AS employee_name 
    FROM department LEFT OUTER JOIN employee ON department.id = employee.dept_id 
    WHERE department.id > %(id_1)s ORDER BY department.id
    2024-03-19 11:08:59,809 INFO sqlalchemy.engine.Engine [generated in 0.00014s] {'id_1': 0}
    [(1, '人事部', 1, '张三'), (1, '人事部', 2, '李四'), (1, '人事部', 3, '王五'), (3, '产品部', None, None)]
    2024-03-19 11:08:59,810 INFO sqlalchemy.engine.Engine ROLLBACK
    department_id: 1 department_name: 人事部 employee_id: 1 employee_name: 张三
    department_id: 1 department_name: 人事部 employee_id: 2 employee_name: 李四
    department_id: 1 department_name: 人事部 employee_id: 3 employee_name: 王五
    department_id: 3 department_name: 产品部 employee_id: None employee_name: None
    

# 完