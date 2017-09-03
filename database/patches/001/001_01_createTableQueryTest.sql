USE `libraries`;
DROP TABLE IF EXISTS `querytest`;

CREATE TABLE `querytest` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `__status` tinyint(4) NOT NULL DEFAULT '0',
  `__client` int(11) NOT NULL DEFAULT '1',
  `__version` INT(11) NOT NULL,
  `test` INT(11),
  PRIMARY KEY (`id`));

  INSERT INTO `querytest` (`id`, `name`, `__status`, `__client`, `__version`, `test`) VALUES
  ('1', 'None',             '0', '1', '0', '0'),
  ('2', 'Archived',         '1', '1', '0', '0'),
  ('3', 'Deleted',          '2', '1', '0', '0'),
  ('4', 'Archived+Deleted', '3', '1', '0', '0'),
  ('5', 'Archived 2',       '1', '1', '0', '0');