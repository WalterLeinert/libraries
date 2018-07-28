CREATE DATABASE  IF NOT EXISTS `starter` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `starter`;
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
  `__version` int(11) NOT NULL DEFAULT '0',
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `client_name_UNIQUE` (`client_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES 
  (1,'Mandant-1','Test für Mandantenfähigkeit (1)', 0, 0),
  (2,'Mandant-2','Test für Mandantenfähigkeit (2)', 0, 0);
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
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0',
  `__status` tinyint(4) NOT NULL DEFAULT '0',
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
  (1,'admin','starter Administrator',1,0,0),
  (2,'user','starter Benutzer',1,0,0),
  (3,'guest','Externer Benutzer',1,0,0);
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
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0',
  `__status` tinyint(4) NOT NULL DEFAULT '0',
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
  (1,'admin-firstname','admin-lastname','admin','admin@mail.com','8b2e1d35f095db1542e5f17b54f8cc9e8cbe4f9a90806fd9fbeb2318416b60ba2ae93a3e888cb128eeb7ef0eb78fa53748ac764baa163f67e3ec49b7add48defa6b0c5fffc7f9abb5278e3c06a8be4337b7ecbfd7fa6bfd4d373f7a9fea343537effc050e527e1ab854cbf96f66cc56e8da9aa5e326d917ce07c9a7c6ae284ca','n3pe97n4iW',1,1,0,0),
  (2,'tester-firstname','tester-lastname','tester','tester@mail.com','ff3d50632673e58f5cc04afd479aef2696658e1dfda78f3ad6bb1427143ca834eb8231a02fecc9c408c7b53fe830951558c18e8ace69a6d7b42994119f55167337ecd041e65524aa2302a03ed0e70a0dffc88dd769054ddcc9ffa5ef7cbdc5559eb86786682d0c774ea610f20fa0bd0ccf6a547515b474a7cbcc0d42407da143','mS2ebcvTuf',2,1,0,0),
  (3,'guest-firstname','guest-lastname','guest','guest@mail.com','992328ce46cd6680cf1d2ea74ef182c37fa0a00d0b090e802e7617bcae56630c70a00977548a0d01e0b3b5f7f012b2a9b0358860f9e5c7cff7a892bcb48d44caa2066a8d8159381dafbc13f8ed6a7c17c69fabab81333193c1a890ba826bc2eb814a103fe928c4949540c6942153f7823805ff203aed5f50d7fa7d3e278723fe','n3phSsFwAZ',3,1,0,0),
  (4,'Christian','Lehmeier','christian','clehmeier@fluxgate.de','42c055ae706959c6f8266ba36d34d43cea90fc9ba7d2c5b63e37158100578710e345eeac9a64e9ad27d76652a22d4fa7833634706804a8e345af2e06f56ef98ead9c38c31f8c54e4434b1b11dfe435872661e7444ef385503e5bd5ca5e3f9236a75adc9ed057cf157c738715f3e431b000a293827d334e54bb70cf7bb12f72aa','s3cgAltVj6',2,1,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `artikel`
--

DROP TABLE IF EXISTS `artikel`;
CREATE TABLE IF NOT EXISTS `artikel` (
  `artikel_id` int(11) NOT NULL AUTO_INCREMENT,
  `artikel_nummer` varchar(25) NOT NULL,
  `artikel_name` varchar(50) NOT NULL,
  `artikel_extrabarcode` varchar(15) DEFAULT NULL,
  `artikel_saison` varchar(25) DEFAULT NULL,
  `artikel_teil1` varchar(10) DEFAULT NULL,
  `artikel_teil2` varchar(10) DEFAULT NULL,
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0',
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`artikel_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=75 ;

--
-- Daten für Tabelle `artikel`
--
LOCK TABLES `artikel` WRITE;
INSERT INTO `artikel` (`artikel_id`, `artikel_nummer`, `artikel_name`, `artikel_extrabarcode`, `artikel_saison`, `artikel_teil1`, `artikel_teil2`) VALUES
(15, 'G-UR700', 'GRENOBLE JACKET BOY', NULL, 'HW2016', 'A6', 'T'),
(16, 'G-DR802', 'CHAMONIX JACKET GIRL', NULL, 'HW2016', 'A6', 'T'),
(24, 'N004 1922', 'Blazer HARRY N004 1922', '7', 'FS 16', 'E6', 'E6'),
(25, 'N104 1922 B', 'Trousers GIACOMO N104 1922 ', NULL, 'FS 16', 'E6', 'E6'),
(27, 'N402 1165 B', 'Shirt PERTH N402 1165 ', NULL, 'FS 16', 'E6', 'E6'),
(28, 'S204 B01', 'SPY BRAD', NULL, '115', 'E5', 'E5'),
(29, 'S205 B01', 'CRIS BRAD', NULL, '115', 'E5', 'E5'),
(30, 'S115 B01', 'GER BRAD', NULL, '115', 'E5 ', 'E5'),
(31, 'S236 B01', 'SATURI 2 BRAD', NULL, '215', 'A5', 'A5'),
(32, 'S266 B01', 'SEGUEL BRAD ', NULL, '215', 'A5', 'A5'),
(33, 'S250 B01', 'MATURO 1 BRAD', NULL, '215', 'A5', 'A5'),
(34, 'S268 B01', 'GER 2 BRAD', NULL, '215', 'A5', 'A5'),
(35, 'S323 B01', 'LOV BRAD', NULL, '116', 'E6 ', 'E6'),
(36, 'S324 B01', 'SON BRAD ', NULL, '116', 'E6', 'E6'),
(37, 'S325 B01', 'VECHIO BRAD', NULL, '116', 'E6', 'E6'),
(38, 'S023 J022', 'ENIGMA EDIT-LY', NULL, '210', 'A2', 'A2'),
(40, 'S022 J022', 'ZHEJ EDIT-LY', NULL, '111', 'A2', 'A2'),
(41, 'S054 J022', 'CUPIDO BLUE EDIT-LY ', NULL, '214+115+215', 'A5', 'A5'),
(42, 'S146 J115', 'OLD JESSY', NULL, '115', 'E5', 'E5'),
(43, 'S145 J022', 'CRUSH 1 EDIT', NULL, '115', 'E5', 'E5'),
(44, 'S201 J022', 'SUPER EDIT', NULL, '115+215', 'A5', 'A5'),
(45, 'S149 J115', 'OLD 1 JESSY ', NULL, '115', 'E5', 'E5'),
(46, 'S206 J115', 'SIOUX 1 JESSY ', NULL, '115', 'E5', 'E5'),
(47, 'S213 J115', 'SIOUX 2 JESSY ', NULL, '115', 'E5', 'E5'),
(48, 'S213 J125', 'SIOUX 2 LYN ', NULL, '115', 'E5', 'E5'),
(49, 'S201 J123', 'SUPER LOVE', NULL, '115', 'E5 ', 'E5'),
(50, 'S253 J134', 'MINA HB 2 ZOE-LY ', NULL, '215', 'A5', 'A5'),
(51, 'S256 J101', 'INOX 1 ANGIE ', NULL, '215', 'A5', 'A5'),
(52, 'S257 J022', 'INOX 2 EDIT', NULL, '215', 'A5', 'A5'),
(53, 'S269 J022', 'CUPIDO EDIT ', NULL, '215', 'A5', 'A5'),
(54, 'S258 J022', 'SUCRE EDIT', NULL, '215+216', 'A5', 'A5'),
(55, 'S264 J022', 'CRUSH- 3 EDIT- LY ', NULL, '215', 'A5', 'A5'),
(56, 'S185 J022', 'N. BAKUS JESSY- LY', NULL, '215', 'A5', 'A5'),
(58, 'S260 J022', 'N-SLING 1 EDIT- LY ', NULL, '215', 'A5', 'A5'),
(59, 'S261 J125', 'N-SLING 2 LYN-LY', NULL, '215', 'A5', 'A5'),
(60, 'S262 J115', 'OLD 3 JESSY-LY', NULL, '215', 'A5', 'A5'),
(61, 'S265 J101', 'CRUSH 4 ANGIE- LY', NULL, '215', 'A5', 'A5'),
(62, 'S256 J130', 'INOX 1 RILEY- LY ', NULL, '116', 'E6', 'E6'),
(63, 'S347 J134', 'ELA 2 ZOE- LY ', NULL, '116', 'E6', 'E6'),
(64, 'S298 J115', 'OLD 8 JESSY- LY', NULL, '116', 'E6 ', 'E6'),
(65, 'S349 J115', 'OLD 9 JESSY- LY ', NULL, '116', 'E6', 'E6'),
(66, 'S184 J115', 'N.GRIZZI JESSY ', NULL, '116', 'E6', 'E6'),
(69, 'G-DP804', 'QUEBEC GIRL/WOMAN ', NULL, 'HW2016', 'A6', 'C'),
(70, 'GDP805', 'TORONTO GIRL/WOMAN', 'HW2016', NULL, 'A6', 'C'),
(71, 'G-DP866', 'MAINE GIRL/WOMAN', NULL, 'HW2016', 'A6', 'C'),
(72, 'G-UP702', 'ICEBERG BOY/MAN', NULL, 'HW2016', 'A6', 'C'),
(73, 'G-UP764', 'NEW YUKON BOY/MAN', NULL, 'HW2016', 'A6', 'C'),
(74, 'G-UP765', 'NEWPORT BOY/MAN', NULL, 'HW2016', 'A6', 'C');
UNLOCK TABLES;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;