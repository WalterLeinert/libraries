-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 05. Jun 2017 um 20:18
-- Server Version: 5.5.46-0+deb8u1
-- PHP-Version: 5.6.14-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `starter`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `systemconfig`
--

DROP TABLE IF EXISTS `systemconfig`;
CREATE TABLE IF NOT EXISTS `systemconfig` (
  `systemconfig_id` varchar(25) NOT NULL,
  `systemconfig_description` varchar(100) DEFAULT NULL,
  `systemconfig_json` text NOT NULL,
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `systemconfig`
--

INSERT INTO `systemconfig` (`systemconfig_id`, `systemconfig_description`, `systemconfig_json`, `__client`, `__version`) VALUES
('smtp', 'SMTP-Konfiguration', '  "mail": {\r\n    "host": "smtp.1und1.de",\r\n    "port": 465,\r\n    "ssl": true,\r\n    "user": "smtp.nodejs@fluxgate.de",\r\n    "password": "Ds43q-Vb5AKpu98-Gbnd",\r\n    "from": "smtp.nodejs@fluxgate.de"\r\n  }', 1, 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `systemconfig`
--
ALTER TABLE `systemconfig`
 ADD UNIQUE KEY `systemconfig_id` (`systemconfig_id`,`__client`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
