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
  `systemconfig_type` varchar(25) NOT NULL,
  `systemconfig_description` varchar(100) DEFAULT NULL,
  `systemconfig_json` text NOT NULL,
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `systemconfig`
--

INSERT INTO `systemconfig` (`systemconfig_id`, `systemconfig_type`, `systemconfig_description`, `systemconfig_json`, `__client`, `__version`) VALUES
('smtp-default', 'smtp', 'SMTP-Konfiguration', '{
    "__type__":"SmtpConfig",
    "id":"default",
    "version":0,
    "type":"smtp",
    "host":"smtp.1und1.de",
    "port":465,
    "ssl":true,
    "user":"smtp.nodejs@fluxgate.de",
    "password":"Ds43q-Vb5AKpu98-Gbnd",
    "from":"smtp.nodejs@fluxgate.de",
    "description":"SMTP-Konfiguration",
    "__client":0,
    "__version":0
}', 1, 0);

  INSERT INTO `systemconfig` (`systemconfig_id`, `systemconfig_type`, `systemconfig_description`, `systemconfig_json`, `__client`, `__version`) VALUES
('smtp-test', 'smtp', 'weitere SMTP-Konfiguration', '{
    "__type__":"SmtpConfig",
    "id":"test",
    "version":0,
    "type":"smtp",
    "host":"host-2",
    "port":0,
    "ssl":true,
    "user":"user-2",
    "password":"password-2",
    "from":"from-1",
    "description":"description-2",
    "__client":0,
    "__version":0
}', 1, 0);

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
