ALTER TABLE `user` 
ADD COLUMN `user_version` INT(11) NOT NULL DEFAULT 0 AFTER `id_mandant`;

ALTER TABLE `role` 
ADD COLUMN `role_version` INT(11) NOT NULL DEFAULT 0 AFTER `id_mandant`;

