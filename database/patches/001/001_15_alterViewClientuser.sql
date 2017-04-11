DROP VIEW IF EXISTS `_clientuser`;

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `_clientuser` AS
    SELECT 
        `boss`.`user_id` AS `boss_id`,
        `employeeportal`.`user`.`firstname` AS `firstname`,
        `employeeportal`.`user`.`lastname` AS `lastname`,
        `employeeportal`.`user`.`user_id` AS `client_id`
    FROM
        ((`employeeportal`.`user` `boss`
        JOIN `employeeportal`.`userdetails` ON ((`employeeportal`.`userdetails`.`id_boss` = `boss`.`user_id`)))
        LEFT JOIN `employeeportal`.`user` ON (((`employeeportal`.`userdetails`.`id_user` = `employeeportal`.`user`.`user_id`)
		)))
	WHERE 
		(`employeeportal`.`user`.`deleted` = 0)