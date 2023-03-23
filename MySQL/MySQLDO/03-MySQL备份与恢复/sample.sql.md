    -- MySQL dump 10.13  Distrib 5.7.37, for Linux (x86_64)
    --
    -- Host: 127.0.0.1    Database: sample
    -- ------------------------------------------------------
    -- Server version	5.7.41-log
    
    /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
    /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
    /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
    /*!40101 SET NAMES utf8 */;
    /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
    /*!40103 SET TIME_ZONE='+00:00' */;
    /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
    /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
    /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
    /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
    
    --
    -- Position to start replication or point-in-time recovery from
    --
    
    -- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000004', MASTER_LOG_POS=154;
    
    --
    -- Current Database: `sample`
    --
    
    CREATE DATABASE /*!32312 IF NOT EXISTS*/ `sample` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
    
    USE `sample`;
    
    --
    -- Table structure for table `user`
    --
    
    DROP TABLE IF EXISTS `user`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `user` (
      `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
      `username` varchar(32) NOT NULL COMMENT '用户名',
      `password` varchar(32) NOT NULL COMMENT '用户密码',
      `nickname` varchar(32) NOT NULL COMMENT '用户昵称',
      `telephone` bigint(20) unsigned NOT NULL COMMENT '用户手机',
      `status` int(20) NOT NULL DEFAULT '0' COMMENT '用户状态 0-正常 1-禁用',
      `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (`id`) USING BTREE,
      UNIQUE KEY `uk_username` (`username`) USING BTREE COMMENT '用户名唯一索引',
      KEY `idx_status` (`status`) USING BTREE COMMENT '用户状态索引'
    ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='用户';
    /*!40101 SET character_set_client = @saved_cs_client */;
    
    --
    -- Dumping data for table `user`
    --
    
    LOCK TABLES `user` WRITE;
    /*!40000 ALTER TABLE `user` DISABLE KEYS */;
    INSERT INTO `user` VALUES (1,'aaaaa1','123456','全量用户1',13512345678,0,'2023-03-22 18:41:05','2023-03-22 18:41:05'),(2,'aaaaa2','123456','全量用户2',13512345678,0,'2023-03-22 18:41:05','2023-03-22 18:41:05'),(3,'aaaaa3','123456','全量用户3',13512345678,0,'2023-03-22 18:41:05','2023-03-22 18:41:05'),(4,'aaaaa4','123456','全量用户4',13512345678,0,'2023-03-22 18:41:05','2023-03-22 18:41:05'),(5,'aaaaa5','123456','全量用户5',13512345678,0,'2023-03-22 18:41:05','2023-03-22 18:41:05');
    /*!40000 ALTER TABLE `user` ENABLE KEYS */;
    UNLOCK TABLES;
    /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
    
    /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
    /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
    /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
    /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
    /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
    /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
    /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
    
    -- Dump completed on 2023-03-22 18:44:17
    