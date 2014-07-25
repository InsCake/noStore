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
-- Table structure for table `commodity`
--

DROP TABLE IF EXISTS `commodity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commodity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `subtitle` varchar(45) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `ori_price` varchar(45) DEFAULT NULL,
  `time_pub` varchar(45) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `position` varchar(45) DEFAULT NULL,
  `detail_info` mediumtext,
  `pic_urls` text,
  `category` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `visit` int(11) DEFAULT '0',
  PRIMARY KEY (`id`,`seller_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_commodity_seller_idx` (`seller_id`),
  CONSTRAINT `fk_commodity_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commodity`
--

LOCK TABLES `commodity` WRITE;
/*!40000 ALTER TABLE `commodity` DISABLE KEYS */;
INSERT INTO `commodity` VALUES (1,'iphone 5s','全新带包装 苹果iPhone5S移动版 64GB 比iPhone 5所用A6芯片快两倍',3998,NULL,'2013-12-23 12:23',1,'天津工业大学','iPhone5s是美国苹果公司在2013年9月推出的一款手机。在9月20日于12国家以及地区首发iPhone 5s，首次包括中国大陆，首周销量突破900万部。2013年底，美国知名科技媒体《商业内幕》整理出了“本年度最具创新力的十大设备”，iPhone 5s因指纹识别功能而被入选其中。','/images/5s1.jpg;/images/5s2.jpg;/images/5s3.jpg;/images/5s4.jpg;/images/5s5.jpg;/images/5s6.jpg;','手机','refused',1135),(2,'MacBook Pro','15寸 95新哦',10999,NULL,'2013-12-23 12:29',1,'天津工业大学','信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息','/images/rmbp1.jpg;/images/rmbp2.jpg;/images/rmbp3.jpg;','电脑','refused',905),(3,'徕卡M9','全新带包装 3折出公司福利5.3寸大屏双卡双待手机大屏双卡双待手机',8888,NULL,'2013-12-23 12:44',2,'天津工业大学','信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息','/images/m9.jpg;','相机','refused',0),(4,'Smartisan T1','预售 黑色 数量有限',3000,NULL,'2014-5-20',1,'天津大学','“锤子手机”是指由锤子科技（北京）有限公司设计与研发的一款高端智能手机。采用基于 Android定制的 Smartisan OS 智能手机操作系统。','/images/t1.jpg;/images/t2.jpg;/images/t3.jpg;/images/t4.jpg;','手机','new',10050),(19,'徕卡X2','钛金版 一口价',150000,NULL,'2014-6-6 15:51',1,'天津财经大学','徕卡X2搭载1600万像素APS-C格式CMOS传感器，等效焦距36mm f/2.8定焦镜头，2.7\" 23万像素LCD屏幕，感光度ISO 100 - 12500，支持RAW格式，配备外置电子取景器(EVF)和手柄，支持SD/SDHC卡，外观尺寸124×69×52mm，工作重量345g。徕卡X2是X1的升级版。其最大变化就是那块1620万有效像素的CMOS传感器，以及配置了一款外置144万像素“Viso-Flex”EVF。 ','/images/upload/4617-hqxmmx.png;/images/upload/4617-1khszbl.jpg;/images/upload/4617-wceyf2.jpg;/images/upload/4617-5d5w6n.jpg;/images/upload/4617-1vxz96k.jpg;','相机','new',987),(20,'iPad Air','16G/Wifi版 99新',2999,NULL,'2014-6-6 16:13',1,'天津财经大学','iPad Air首发即搭载运行2013年9月20日发布下载的iOS 7[8]。为iOS 7带来新元素设计的总设计师乔纳森·埃维，将此次升级描述为“给复杂操作带来秩序”，以精致的排版、全新的图标、半透明特性、层次感、物理效果以及以陀螺仪驱动的视差效果等一些重大的变化来突出设计特色[9]。iOS 7和OS X Mavericks（版本10.9）中的设计风格明显与以往版本系统诸如在游戏中心中的绿色毛毡、书报亭应用中的木纹设计和日历应用中所使用的皮革质感等的“拟物化”设计风格相偏离，而采用扁平化设计风格[9]。iOS 7增加了新的男性和女性的语音提示音、新的系统设置功能、配合操作系统的其他部分进行的全面重新设计，集成Twitter、维基百科、必应和Photos[10]。','/images/upload/4617-oge88q.jpg;/images/upload/4617-zcei2a.jpg;/images/upload/4617-1exjl08.jpg;/images/upload/4617-k39agk.jpg;','平板','refused',778),(21,'Kindle Paperwhite WIFI','88新 低价出售',666,NULL,'2014-6-6 16:20',1,'天津大学','Kindle Paperwhite，是由亚马逊发布的新款电子书产品，该产品首次采用了Paperwhite技术显示屏，提供高于旧款25%的对比度以及62%像素点。产品起始售价为119美元。Kindle paperwhite分为Wi-Fi版和3G版两个型号，前者售价为119美元，后者为179美元。2012年10月1日正式发售。','/images/upload/4617-1tcsxp8.jpg;/images/upload/4617-7tcorc.jpg;','平板','new',0),(22,'Jawbone Up2手环','未拆分 超炫酷 亮瞎周围小伙伴',699,NULL,'2014-6-6 16:32',1,'天津工业大学','该款可以跟踪用户的日常活动、睡眠情况和饮食习惯等数据的腕带设备由著名的蓝牙耳机和扬声器厂商Jawbone发布，最早在2011年上市后因为蓄电问题受到了消费者和各界媒体的一致批评，以致公司不得不在产品发售一个月后就将其撤下，并向所有购买用户提供了无条件退款服务，且无需返还腕带… 故事当然没有就这样结束，Jawbone经过一年的研发和完善，在2012年重又祭出了UP 2G版本，全新的设计和实用的理念提供了更好的体验，发售价格$129.9。国行版预计今年4月份上市，国行参考价格1000人民币。[1]','/images/upload/4617-1cbxii.jpg;/images/upload/4617-1pio5w3.jpg;/images/upload/4617-1vdu1sv.jpg;','智能穿戴','new',0),(24,'asdasda ','asdasd',1231,NULL,'2014-6-7 8:51',1,'天津大学','asdasd','/images/upload/6207-tdazoc.jpg;/images/upload/6207-1til5k0.png;','手机','new',0);
/*!40000 ALTER TABLE `commodity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-06-11 21:45:59
