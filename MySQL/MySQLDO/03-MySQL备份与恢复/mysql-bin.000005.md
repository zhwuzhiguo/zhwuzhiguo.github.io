    [root@centos backup]# mysqlbinlog --verbose mysql-bin.000005
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=1*/;
    /*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
    DELIMITER /*!*/;
    # at 4
    #230322 19:08:12 server id 1  end_log_pos 123 CRC32 0x6d68f936 	Start: binlog v 4, server v 5.7.41-log created 230322 19:08:12
    # Warning: this binlog is either in use or was not closed properly.
    BINLOG '
    nOEaZA8BAAAAdwAAAHsAAAABAAQANS43LjQxLWxvZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAEzgNAAgAEgAEBAQEEgAAXwAEGggAAAAICAgCAAAACgoKKioAEjQA
    ATb5aG0=
    '/*!*/;
    # at 123
    #230322 19:08:12 server id 1  end_log_pos 154 CRC32 0xb85d0c55 	Previous-GTIDs
    # [empty]
    # at 154
    #230322 19:08:48 server id 1  end_log_pos 219 CRC32 0x5fc3b68b 	Anonymous_GTID	last_committed=0	sequence_number=1	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 219
    #230322 19:08:48 server id 1  end_log_pos 301 CRC32 0xe6481d40 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679483328/*!*/;
    SET @@session.pseudo_thread_id=2/*!*/;
    SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=0, @@session.unique_checks=1, @@session.autocommit=1/*!*/;
    SET @@session.sql_mode=1436549152/*!*/;
    SET @@session.auto_increment_increment=1, @@session.auto_increment_offset=1/*!*/;
    /*!\C utf8mb4 *//*!*/;
    SET @@session.character_set_client=45,@@session.collation_connection=45,@@session.collation_server=45/*!*/;
    SET @@session.time_zone='SYSTEM'/*!*/;
    SET @@session.lc_time_names=0/*!*/;
    SET @@session.collation_database=DEFAULT/*!*/;
    BEGIN
    /*!*/;
    # at 301
    #230322 19:08:48 server id 1  end_log_pos 365 CRC32 0xde2913d3 	Table_map: `sample`.`user` mapped to number 111
    # at 365
    #230322 19:08:48 server id 1  end_log_pos 459 CRC32 0xf9039379 	Write_rows: table id 111 flags: STMT_END_F
    
    BINLOG '
    wOEaZBMBAAAAQAAAAG0BAAAAAG8AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAA0xMp3g==
    wOEaZB4BAAAAXgAAAMsBAAAAAG8AAAAAAAEAAgAI/wAIAAAAAAAAAAZiYmJiYjMGMTIzNDU2DeWi
    numHj+eUqOaItzNOCGYlAwAAAAAAAACZr60yMJmvrTIweZMD+Q==
    '/*!*/;
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=8
    ###   @2='bbbbb3'
    ###   @3='123456'
    ###   @4='增量用户3'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 19:08:48'
    ###   @8='2023-03-22 19:08:48'
    # at 459
    #230322 19:08:48 server id 1  end_log_pos 490 CRC32 0x609faa06 	Xid = 71
    COMMIT/*!*/;
    # at 490
    #230322 19:08:56 server id 1  end_log_pos 555 CRC32 0xf6dd1554 	Anonymous_GTID	last_committed=1	sequence_number=2	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 555
    #230322 19:08:56 server id 1  end_log_pos 637 CRC32 0x1a33cc4a 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679483336/*!*/;
    BEGIN
    /*!*/;
    # at 637
    #230322 19:08:56 server id 1  end_log_pos 701 CRC32 0xc9b597f3 	Table_map: `sample`.`user` mapped to number 111
    # at 701
    #230322 19:08:56 server id 1  end_log_pos 795 CRC32 0x62c3df6f 	Write_rows: table id 111 flags: STMT_END_F
    
    BINLOG '
    yOEaZBMBAAAAQAAAAL0CAAAAAG8AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAA85e1yQ==
    yOEaZB4BAAAAXgAAABsDAAAAAG8AAAAAAAEAAgAI/wAJAAAAAAAAAAZiYmJiYjQGMTIzNDU2DeWi
    numHj+eUqOaItzROCGYlAwAAAAAAAACZr60yOJmvrTI4b9/DYg==
    '/*!*/;
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=9
    ###   @2='bbbbb4'
    ###   @3='123456'
    ###   @4='增量用户4'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 19:08:56'
    ###   @8='2023-03-22 19:08:56'
    # at 795
    #230322 19:08:56 server id 1  end_log_pos 826 CRC32 0xbf19ff14 	Xid = 72
    COMMIT/*!*/;
    # at 826
    #230322 19:09:04 server id 1  end_log_pos 891 CRC32 0x9220c7d8 	Anonymous_GTID	last_committed=2	sequence_number=3	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 891
    #230322 19:09:04 server id 1  end_log_pos 973 CRC32 0xc1980f77 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679483344/*!*/;
    BEGIN
    /*!*/;
    # at 973
    #230322 19:09:04 server id 1  end_log_pos 1037 CRC32 0x5849c608 	Table_map: `sample`.`user` mapped to number 111
    # at 1037
    #230322 19:09:04 server id 1  end_log_pos 1131 CRC32 0x46c1636e 	Write_rows: table id 111 flags: STMT_END_F
    
    BINLOG '
    0OEaZBMBAAAAQAAAAA0EAAAAAG8AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAACMZJWA==
    0OEaZB4BAAAAXgAAAGsEAAAAAG8AAAAAAAEAAgAI/wAKAAAAAAAAAAZiYmJiYjUGMTIzNDU2DeWi
    numHj+eUqOaItzVOCGYlAwAAAAAAAACZr60yRJmvrTJEbmPBRg==
    '/*!*/;
    ### INSERT INTO `sample`.`user`
    ### SET
    ###   @1=10
    ###   @2='bbbbb5'
    ###   @3='123456'
    ###   @4='增量用户5'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 19:09:04'
    ###   @8='2023-03-22 19:09:04'
    # at 1131
    #230322 19:09:04 server id 1  end_log_pos 1162 CRC32 0xba932f5b 	Xid = 73
    COMMIT/*!*/;
    # at 1162
    #230322 19:10:07 server id 1  end_log_pos 1227 CRC32 0x7a1d96a8 	Anonymous_GTID	last_committed=3	sequence_number=4	rbr_only=yes
    /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 1227
    #230322 19:10:07 server id 1  end_log_pos 1309 CRC32 0x2af578b0 	Query	thread_id=2	exec_time=0	error_code=0
    SET TIMESTAMP=1679483407/*!*/;
    BEGIN
    /*!*/;
    # at 1309
    #230322 19:10:07 server id 1  end_log_pos 1373 CRC32 0x6ed58795 	Table_map: `sample`.`user` mapped to number 111
    # at 1373
    #230322 19:10:07 server id 1  end_log_pos 1527 CRC32 0x7fb44f63 	Update_rows: table id 111 flags: STMT_END_F
    
    BINLOG '
    D+IaZBMBAAAAQAAAAF0FAAAAAG8AAAAAAAEABnNhbXBsZQAEdXNlcgAICA8PDwgDEhIIgACAAIAA
    AAAAlYfVbg==
    D+IaZB8BAAAAmgAAAPcFAAAAAG8AAAAAAAEAAgAI//8AAQAAAAAAAAAGYWFhYWExBjEyMzQ1Ng3l
    hajph4/nlKjmiLcxTghmJQMAAAAAAAAAma+tKkWZr60qRQABAAAAAAAAAAZhYWFhYTEGeHh4eHh4
    DeWFqOmHj+eUqOaItzFOCGYlAwAAAAAAAACZr60qRZmvrTKHY0+0fw==
    '/*!*/;
    ### UPDATE `sample`.`user`
    ### WHERE
    ###   @1=1
    ###   @2='aaaaa1'
    ###   @3='123456'
    ###   @4='全量用户1'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 18:41:05'
    ### SET
    ###   @1=1
    ###   @2='aaaaa1'
    ###   @3='xxxxxx'
    ###   @4='全量用户1'
    ###   @5=13512345678
    ###   @6=0
    ###   @7='2023-03-22 18:41:05'
    ###   @8='2023-03-22 19:10:07'
    # at 1527
    #230322 19:10:07 server id 1  end_log_pos 1558 CRC32 0x1b95f28f 	Xid = 74
    COMMIT/*!*/;
    # at 1558
    #230322 19:10:41 server id 1  end_log_pos 1623 CRC32 0xcb527c82 	Anonymous_GTID	last_committed=4	sequence_number=5	rbr_only=no
    SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
    # at 1623
    #230322 19:10:41 server id 1  end_log_pos 1705 CRC32 0x53e22053 	Query	thread_id=2	exec_time=0	error_code=0
    use `sample`/*!*/;
    SET TIMESTAMP=1679483441/*!*/;
    truncate user
    /*!*/;
    SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
    DELIMITER ;
    # End of log file
    /*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=0*/;
    [root@centos backup]#