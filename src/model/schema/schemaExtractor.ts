import * as Knex from 'knex';

import { OptionParser, OptionType, Option } from '@fluxgate/common';
import { TableInfo } from './tableInfo';
import { ColumnInfo } from './columnInfo';


// -------------------------- logging -------------------------------
import { Logger, levels, configure, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------


export class SchemaExtractor {
    static logger = getLogger('Extractor');

    constructor(private knex: Knex) {
    }


    public extractData(): Promise<TableInfo[]> {
        let rval: TableInfo[] = [];

        return using(new XLog(SchemaExtractor.logger, levels.INFO, 'extractData'), (log) => {
            let tableInfos: { [name: string]: TableInfo; } = {};
            // let x: Map<string, TableInfo> = new Map;

            return new Promise((resolve, reject) => {

                Promise.all([

                    this.knex
                        .from('INFORMATION_SCHEMA.COLUMNS')
                        .where('TABLE_SCHEMA', '=', 'griso')
                        .then(),

                    this.knex
                        .from('INFORMATION_SCHEMA.TABLE_CONSTRAINTS')
                        .where('TABLE_SCHEMA', '=', 'griso')
                        .then()

                ]).then(res => {
                    this.knex.destroy();

                    let columnsSchema = <any>res[0];
                    let constraintsSchema = <any>res[1];    // TODO: unused

                    // $log.debug(data);

                    for (let columnSchema of columnsSchema) {
                        let tableInfo: TableInfo = tableInfos[columnSchema.TABLE_NAME];

                        if (!tableInfo) {
                            tableInfo = new TableInfo(columnSchema.TABLE_NAME);
                            tableInfos[columnSchema.TABLE_NAME] = tableInfo;
                        }

                        let colInfo = new ColumnInfo(
                            columnSchema.COLUMN_NAME,
                            columnSchema.DATA_TYPE,
                            columnSchema.IS_NULLABLE,
                            columnSchema.COLUMN_DEFAULT,
                            columnSchema.COLUMN_KEY === 'PRI',
                            columnSchema.EXTRA === 'auto_increment');

                        tableInfo.addColumn(colInfo);
                        log.debug('Column: ', colInfo);
                    }

                    for (let table in tableInfos) {
                        if (table) {
                            rval.push(tableInfos[table]);
                        }
                    }

                    resolve(rval);
                });
            });
        });
    }

}