// Nodejs imports
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';

// -------------------------- logging -------------------------------
import { Logger, levels, configure, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------


import { TableInfo } from './tableInfo';
import { ColumnInfo, DataType } from './columnInfo';
import { IGenerator } from './generator.interface';
import { GeneratorBase } from './generatorBase';
import { IConfigInfo } from './configInfo';

export class KnexGenerator extends GeneratorBase {
    static logger = getLogger('KnexGenerator');

    constructor(protected outputDir: string, protected configInfo: IConfigInfo) {
        super(outputDir, configInfo);
    }

    public generateFiles(tableInfos: TableInfo[]) {
        using(new XLog(KnexGenerator.logger, levels.INFO, 'generateFiles'), (log) => {
            for (let tableInfo of tableInfos) {
                let tableName = tableInfo.name;

                let filePath = path.join(this.outputDir, tableName + '.ts');

                fs.open(filePath, 'w', (err, fd) => {
                    if (err) {
                        if (err.code === "EEXIST") {
                            log.info('overwriting file %s', filePath);
                        } else {
                            throw err;
                        }
                    }

                    this.dumpHeader(fd);
                    this.dumpCreateTable(fd, tableInfo);

                    fs.close(fd, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                });
            }
        });
    }
    public generateFile(fileName: string, tableInfos: TableInfo[]) {
    }

    private dumpCreateTable(fd, tableInfo: TableInfo) {
        using(new XLog(KnexGenerator.logger, levels.DEBUG, 'dumpCreateTable', 'table = ', tableInfo.name), (log) => {
            
             //
            // up function: create table
            //
            GeneratorBase.writeLineSync(fd, GeneratorBase.quote('use strict') + ';');
            GeneratorBase.writeLineSync(fd);
            GeneratorBase.writeLineSync(fd, 'exports.up = function(knex) {');
            GeneratorBase.writeLineSync(fd, '  return knex.schema');

            GeneratorBase.writeLineSync(fd, `    .createTable('${tableInfo.name}', function(table) {`);

            for (let colInfo of tableInfo.columns) {
                //WL: nur für pks

                let f = false;
                if (colInfo.isPrimaryKey) {
                    GeneratorBase.writeLineSync(fd, `      table.increments('${colInfo.name}').primary();`);
                } else {
                    let type = GeneratorBase.mapDataType(colInfo.type);
                    GeneratorBase.writeLineSync(fd, `      table.${type}('${colInfo.name}');`);
                }
            }
            GeneratorBase.writeLineSync(fd, '    });');
            GeneratorBase.writeLineSync(fd, '};');

            //
            // down function: drop table
            //
            GeneratorBase.writeLineSync(fd, 'exports.down = function(knex) {');
            GeneratorBase.writeLineSync(fd, '  return knex.schema');
            GeneratorBase.writeLineSync(fd, `    .dropTable('${tableInfo.name}');`);
            GeneratorBase.writeLineSync(fd, '};');
        });
    }
}