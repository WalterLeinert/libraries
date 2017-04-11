-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 03. Feb 2017 um 17:57
-- Server Version: 5.5.46-0+deb8u1
-- PHP-Version: 5.6.14-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `employeeportal`
--
-- WL: Nicht für Docker
-- CREATE DATABASE IF NOT EXISTS `employeeportal` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- USE `employeeportal`;

DELIMITER $$
--
-- Prozeduren
--
DROP PROCEDURE IF EXISTS `CreateMonthsetting`$$
CREATE DEFINER=`root`@`remotepc3.fluxgate.de` PROCEDURE `CreateMonthsetting`(IN `USERID` INT, IN `JAHR` INT, IN `MONAT` INT)
    MODIFIES SQL DATA
    COMMENT 'create new monthsetting for User, Jahr, Monat if not exists'
IF ((SELECT COUNT(id_user) FROM monthsetting WHERE id_user=USERID AND monthsetting_year=JAHR AND monthsetting_month=MONAT LIMIT 1) < 1) then
INSERT INTO monthsetting (id_user, monthsetting_year, monthsetting_month, monthsetting_weeklyworkhours, monthsetting_lawcompensation) 
	SELECT user_id, JAHR, MONAT, userdetails_weeklyworkhours, userdetails_lawcompensation FROM user LEFT JOIN userdetails ON id_user=user_id WHERE user_id=USERID ORDER BY user_id;
END IF$$

DROP PROCEDURE IF EXISTS `UpdateMonthsetting`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateMonthsetting`(IN `USERID` INT, IN `JAHR` INT, IN `MONAT` INT)
    MODIFIES SQL DATA
    COMMENT 'calculates carryover for given user, year, month'
UPDATE monthsetting SET monthsetting_carryover=(SELECT * FROM (SELECT (AFTERCOMP-COMPENSATION) AS CARRYOVER FROM _monthlyresult WHERE (_monthlyresult.JJ=JAHR)  
AND (_monthlyresult.MM=MONAT)
AND (_monthlyresult.id_user=USERID) LIMIT 1) b)
WHERE monthsetting_year=JAHR AND monthsetting_month=MONAT AND id_user=USERID$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `department`
--

DROP TABLE IF EXISTS `department`;
CREATE TABLE IF NOT EXISTS `department` (
`department_id` int(11) NOT NULL,
  `department_name` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `department`
--

INSERT INTO `department` (`department_id`, `department_name`) VALUES
(3, 'Administration'),
(5, 'Marketing'),
(6, 'Sales'),
(7, 'Development'),
(9, 'Finance'),
(32, 'Franchise'),
(33, 'IT'),
(34, 'HR');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `monthsetting`
--

DROP TABLE IF EXISTS `monthsetting`;
CREATE TABLE IF NOT EXISTS `monthsetting` (
`monthsetting_id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `monthsetting_year` int(11) NOT NULL,
  `monthsetting_month` int(11) NOT NULL,
  `monthsetting_weeklyworkhours` decimal(5,2) NOT NULL,
  `monthsetting_lawcompensation` decimal(5,2) NOT NULL COMMENT 'percent',
  `monthsetting_carryover` decimal(5,2) DEFAULT NULL COMMENT 'carryover of workhours of month before'
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `monthsetting`
--

INSERT INTO `monthsetting` (`monthsetting_id`, `id_user`, `monthsetting_year`, `monthsetting_month`, `monthsetting_weeklyworkhours`, `monthsetting_lawcompensation`, `monthsetting_carryover`) VALUES
(32, 1, 2016, 12, 40.00, 10.00, 0.50),
(33, 1, 2017, 1, 40.00, 10.00, 2.50);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `overtime`
--

DROP TABLE IF EXISTS `overtime`;
CREATE TABLE IF NOT EXISTS `overtime` (
`overtime_id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `overtime_date` date NOT NULL,
  `overtime_start` time NOT NULL,
  `overtime_end` time NOT NULL,
  `overtime_reason` varchar(255) NOT NULL,
  `overtime_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=overtime; 1=overtimecompensation'
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `overtime`
--

INSERT INTO `overtime` (`overtime_id`, `id_user`, `overtime_date`, `overtime_start`, `overtime_end`, `overtime_reason`, `overtime_type`) VALUES
(14, 1, '2016-12-15', '16:00:00', '21:00:00', 'Kundenbesuch', 0),
(15, 1, '2016-12-16', '12:00:00', '12:30:00', 'Mittag', 1),
(16, 1, '2017-01-03', '16:00:00', '23:00:00', 'Kundenbesuch', 0),
(17, 1, '2017-01-18', '16:00:00', '16:30:00', 'Mittagspause', 1);

--
-- Trigger `overtime`
--
DROP TRIGGER IF EXISTS `Overtime After Delete`;
DELIMITER //
CREATE TRIGGER `Overtime After Delete` AFTER DELETE ON `overtime`
 FOR EACH ROW Call UpdateMonthsetting(OLD.id_user,YEAR(OLD.overtime_date),MONTH(OLD.overtime_date))
//
DELIMITER ;
DROP TRIGGER IF EXISTS `Overtime After Insert`;
DELIMITER //
CREATE TRIGGER `Overtime After Insert` AFTER INSERT ON `overtime`
 FOR EACH ROW Call UpdateMonthsetting(NEW.id_user,YEAR(NEW.overtime_date),MONTH(NEW.overtime_date))
//
DELIMITER ;
DROP TRIGGER IF EXISTS `Overtime After Update`;
DELIMITER //
CREATE TRIGGER `Overtime After Update` AFTER UPDATE ON `overtime`
 FOR EACH ROW Call UpdateMonthsetting(NEW.id_user,YEAR(NEW.overtime_date),MONTH(NEW.overtime_date))
//
DELIMITER ;
DROP TRIGGER IF EXISTS `Overtime Before Insert`;
DELIMITER //
CREATE TRIGGER `Overtime Before Insert` BEFORE INSERT ON `overtime`
 FOR EACH ROW Call CreateMonthsetting(NEW.id_user,YEAR(NEW.overtime_date),MONTH(NEW.overtime_date))
//
DELIMITER ;
DROP TRIGGER IF EXISTS `Overtime Before Update`;
DELIMITER //
CREATE TRIGGER `Overtime Before Update` BEFORE UPDATE ON `overtime`
 FOR EACH ROW Call CreateMonthsetting(NEW.id_user,YEAR(NEW.overtime_date),MONTH(NEW.overtime_date))
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(45) CHARACTER SET latin1 NOT NULL,
  `role_description` varchar(256) CHARACTER SET latin1 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `role`
--

INSERT INTO `role` (`role_id`, `role_name`, `role_description`) VALUES
(1, 'admin', 'starter Administrator'),
(2, 'user', 'starter Benutzer'),
(3, 'guest', 'Externer Benutzer');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
`user_id` int(11) NOT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(256) NOT NULL,
  `password_salt` varchar(45) NOT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`user_id`, `firstname`, `lastname`, `username`, `email`, `password`, `password_salt`, `id_role`) VALUES
(1, 'admin-firstname', 'admin-lastname', 'admin', 'admin@mail.com', '8b2e1d35f095db1542e5f17b54f8cc9e8cbe4f9a90806fd9fbeb2318416b60ba2ae93a3e888cb128eeb7ef0eb78fa53748ac764baa163f67e3ec49b7add48defa6b0c5fffc7f9abb5278e3c06a8be4337b7ecbfd7fa6bfd4d373f7a9fea343537effc050e527e1ab854cbf96f66cc56e8da9aa5e326d917ce07c9a7c6ae284ca', 'n3pe97n4iW', 1),
(2, 'tester-firstname', 'tester-lastname', 'tester', 'tester@mail.com', 'ff3d50632673e58f5cc04afd479aef2696658e1dfda78f3ad6bb1427143ca834eb8231a02fecc9c408c7b53fe830951558c18e8ace69a6d7b42994119f55167337ecd041e65524aa2302a03ed0e70a0dffc88dd769054ddcc9ffa5ef7cbdc5559eb86786682d0c774ea610f20fa0bd0ccf6a547515b474a7cbcc0d42407da143', 'mS2ebcvTuf', 2),
(3, 'guest-firstname', 'guest-lastname', 'guest', 'guest@mail.com', '992328ce46cd6680cf1d2ea74ef182c37fa0a00d0b090e802e7617bcae56630c70a00977548a0d01e0b3b5f7f012b2a9b0358860f9e5c7cff7a892bcb48d44caa2066a8d8159381dafbc13f8ed6a7c17c69fabab81333193c1a890ba826bc2eb814a103fe928c4949540c6942153f7823805ff203aed5f50d7fa7d3e278723fe', 'n3phSsFwAZ', 3),
(4, 'Christian', 'Lehmeier', 'christian', 'clehmeier@fluxgate.de', '42c055ae706959c6f8266ba36d34d43cea90fc9ba7d2c5b63e37158100578710e345eeac9a64e9ad27d76652a22d4fa7833634706804a8e345af2e06f56ef98ead9c38c31f8c54e4434b1b11dfe435872661e7444ef385503e5bd5ca5e3f9236a75adc9ed057cf157c738715f3e431b000a293827d334e54bb70cf7bb12f72aa', 's3cgAltVj6', 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `userdetails`
--

DROP TABLE IF EXISTS `userdetails`;
CREATE TABLE IF NOT EXISTS `userdetails` (
`userdetails_id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `userdetails_weeklyworkhours` decimal(5,2) NOT NULL COMMENT 'Weekly hours as per labour contract',
  `userdetails_lawcompensation` decimal(5,2) NOT NULL COMMENT 'Overtime already compensated due to German labor law',
  `id_boss` int(11) NOT NULL COMMENT 'chief id_user of users-table',
  `id_department` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `userdetails`
--

INSERT INTO `userdetails` (`userdetails_id`, `id_user`, `userdetails_weeklyworkhours`, `userdetails_lawcompensation`, `id_boss`, `id_department`) VALUES
(1, 3, 45.00, 10.00, 1, 5),
(2, 1, 40.00, 10.00, 2, 6),
(3, 2, 42.00, 10.00, 0, 1);

-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `_bosslist`
--
DROP VIEW IF EXISTS `_bosslist`;
CREATE TABLE IF NOT EXISTS `_bosslist` (
`user_id` int(11)
,`boss` varchar(92)
);
-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `_clientuser`
--
DROP VIEW IF EXISTS `_clientuser`;
CREATE TABLE IF NOT EXISTS `_clientuser` (
`boss_id` int(11)
,`firstname` varchar(45)
,`lastname` varchar(45)
,`client_id` int(11)
);
-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `_monthlycompensation`
--
DROP VIEW IF EXISTS `_monthlycompensation`;
CREATE TABLE IF NOT EXISTS `_monthlycompensation` (
`id_user` int(11)
,`JJ` int(4)
,`MM` int(2)
,`COMPENSATION` decimal(35,4)
);
-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `_monthlyovertime`
--
DROP VIEW IF EXISTS `_monthlyovertime`;
CREATE TABLE IF NOT EXISTS `_monthlyovertime` (
`id_user` int(11)
,`JJ` int(4)
,`MM` int(2)
,`OVERTIME` decimal(35,4)
);
-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `_monthlyovertimelawcompensation`
--
DROP VIEW IF EXISTS `_monthlyovertimelawcompensation`;
CREATE TABLE IF NOT EXISTS `_monthlyovertimelawcompensation` (
`id_user` int(11)
,`JJ` int(4)
,`MM` int(2)
,`OVERTIME` decimal(35,4)
,`weeklyworkhours` decimal(5,2)
,`lawcompensation` decimal(5,2)
,`AFTERCOMP` decimal(40,8)
);
-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `_monthlyresult`
--
DROP VIEW IF EXISTS `_monthlyresult`;
CREATE TABLE IF NOT EXISTS `_monthlyresult` (
`id_user` int(11)
,`JJ` int(4)
,`MM` int(2)
,`OVERTIME` decimal(35,4)
,`weeklyworkhours` decimal(5,2)
,`lawcompensation` decimal(5,2)
,`AFTERCOMP` decimal(40,8)
,`COMPENSATION` decimal(35,4)
,`CARRYOVERMONTHBEFORE` decimal(5,2)
,`CARRYOVER` decimal(42,8)
);
-- --------------------------------------------------------

--
-- Struktur des Views `_bosslist`
--
DROP TABLE IF EXISTS `_bosslist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `_bosslist` AS select `user`.`user_id` AS `user_id`,concat(`user`.`lastname`,', ',`user`.`firstname`) AS `boss` from `user` order by concat(`user`.`lastname`,', ',`user`.`firstname`);

-- --------------------------------------------------------

--
-- Struktur des Views `_clientuser`
--
DROP TABLE IF EXISTS `_clientuser`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `_clientuser` AS select `boss`.`user_id` AS `boss_id`,`user`.`firstname` AS `firstname`,`user`.`lastname` AS `lastname`,`user`.`user_id` AS `client_id` from ((`user` `boss` join `userdetails` on((`userdetails`.`id_boss` = `boss`.`user_id`))) left join `user` on((`userdetails`.`id_user` = `user`.`user_id`)));

-- --------------------------------------------------------

--
-- Struktur des Views `_monthlycompensation`
--
DROP TABLE IF EXISTS `_monthlycompensation`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `_monthlycompensation` AS select `overtime`.`id_user` AS `id_user`,year(`overtime`.`overtime_date`) AS `JJ`,month(`overtime`.`overtime_date`) AS `MM`,sum((time_to_sec(timediff(`overtime`.`overtime_end`,`overtime`.`overtime_start`)) / 3600)) AS `COMPENSATION` from `overtime` where (`overtime`.`overtime_type` = 1) group by `overtime`.`id_user`,year(`overtime`.`overtime_date`),month(`overtime`.`overtime_date`);

-- --------------------------------------------------------

--
-- Struktur des Views `_monthlyovertime`
--
DROP TABLE IF EXISTS `_monthlyovertime`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `_monthlyovertime` AS select `overtime`.`id_user` AS `id_user`,year(`overtime`.`overtime_date`) AS `JJ`,month(`overtime`.`overtime_date`) AS `MM`,sum((time_to_sec(timediff(`overtime`.`overtime_end`,`overtime`.`overtime_start`)) / 3600)) AS `OVERTIME` from `overtime` where (`overtime`.`overtime_type` = 0) group by `overtime`.`id_user`,year(`overtime`.`overtime_date`),month(`overtime`.`overtime_date`);

-- --------------------------------------------------------

--
-- Struktur des Views `_monthlyovertimelawcompensation`
--
DROP TABLE IF EXISTS `_monthlyovertimelawcompensation`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `_monthlyovertimelawcompensation` AS select `monthsetting`.`id_user` AS `id_user`,`_monthlyovertime`.`JJ` AS `JJ`,`_monthlyovertime`.`MM` AS `MM`,`_monthlyovertime`.`OVERTIME` AS `OVERTIME`,`monthsetting`.`monthsetting_weeklyworkhours` AS `weeklyworkhours`,`monthsetting`.`monthsetting_lawcompensation` AS `lawcompensation`,(`_monthlyovertime`.`OVERTIME` - ((`monthsetting`.`monthsetting_weeklyworkhours` * `monthsetting`.`monthsetting_lawcompensation`) / 100)) AS `AFTERCOMP` from (`_monthlyovertime` left join `monthsetting` on(((`_monthlyovertime`.`id_user` = `monthsetting`.`id_user`) and (`_monthlyovertime`.`JJ` = `monthsetting`.`monthsetting_year`) and (`_monthlyovertime`.`MM` = `monthsetting`.`monthsetting_month`))));

-- --------------------------------------------------------

--
-- Struktur des Views `_monthlyresult`
--
DROP TABLE IF EXISTS `_monthlyresult`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `_monthlyresult` AS select `_monthlyovertimelawcompensation`.`id_user` AS `id_user`,`_monthlyovertimelawcompensation`.`JJ` AS `JJ`,`_monthlyovertimelawcompensation`.`MM` AS `MM`,`_monthlyovertimelawcompensation`.`OVERTIME` AS `OVERTIME`,`_monthlyovertimelawcompensation`.`weeklyworkhours` AS `weeklyworkhours`,`_monthlyovertimelawcompensation`.`lawcompensation` AS `lawcompensation`,`_monthlyovertimelawcompensation`.`AFTERCOMP` AS `AFTERCOMP`,ifnull(`_monthlycompensation`.`COMPENSATION`,0) AS `COMPENSATION`,ifnull(`monthsetting`.`monthsetting_carryover`,0) AS `CARRYOVERMONTHBEFORE`,((ifnull(`monthsetting`.`monthsetting_carryover`,0) + `_monthlyovertimelawcompensation`.`AFTERCOMP`) - ifnull(`_monthlycompensation`.`COMPENSATION`,0)) AS `CARRYOVER` from ((`_monthlyovertimelawcompensation` left join `_monthlycompensation` on(((`_monthlyovertimelawcompensation`.`id_user` = `_monthlycompensation`.`id_user`) and (`_monthlyovertimelawcompensation`.`JJ` = `_monthlycompensation`.`JJ`) and (`_monthlyovertimelawcompensation`.`MM` = `_monthlycompensation`.`MM`)))) left join `monthsetting` on(((`monthsetting`.`id_user` = `_monthlyovertimelawcompensation`.`id_user`) and (`monthsetting`.`monthsetting_year` = year((str_to_date(concat(`_monthlyovertimelawcompensation`.`JJ`,',',`_monthlyovertimelawcompensation`.`MM`,',01'),'%Y,%m,%d') - interval 1 month))) and (`monthsetting`.`monthsetting_month` = month((str_to_date(concat(`_monthlyovertimelawcompensation`.`JJ`,',',`_monthlyovertimelawcompensation`.`MM`,',01'),'%Y,%m,%d') - interval 1 month))))));

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `department`
--
ALTER TABLE `department`
 ADD PRIMARY KEY (`department_id`);

--
-- Indizes für die Tabelle `monthsetting`
--
ALTER TABLE `monthsetting`
 ADD PRIMARY KEY (`monthsetting_id`);

--
-- Indizes für die Tabelle `overtime`
--
ALTER TABLE `overtime`
 ADD PRIMARY KEY (`overtime_id`);

--
-- Indizes für die Tabelle `role`
--
ALTER TABLE `role`
 ADD PRIMARY KEY (`role_id`), ADD UNIQUE KEY `role_name_UNIQUE` (`role_name`), ADD KEY `role_name_INDEX` (`role_name`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`user_id`), ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- Indizes für die Tabelle `userdetails`
--
ALTER TABLE `userdetails`
 ADD PRIMARY KEY (`userdetails_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `department`
--
ALTER TABLE `department`
MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT für Tabelle `monthsetting`
--
ALTER TABLE `monthsetting`
MODIFY `monthsetting_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT für Tabelle `overtime`
--
ALTER TABLE `overtime`
MODIFY `overtime_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT für Tabelle `userdetails`
--
ALTER TABLE `userdetails`
MODIFY `userdetails_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
