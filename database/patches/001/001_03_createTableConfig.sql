--
-- Datenbank: `starter`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `config`
--

DROP TABLE IF EXISTS `config`;

CREATE TABLE IF NOT EXISTS `config` (
`config_id` int(11) NOT NULL,
  `config_name` varchar(50) NOT NULL,
  `config_json` text NOT NULL,
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `config`
--

INSERT INTO `config` (`config_id`, `config_name`, `config_json`, `__client`, `__version`) VALUES
(1, 'smtp', '  "mail": {\r\n    "host": "smtp.1und1.de",\r\n    "port": 465,\r\n    "ssl": true,\r\n    "user": "smtp.nodejs@fluxgate.de",\r\n    "password": "Ds43q-Vb5AKpu98-Gbnd",\r\n    "from": "smtp.nodejs@fluxgate.de"\r\n  }', 1, 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `config`
--
ALTER TABLE `config`
 ADD PRIMARY KEY (`config_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `config`
--
ALTER TABLE `config`
MODIFY `config_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
