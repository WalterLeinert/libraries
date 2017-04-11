DROP TABLE IF EXISTS `entityversion`;
CREATE TABLE `entityversion` (
  `entityversion_id` VARCHAR(45) NOT NULL,
  `entityversion_version` INT(11) NOT NULL,
  PRIMARY KEY (`entityversion_id`));
