CREATE DATABASE  IF NOT EXISTS `libraries` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `libraries`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: libraries
-- ------------------------------------------------------
-- Server version	5.7.17

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
-- Table structure for table `entityversion`
--

DROP TABLE IF EXISTS `entityversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entityversion` (
  `entityversion_id` varchar(45) NOT NULL,
  `__version` int(11) NOT NULL,
  PRIMARY KEY (`entityversion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entityversion`
--

LOCK TABLES `entityversion` WRITE;
/*!40000 ALTER TABLE `entityversion` DISABLE KEYS */;
/*!40000 ALTER TABLE `entityversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(45) NOT NULL,
  `client_description` varchar(45) DEFAULT NULL,
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  `__version` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `client_name_UNIQUE` (`client_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Mandant-1','Test für Mandantenfähigkeit (1)', 0, 0);
INSERT INTO `client` VALUES (2,'Mandant-2','Test für Mandantenfähigkeit (2)', 0, 0);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `role_description` varchar(256) CHARACTER SET utf8 DEFAULT NULL,
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name_UNIQUE` (`role_name`),
  KEY `role_name_INDEX` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES
  (1,'admin','starter Administrator',0,1,0),
  (2,'user','starter Benutzer',0,1,0),
  (3,'guest','Externer Benutzer',0,1,0);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_firstname` varchar(45) DEFAULT NULL,
  `user_lastname` varchar(45) DEFAULT NULL,
  `user_username` varchar(45) NOT NULL,
  `user_email` varchar(45) NOT NULL,
  `user_password` varchar(256) NOT NULL,
  `user_password_salt` varchar(45) NOT NULL,
  `id_role` int(11) NOT NULL,
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`user_username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
  (1,'admin-firstname','admin-lastname','admin','admin@mail.com','8b2e1d35f095db1542e5f17b54f8cc9e8cbe4f9a90806fd9fbeb2318416b60ba2ae93a3e888cb128eeb7ef0eb78fa53748ac764baa163f67e3ec49b7add48defa6b0c5fffc7f9abb5278e3c06a8be4337b7ecbfd7fa6bfd4d373f7a9fea343537effc050e527e1ab854cbf96f66cc56e8da9aa5e326d917ce07c9a7c6ae284ca','n3pe97n4iW',1,0,1,0),
  (2,'tester-firstname','tester-lastname','tester','tester@mail.com','ff3d50632673e58f5cc04afd479aef2696658e1dfda78f3ad6bb1427143ca834eb8231a02fecc9c408c7b53fe830951558c18e8ace69a6d7b42994119f55167337ecd041e65524aa2302a03ed0e70a0dffc88dd769054ddcc9ffa5ef7cbdc5559eb86786682d0c774ea610f20fa0bd0ccf6a547515b474a7cbcc0d42407da143','mS2ebcvTuf',2,0,1,0),
  (3,'guest-firstname','guest-lastname','guest','guest@mail.com','992328ce46cd6680cf1d2ea74ef182c37fa0a00d0b090e802e7617bcae56630c70a00977548a0d01e0b3b5f7f012b2a9b0358860f9e5c7cff7a892bcb48d44caa2066a8d8159381dafbc13f8ed6a7c17c69fabab81333193c1a890ba826bc2eb814a103fe928c4949540c6942153f7823805ff203aed5f50d7fa7d3e278723fe','n3phSsFwAZ',3,0,1,0),
  (4,'Christian','Lehmeier','christian','clehmeier@fluxgate.de','42c055ae706959c6f8266ba36d34d43cea90fc9ba7d2c5b63e37158100578710e345eeac9a64e9ad27d76652a22d4fa7833634706804a8e345af2e06f56ef98ead9c38c31f8c54e4434b1b11dfe435872661e7444ef385503e5bd5ca5e3f9236a75adc9ed057cf157c738715f3e431b000a293827d334e54bb70cf7bb12f72aa','s3cgAltVj6',2,0,1,0);
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

-- Dump completed on 2017-04-11 16:52:53
