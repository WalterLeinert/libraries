DROP TABLE IF EXISTS `querytest`;

CREATE TABLE `querytest` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` INT(11) NOT NULL,
  `test` INT(11),
  PRIMARY KEY (`id`));
