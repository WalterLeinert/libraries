ALTER
 ALGORITHM = UNDEFINED
 DEFINER = root@localhost
 SQL SECURITY DEFINER
 VIEW `_monthlyresult`
 AS select `_monthlyovertimelawcompensation`.`id_user` AS `id_user`,
`_monthlyovertimelawcompensation`.`year` AS `year`,
`_monthlyovertimelawcompensation`.`month` AS `month`,
`_monthlyovertimelawcompensation`.`overtime` AS `overtime`,
`_monthlyovertimelawcompensation`.`weeklyWorkHours` AS `weeklyWorkHours`,
`_monthlyovertimelawcompensation`.`lawCompensation` AS `lawCompensation`,
`_monthlyovertimelawcompensation`.`lawCompensationHours` AS `lawCompensationHours`,
`_monthlyovertimelawcompensation`.`afterLawCompensation` AS `afterLawCompensation`,
ifnull(`employeeportal`.`monthsetting`.`monthsetting_carryover`,0) AS `carryoverMonthBefore`,
(`_monthlyovertimelawcompensation`.`afterLawCompensation`+ifnull(`employeeportal`.`monthsetting`.`monthsetting_carryover`,0)) AS 'totalIncludingCarryoverMonthBefore',
ifnull(`_monthlycompensation`.`compensation`,0) AS `compensation`,
((ifnull(`employeeportal`.`monthsetting`.`monthsetting_carryover`,0) + `_monthlyovertimelawcompensation`.`afterLawCompensation`) - ifnull(`_monthlycompensation`.`compensation`,0)) AS `carryover` 
from ((`employeeportal`.`_monthlyovertimelawcompensation` 
left join `employeeportal`.`_monthlycompensation` on(((`_monthlyovertimelawcompensation`.`id_user` = `_monthlycompensation`.`id_user`) and (`_monthlyovertimelawcompensation`.`year` = `_monthlycompensation`.`year`) and (`_monthlyovertimelawcompensation`.`month` = `_monthlycompensation`.`month`)))) 
left join `employeeportal`.`monthsetting` on(((`employeeportal`.`monthsetting`.`id_user` = `_monthlyovertimelawcompensation`.`id_user`) and (`employeeportal`.`monthsetting`.`monthsetting_year` = year((str_to_date(concat(`_monthlyovertimelawcompensation`.`year`,',',`_monthlyovertimelawcompensation`.`month`,',01'),'%Y,%m,%d') - interval 1 month))) and (`employeeportal`.`monthsetting`.`monthsetting_month` = month((str_to_date(concat(`_monthlyovertimelawcompensation`.`year`,',',`_monthlyovertimelawcompensation`.`month`,',01'),'%Y,%m,%d') - interval 1 month))))))