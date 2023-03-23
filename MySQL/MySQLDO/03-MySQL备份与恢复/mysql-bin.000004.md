    [root@centos backup]# mysqlbinlog --verbose mysql-bin.000004
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=1*/;
    /*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
    DELIMITER /*!*/;
    # at 4
    #230322 18:44:17 server id 1  end_log_pos 123 CRC32 0x0f3d955d 	Start: binlog v 4, server v 5.7.41-log created 230322 18:44:17
    BINLOG '
    AdwaZA8BAAAAdwAAAHsAAAAAAAQANS43LjQxLWxvZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAEzgNAAgAEgAEBAQEEgAAXwAEGggAAAAICAgCAAAACgoKKioAEjQA
    AV2VPQ8=
    '/*!*/;
    # at 123
    #230322 18:44:17 server id 1  end_log_pos 154 CRC32 0x0877a7d9 	Previous-GTIDs
    # [empty]
    # at 154
    #230322 18:54:11 server id 1  end_log_pos 219 CRC32 0x9588d3a9 	Anonymous_GTID	last_committed=0	sequence_number=1	rbr_only=no
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 219
    #230322 18:54:11 server id 1  end_log_pos 313 CRC32 0x566b1061 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679482451/*!*/;
    SET @@session.pseudo_thread_id=2/*!*/;
    SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=0, @@session.unique_checks=1, @@session.autocommit=1/*!*/;
    SET @@session.sql_mode=1436549152/*!*/;
    SET @@session.auto_increment_increment=1, @@session.auto_increment_offset=1/*!*/;
    /*!\C utf8mb4 *//*!*/;
    SET @@session.character_set_client=45,@@session.collation_connection=45,@@session.collation_server=45/*!*/;
    SET @@session.lc_time_names=0/*!*/;
    SET @@session.collation_database=DEFAULT/*!*/;
    create database temp
    /*!*/;
    # at 313
    #230322 18:56:25 server id 1  end_log_pos 378 CRC32 0xc8999d17 	Anonymous_GTID	last_committed=1	sequence_number=2	rbr_only=no
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 378
    #230322 18:56:25 server id 1  end_log_pos 1277 CRC32 0xc9ebcbf1 	Query	thread_id=2	exec_time=0	error_code=0
    use `temp`/*!*/;
    SET TIMESTAMP=1679482585/*!*/;
    CREATE TABLE employee (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工'
    /*!*/;
    # at 1277
    #230322 18:57:37 server id 1  end_log_pos 1342 CRC32 0xd308e1a5 	Anonymous_GTID	last_committed=2	sequence_number=3	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 1342
    #230322 18:57:37 server id 1  end_log_pos 1422 CRC32 0xb3c98060 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679482657/*!*/;
    SET @@session.time_zone='SYSTEM'/*!*/;
    BEGIN
    /*!*/;
    # at 1422
    #230322 18:57:37 server id 1  end_log_pos 1488 CRC32 0x949612a9 	Table_map: `temp`.`employee` mapped to number 112
    # at 1488
    #230322 18:57:37 server id 1  end_log_pos 1682 CRC32 0x7e6f35dd 	Write_rows: table id 112 flags: STMT_END_F
    
    BINLOG '
    Id8aZBMBAAAAQgAAANAFAAAAAHAAAAAAAAEABHRlbXAACGVtcGxveWVlAAgIDw8PCAMSEgiAAIAA
    gAAAAACpEpaU
    Id8aZB4BAAAAwgAAAJIGAAAAAHAAAAAAAAEAAgAI/wABAAAAAAAAAAZlZWVlZTEGMTIzNDU2B+WR
    mOW3pTFOCGYlAwAAAAAAAACZr60uZZmvrS5lAAIAAAAAAAAABmVlZWVlMgYxMjM0NTYH5ZGY5bel
    Mk4IZiUDAAAAAAAAAJmvrS5lma+tLmUAAwAAAAAAAAAGZWVlZWUzBjEyMzQ1NgflkZjlt6UzTghm
    JQMAAAAAAAAAma+tLmWZr60uZd01b34=
    '/*!*/;
    ### INSERT INTO `temp`.`employee`
    ### SET
    ###   @1=1
    ###   @2='eeeee1'
    ###   @3='123456'
    ###   @4='员工1'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:57:37'
    ###   @8='2023-03-22 18:57:37'
    ### INSERT INTO `temp`.`employee`
    ### SET
    ###   @1=2
    ###   @2='eeeee2'
    ###   @3='123456'
    ###   @4='员工2'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:57:37'
    ###   @8='2023-03-22 18:57:37'
    ### INSERT INTO `temp`.`employee`
    ### SET
    ###   @1=3
    ###   @2='eeeee3'
    ###   @3='123456'
    ###   @4='员工3'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:57:37'
    ###   @8='2023-03-22 18:57:37'
    # at 1682
    #230322 18:57:37 server id 1  end_log_pos 1713 CRC32 0x780f60ef 	Xid = 55
    COMMIT/*!*/;
    # at 1713
    #230322 19:04:45 server id 1  end_log_pos 1778 CRC32 0x81e8ab8c 	Anonymous_GTID	last_committed=3	sequence_number=4	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 1778
    #230322 19:04:45 server id 1  end_log_pos 1860 CRC32 0x40559546 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679483085/*!*/;
    BEGIN
    /*!*/;
    # at 1860
    #230322 19:04:45 server id 1  end_log_pos 1924 CRC32 0x5b257e5d 	Table_map: `sample`.`user` mapped to number 111
    # at 1924
    #230322 19:04:45 server id 1  end_log_pos 2018 CRC32 0x71dffa8d 	Write_rows: table id 111 flags: STMT_END_F
    
    BINLOG '
    zeAaZBMBAAAAQAAAAIQHAAAAAG8AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAAXX4lWw==
    zeAaZB4BAAAAXgAAAOIHAAAAAG8AAAAAAAEAAgAI/wAGAAAAAAAAAAZiYmJiYjEGMTIzNDU2DeWi
    numHj+eUqOaItzFOCGYlAwAAAAAAAACZr60xLZmvrTEtjfrfcQ==
    '/*!*/;
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=6
    ###   @2='bbbbb1'
    ###   @3='123456'
    ###   @4='增量用户1'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 19:04:45'
    ###   @8='2023-03-22 19:04:45'
    # at 2018
    #230322 19:04:45 server id 1  end_log_pos 2049 CRC32 0x870bf2c8 	Xid = 64
    COMMIT/*!*/;
    # at 2049
    #230322 19:05:07 server id 1  end_log_pos 2114 CRC32 0xb8f12296 	Anonymous_GTID	last_committed=4	sequence_number=5	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 2114
    #230322 19:05:07 server id 1  end_log_pos 2196 CRC32 0xeb7c4071 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679483107/*!*/;
    BEGIN
    /*!*/;
    # at 2196
    #230322 19:05:07 server id 1  end_log_pos 2260 CRC32 0x17218114 	Table_map: `sample`.`user` mapped to number 111
    # at 2260
    #230322 19:05:07 server id 1  end_log_pos 2354 CRC32 0x72cf3e98 	Write_rows: table id 111 flags: STMT_END_F
    
    BINLOG '
    4+AaZBMBAAAAQAAAANQIAAAAAG8AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAAFIEhFw==
    4+AaZB4BAAAAXgAAADIJAAAAAG8AAAAAAAEAAgAI/wAHAAAAAAAAAAZiYmJiYjIGMTIzNDU2DeWi
    numHj+eUqOaItzJOCGYlAwAAAAAAAACZr60xR5mvrTFHmD7Pcg==
    '/*!*/;
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=7
    ###   @2='bbbbb2'
    ###   @3='123456'
    ###   @4='增量用户2'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 19:05:07'
    ###   @8='2023-03-22 19:05:07'
    # at 2354
    #230322 19:05:07 server id 1  end_log_pos 2385 CRC32 0x730e3da9 	Xid = 65
    COMMIT/*!*/;
    # at 2385
    #230322 19:08:12 server id 1  end_log_pos 2432 CRC32 0xdd5328a1 	Rotate to mysql-bin.000005  pos: 4
    SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
    DELIMITER ;
    # End of log file
    /*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=0*/;
    [root@centos backup]#