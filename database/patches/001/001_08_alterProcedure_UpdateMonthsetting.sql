DROP PROCEDURE `UpdateMonthsetting`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateMonthsetting`(IN `USERID` INT, IN `JAHR` INT, IN `MONAT` INT) COMMENT 'calculates carryover for given user, year, month' NOT DETERMINISTIC MODIFIES SQL DATA SQL SECURITY DEFINER BEGIN
CALL CreateMonthsetting(USERID,JAHR,MONAT);
UPDATE monthsetting SET monthsetting_carryover=(SELECT * FROM (SELECT (totalIncludingCarryOverMonthBefore-compensation) AS carryover FROM _monthlyresult WHERE (_monthlyresult.year=JAHR)  
AND (_monthlyresult.month=MONAT)
AND (_monthlyresult.id_user=USERID) LIMIT 1) b)
WHERE monthsetting_year=JAHR AND monthsetting_month=MONAT AND id_user=USERID;
END