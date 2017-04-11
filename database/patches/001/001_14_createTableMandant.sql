DROP TABLE IF EXISTS `mandant`;
CREATE TABLE `mandant` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

INSERT INTO `mandant` (`id`, `name`, `description`) VALUES ('1', 'Mandant-1', 'Test für Mandantenfähigkeit');