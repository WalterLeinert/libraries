DROP TABLE IF EXISTS `querytest`;

CREATE TABLE `querytest` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `version` INT(11) NOT NULL,
  `test` INT(11),
  PRIMARY KEY (`id`));
