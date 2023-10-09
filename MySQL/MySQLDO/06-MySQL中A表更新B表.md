# 06-MySQL中A表更新B表

准备表：

    -- 创建表
    CREATE TABLE user (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
        username varchar(32) NOT NULL COMMENT '用户名',
        password varchar(32) NOT NULL COMMENT '用户密码',
        nickname varchar(32) NOT NULL COMMENT '用户昵称',
        telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
        status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
        create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';
    
    
    CREATE TABLE user_record (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
        user_id bigint(20) unsigned NOT NULL COMMENT '用户ID',
        username varchar(32) NOT NULL COMMENT '用户名',
        password varchar(32) NOT NULL COMMENT '用户密码',
        nickname varchar(32) NOT NULL COMMENT '用户昵称',
        telephone bigint(20) unsigned NOT NULL COMMENT '用户手机',
        status int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
        create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (id) USING BTREE,
        KEY idx_user_id (user_id) USING BTREE COMMENT '用户ID索引'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户记录';

## 用户记录表更新用户表

插入数据：

    -- 用户
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (10, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (11, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (12, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (13, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (14, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (15, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (16, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (17, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (18, 'admin', '123456', '管理员', 13800138000, 1);
    INSERT INTO user(id, username, password, nickname, telephone, status) VALUES (19, 'admin', '123456', '管理员', 13800138000, 1);
    
    -- 用户记录
    INSERT INTO user_record(user_id, username, password, nickname, telephone, status) VALUES (11, 'admin11', '123456', '管理员11', 13800138000, 1);
    INSERT INTO user_record(user_id, username, password, nickname, telephone, status) VALUES (13, 'admin13', '123456', '管理员13', 13800138000, 1);
    INSERT INTO user_record(user_id, username, password, nickname, telephone, status) VALUES (15, 'admin15', '123456', '管理员15', 13800138000, 1);
    INSERT INTO user_record(user_id, username, password, nickname, telephone, status) VALUES (17, 'admin17', '123456', '管理员17', 13800138000, 1);
    INSERT INTO user_record(user_id, username, password, nickname, telephone, status) VALUES (19, 'admin19', '123456', '管理员19', 13800138000, 1);

执行更新：

    mysql> EXPLAIN
        -> UPDATE user, user_record SET
        -> user.username = user_record.username,
        -> user.nickname = user_record.nickname
        -> WHERE user.id = user_record.user_id;
    +----+-------------+-------------+------------+--------+---------------+---------+---------+------------------------+------+----------+-------+
    | id | select_type | table       | partitions | type   | possible_keys | key     | key_len | ref                    | rows | filtered | Extra |
    +----+-------------+-------------+------------+--------+---------------+---------+---------+------------------------+------+----------+-------+
    |  1 | SIMPLE      | user_record | NULL       | ALL    | idx_user_id   | NULL    | NULL    | NULL                   |    5 |   100.00 | NULL  |
    |  1 | UPDATE      | user        | NULL       | eq_ref | PRIMARY       | PRIMARY | 8       | aa.user_record.user_id |    1 |   100.00 | NULL  |
    +----+-------------+-------------+------------+--------+---------------+---------+---------+------------------------+------+----------+-------+
    2 rows in set (0.00 sec)
    
    mysql> UPDATE user, user_record SET
        -> user.username = user_record.username,
        -> user.nickname = user_record.nickname
        -> WHERE user.id = user_record.user_id;
    Query OK, 5 rows affected (0.00 sec)
    Rows matched: 5  Changed: 5  Warnings: 0
    
    mysql> SELECT * FROM user;
    +----+----------+----------+-------------+-------------+--------+---------------------+---------------------+
    | id | username | password | nickname    | telephone   | status | create_time         | update_time         |
    +----+----------+----------+-------------+-------------+--------+---------------------+---------------------+
    | 10 | admin    | 123456   | 管理员      | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:19:08 |
    | 11 | admin11  | 123456   | 管理员11    | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:20:14 |
    | 12 | admin    | 123456   | 管理员      | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:19:08 |
    | 13 | admin13  | 123456   | 管理员13    | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:20:14 |
    | 14 | admin    | 123456   | 管理员      | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:19:08 |
    | 15 | admin15  | 123456   | 管理员15    | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:20:14 |
    | 16 | admin    | 123456   | 管理员      | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:19:08 |
    | 17 | admin17  | 123456   | 管理员17    | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:20:14 |
    | 18 | admin    | 123456   | 管理员      | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:19:08 |
    | 19 | admin19  | 123456   | 管理员19    | 13800138000 |      1 | 2023-10-09 11:19:08 | 2023-10-09 11:20:14 |
    +----+----------+----------+-------------+-------------+--------+---------------------+---------------------+
    10 rows in set (0.00 sec)


# 完
