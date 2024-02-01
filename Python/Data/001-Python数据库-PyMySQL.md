# 001-Python数据库-PyMySQL

## main.py

```python
import pymysql as db
import pymysql.cursors as cursors

# 连接数据库
# cursorclass:
# Cursor - 查询返回记录是元组(默认)
# DictCursor - 查询返回记录是字典
connection = db.connect(host='localhost',
                        port=3306,
                        user='root',
                        password='123456',
                        database='test',
                        charset='utf8mb4',
                        cursorclass=cursors.DictCursor)

with connection:
    try:
        # 更新
        with connection.cursor() as cursor:
            # 插入
            insert_sql = "INSERT INTO user(username, password, nickname, telephone) VALUES (%s, %s, %s, %s)"
            insert_one_result = cursor.execute(insert_sql, ('admin1', '123456', '管理员1', 13800000001))
            insert_many_result = cursor.executemany(insert_sql, (
                ('admin2', '123456', '管理员2', 13800000002),
                ('admin3', '123456', '管理员3', 13800000003),
                ('admin4', '123456', '管理员4', 13800000004),
                ('admin5', '123456', '管理员5', 13800000005)))

            print("insert_one_result:", insert_one_result)
            print("insert_many_result:", insert_many_result)

            # 更新
            update_sql = "UPDATE user SET password = %s WHERE id = %s"
            update_result = cursor.execute(update_sql, ('abcdefg', 4))
            print("update_result:", update_result)

            # 删除
            delete_sql = "DELETE FROM user WHERE id = %s"
            delete_result = cursor.execute(delete_sql, (5,))
            print("delete_result:", delete_result)

            # 提交
            connection.commit()
            print("commit..")

    except db.Error as e:
        # 回滚
        connection.rollback()
        print("rollback..")
        raise e

    # 查询单条
    with connection.cursor() as cursor:
        select_one_sql = "SELECT * FROM user where id = %s"
        select_one_result = cursor.execute(select_one_sql, (1,))
        select_one_record = cursor.fetchone()
        print("select_one_result:", select_one_result)
        print("select_one_record:", select_one_record)

    # 查询多条
    with connection.cursor() as cursor:
        select_many_sql = "SELECT * FROM user where id > %s"
        select_many_result = cursor.execute(select_many_sql, (0,))
        select_many_record = cursor.fetchmany(2)
        print("select_many_result:", select_many_result)
        print("select_many_record:", select_many_record)

    # 查询全部
    with connection.cursor() as cursor:
        select_all_sql = "SELECT * FROM user where id > %s"
        select_all_result = cursor.execute(select_all_sql, (0,))
        select_all_record = cursor.fetchall()
        print("select_all_result:", select_all_result)
        print("select_all_record:", select_all_record)

```

## 运行程序

查询返回记录是元组(默认):

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    insert_one_result: 1
    insert_many_result: 4
    update_result: 1
    delete_result: 1
    commit..
    select_one_result: 1
    select_one_record: (1, 'admin1', '123456', '管理员1', 13800000001, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44))
    select_many_result: 4
    select_many_record: ((1, 'admin1', '123456', '管理员1', 13800000001, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44)), (2, 'admin2', '123456', '管理员2', 13800000002, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44)))
    select_all_result: 4
    select_all_record: ((1, 'admin1', '123456', '管理员1', 13800000001, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44)), (2, 'admin2', '123456', '管理员2', 13800000002, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44)), (3, 'admin3', '123456', '管理员3', 13800000003, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44)), (4, 'admin4', 'abcdefg', '管理员4', 13800000004, 0, datetime.datetime(2024, 2, 1, 18, 42, 44), datetime.datetime(2024, 2, 1, 18, 42, 44)))

查询返回记录是字典:

    /Users/wuzhiguo/py/pydemo/.venv/bin/python /Users/wuzhiguo/py/pydemo/main.py 
    insert_one_result: 1
    insert_many_result: 4
    update_result: 1
    delete_result: 1
    commit..
    select_one_result: 1
    select_one_record: {'id': 1, 'username': 'admin1', 'password': '123456', 'nickname': '管理员1', 'telephone': 13800000001, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}
    select_many_result: 4
    select_many_record: [{'id': 1, 'username': 'admin1', 'password': '123456', 'nickname': '管理员1', 'telephone': 13800000001, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}, {'id': 2, 'username': 'admin2', 'password': '123456', 'nickname': '管理员2', 'telephone': 13800000002, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}]
    select_all_result: 4
    select_all_record: [{'id': 1, 'username': 'admin1', 'password': '123456', 'nickname': '管理员1', 'telephone': 13800000001, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}, {'id': 2, 'username': 'admin2', 'password': '123456', 'nickname': '管理员2', 'telephone': 13800000002, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}, {'id': 3, 'username': 'admin3', 'password': '123456', 'nickname': '管理员3', 'telephone': 13800000003, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}, {'id': 4, 'username': 'admin4', 'password': 'abcdefg', 'nickname': '管理员4', 'telephone': 13800000004, 'status': 0, 'create_time': datetime.datetime(2024, 2, 1, 18, 43, 35), 'update_time': datetime.datetime(2024, 2, 1, 18, 43, 35)}]


# 完