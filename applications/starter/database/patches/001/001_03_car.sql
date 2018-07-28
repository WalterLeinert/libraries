CREATE TABLE IF NOT EXISTS `car` (
`car_id` int(11) NOT NULL,
  `car_name` varchar(25) NOT NULL,
  `car_color` varchar(25) DEFAULT NULL,
  `__client` int(11) NOT NULL,
  `__version` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `car`
--

INSERT INTO `car` (`car_id`, `car_name`, `car_color`, `__client`, `__version`) VALUES
(1, 'Toyota', 'silver', 1, 0),
(2, 'BMW', 'blue', 1, 0),
(3, 'Mercedes', 'black', 1, 0),
(4, 'Audi', 'red', 1, 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `car`
--
ALTER TABLE `car`
 ADD PRIMARY KEY (`car_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `car`
--
ALTER TABLE `car`
MODIFY `car_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;