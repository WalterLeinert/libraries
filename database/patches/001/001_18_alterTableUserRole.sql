ALTER TABLE `user` 
CHANGE COLUMN `firstname` `user_firstname` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `lastname` `user_lastname` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `username` `user_username` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `email` `user_email` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `password` `user_password` VARCHAR(256) NOT NULL ,
CHANGE COLUMN `password_salt` `user_password_salt` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `deleted` `user_deleted` TINYINT(4) NOT NULL DEFAULT '0' ;

ALTER TABLE `role` 
CHANGE COLUMN `deleted` `role_deleted` TINYINT(4) NOT NULL DEFAULT '0' ;

ALTER TABLE `role` 
CHANGE COLUMN `role_id` `role_id` INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5 ;