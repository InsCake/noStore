CREATE DATABASE  IF NOT EXISTS `nostore` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `nostore`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 127.0.0.1    Database: nostore
-- ------------------------------------------------------
-- Server version	5.6.16

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
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `step` varchar(45) NOT NULL,
  `address` tinytext NOT NULL,
  `total_price` int(11) NOT NULL,
  `pay_method` varchar(45) NOT NULL,
  `time` varchar(45) NOT NULL,
  `message` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7164 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (7159,'s9_订单完成','不一/上海市上海市浦东新区(外环内) 祖冲之路295号（1号店大楼），1383828123',3998,'账号余额','2014-6-7 0:7',NULL),(7160,'s5_申请仲裁','不一/上海市上海市浦东新区(外环内) 祖冲之路295号（1号店大楼），1383828123',2999,'账号余额','2014-6-7 0:29',NULL),(7161,'s6_买家收货','不一/上海市上海市浦东新区(外环内) 祖冲之路295号（1号店大楼），1383828123',666,'账号余额','2014-6-7 0:31',NULL),(7162,'s1_等待卖家发货','不一/上海市上海市浦东新区(外环内) 祖冲之路295号（1号店大楼），1383828123',8888,'账号余额','2014-6-7 0:37',NULL),(7163,'s1_等待卖家发货','不一/上海市上海市浦东新区(外环内) 祖冲之路295号（1号店大楼），1383828123',14997,'账号余额','2014-6-7 8:48',NULL);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-06-11 21:46:00
