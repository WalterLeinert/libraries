// Nodejs imports
import * as fs from 'fs';
import * as path from 'path';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { IConfigInfo } from './configInfo';
import { GeneratorBase } from './generatorBase';
import { TableInfo } from './tableInfo';

export class KnexGenerator extends GeneratorBase {
  protected static logger = getLogger(KnexGenerator);

  constructor(protected outputDir: string, protected configInfo: IConfigInfo) {
    super(outputDir, configInfo);
  }

  public generateFiles(tableInfos: TableInfo[]) {
    using(new XLog(KnexGenerator.logger, levels.INFO, 'generateFiles'), (log) => {
      for (const tableInfo of tableInfos) {
        const tableName = tableInfo.name;

        const filePath = path.join(this.outputDir, tableName + '.ts');

        fs.open(filePath, 'w', (err, fd) => {
          if (err) {
            if (err.code === 'EEXIST') {
              log.info('overwriting file %s', filePath);
            } else {
              throw err;
            }
          }

          this.dumpHeader(fd);
          this.dumpCreateTable(fd, tableInfo);

          fs.close(fd, (exc) => {
            if (exc) {
              throw exc;
            }
          });
        });
      }
    });
  }

  // tslint:disable-next-line:no-empty
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

      for (const colInfo of tableInfo.columns) {
        // WL: nur für pks
        if (colInfo.isPrimaryKey) {
          GeneratorBase.writeLineSync(fd, `      table.increments('${colInfo.name}').primary();`);
        } else {
          const type = GeneratorBase.mapDataType(colInfo.type);
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