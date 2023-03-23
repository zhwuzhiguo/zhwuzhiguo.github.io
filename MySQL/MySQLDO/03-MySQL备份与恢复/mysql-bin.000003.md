    [root@centos backup]# mysqlbinlog --verbose mysql-bin.000003
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=1*/;
    /*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
    DELIMITER /*!*/;
    # at 4
    #230322 18:30:29 server id 1  end_log_pos 123 CRC32 0xe7de2d3c 	Start: binlog v 4, server v 5.7.41-log created 230322 18:30:29 at startup
    ROLLBACK/*!*/;
    BINLOG '
    xdgaZA8BAAAAdwAAAHsAAAAAAAQANS43LjQxLWxvZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAADF2BpkEzgNAAgAEgAEBAQEEgAAXwAEGggAAAAICAgCAAAACgoKKioAEjQA
    ATwt3uc=
    '/*!*/;
    # at 123
    #230322 18:30:29 server id 1  end_log_pos 154 CRC32 0x7f37a13c 	Previous-GTIDs
    # [empty]
    # at 154
    #230322 18:39:34 server id 1  end_log_pos 219 CRC32 0xd93c87af 	Anonymous_GTID	last_committed=0	sequence_number=1	rbr_only=no
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 219
    #230322 18:39:34 server id 1  end_log_pos 319 CRC32 0x32d06214 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679481574/*!*/;
    SET @@session.pseudo_thread_id=2/*!*/;
    SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=0, @@session.unique_checks=1, @@session.autocommit=1/*!*/;
    SET @@session.sql_mode=1436549152/*!*/;
    SET @@session.auto_increment_increment=1, @@session.auto_increment_offset=1/*!*/;
    /*!\C utf8mb4 *//*!*/;
    SET @@session.character_set_client=45,@@session.collation_connection=45,@@session.collation_server=45/*!*/;
    SET @@session.lc_time_names=0/*!*/;
    SET @@session.collation_database=DEFAULT/*!*/;
    create database sample
    /*!*/;
    # at 319
    #230322 18:40:17 server id 1  end_log_pos 384 CRC32 0xa871da2c 	Anonymous_GTID	last_committed=1	sequence_number=2	rbr_only=no
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 384
    #230322 18:40:17 server id 1  end_log_pos 1283 CRC32 0xcb107bbd 	Query	thread_id=2	exec_time=0	error_code=0
    use `sample`/*!*/;
    SET TIMESTAMP=1679481617/*!*/;
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
      KEY idx_status (status) USING BTREE COMMENT '用户状态索引'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户'
    /*!*/;
    # at 1283
    #230322 18:41:05 server id 1  end_log_pos 1348 CRC32 0xc93e9c37 	Anonymous_GTID	last_committed=2	sequence_number=3	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 1348
    #230322 18:41:05 server id 1  end_log_pos 1430 CRC32 0x61c87923 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679481665/*!*/;
    SET @@session.time_zone='SYSTEM'/*!*/;
    BEGIN
    /*!*/;
    # at 1430
    #230322 18:41:05 server id 1  end_log_pos 1494 CRC32 0x5dfb444e 	Table_map: `sample`.`user` mapped to number 109
    # at 1494
    #230322 18:41:05 server id 1  end_log_pos 1824 CRC32 0xe18765a9 	Write_rows: table id 109 flags: STMT_END_F
    
    BINLOG '
    QdsaZBMBAAAAQAAAANYFAAAAAG0AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAATkT7XQ==
    QdsaZB4BAAAASgEAACAHAAAAAG0AAAAAAAEAAgAI/wABAAAAAAAAAAZhYWFhYTEGMTIzNDU2DeWF
    qOmHj+eUqOaItzFOCGYlAwAAAAAAAACZr60qRZmvrSpFAAIAAAAAAAAABmFhYWFhMgYxMjM0NTYN
    5YWo6YeP55So5oi3Mk4IZiUDAAAAAAAAAJmvrSpFma+tKkUAAwAAAAAAAAAGYWFhYWEzBjEyMzQ1
    Ng3lhajph4/nlKjmiLczTghmJQMAAAAAAAAAma+tKkWZr60qRQAEAAAAAAAAAAZhYWFhYTQGMTIz
    NDU2DeWFqOmHj+eUqOaItzROCGYlAwAAAAAAAACZr60qRZmvrSpFAAUAAAAAAAAABmFhYWFhNQYx
    MjM0NTYN5YWo6YeP55So5oi3NU4IZiUDAAAAAAAAAJmvrSpFma+tKkWpZYfh
    '/*!*/;
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=1
    ###   @2='aaaaa1'
    ###   @3='123456'
    ###   @4='全量用户1'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 18:41:05'
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=2
    ###   @2='aaaaa2'
    ###   @3='123456'
    ###   @4='全量用户2'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 18:41:05'
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=3
    ###   @2='aaaaa3'
    ###   @3='123456'
    ###   @4='全量用户3'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 18:41:05'
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=4
    ###   @2='aaaaa4'
    ###   @3='123456'
    ###   @4='全量用户4'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 18:41:05'
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=5
    ###   @2='aaaaa5'
    ###   @3='123456'
    ###   @4='全量用户5'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 18:41:05'
    # at 1824
    #230322 18:41:05 server id 1  end_log_pos 1855 CRC32 0xc7672ec5 	Xid = 10
    COMMIT/*!*/;
    # at 1855
    #230322 18:44:17 server id 1  end_log_pos 1902 CRC32 0xb76e077e 	Rotate to mysql-bin.000004  pos: 4
    SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
    DELIMITER ;
    # End of log file
    /*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=0*/;
    [root@centos backup]#