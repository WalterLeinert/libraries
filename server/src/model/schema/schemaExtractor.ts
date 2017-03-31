import * as Knex from 'knex';

import { ColumnInfo } from './columnInfo';
import { TableInfo } from './tableInfo';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------


export class SchemaExtractor {
    protected static logger = getLogger(SchemaExtractor);

    constructor(private knex: Knex) {
    }


    public extractData(): Promise<TableInfo[]> {
        const rval: TableInfo[] = [];

        return using(new XLog(SchemaExtractor.logger, levels.INFO, 'extractData'), (log) => {
            const tableInfos: { [name: string]: TableInfo; } = {};
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

                ]).then((res) => {
                    this.knex.destroy();

                    const columnsSchema = res[0];
                    // tslint:disable-next-line:no-unused-variable
                    const constraintsSchema = res[1];    // TODO: unused

                    // $log.debug(data);

                    for (const columnSchema of columnsSchema) {
                        let tableInfo: TableInfo = tableInfos[columnSchema.TABLE_NAME];

                        if (!tableInfo) {
                            tableInfo = new TableInfo(columnSchema.TABLE_NAME);
                            tableInfos[columnSchema.TABLE_NAME] = tableInfo;
                        }

                        const colInfo = new ColumnInfo(
                            columnSchema.COLUMN_NAME,
                            columnSchema.DATA_TYPE,
                            columnSchema.IS_NULLABLE,
                            columnSchema.COLUMN_DEFAULT,
                            columnSchema.COLUMN_KEY === 'PRI',
                            columnSchema.EXTRA === 'auto_increment');

                        tableInfo.addColumn(colInfo);
                        log.debug('Column: ', colInfo);
                    }

                    for (const table in tableInfos) {
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