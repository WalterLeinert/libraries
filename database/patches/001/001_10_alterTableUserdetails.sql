ALTER TABLE `userdetails` CHANGE `userdetails_weeklyworkhours` `userdetails_weeklyworkhours` DECIMAL(5,2) NULL COMMENT 'Weekly hours as per labour contract';
ALTER TABLE `userdetails` CHANGE `userdetails_lawcompensation` `userdetails_lawcompensation` DECIMAL(5,2) NULL COMMENT 'Overtime already compensated due to German labor law';
ALTER TABLE `userdetails` CHANGE `id_boss` `id_boss` INT(11) NULL DEFAULT '1' COMMENT 'chief id_user of users-table';
ALTER TABLE `userdetails` CHANGE `id_department` `id_department` INT(11) NULL;