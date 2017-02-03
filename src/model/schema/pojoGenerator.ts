// Nodejs imports
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

// -------------------------- logging -------------------------------
import { using, XLog } from 'enter-exit-logger';
import { configure, getLogger, levels, Logger } from 'log4js';
// -------------------------- logging -------------------------------

import { StringBuilder } from '@fluxgate/common';

import { ColumnInfo, DataType } from './columnInfo';
import { IConfigInfo } from './configInfo';
import { IGenerator } from './generator.interface';
import { GeneratorBase } from './generatorBase';
import { TableInfo } from './tableInfo';

export class PojoGenerator extends GeneratorBase {
    protected static logger = getLogger('PojoGenerator');

    constructor(outputDir: string, configInfo: IConfigInfo) {
        super(outputDir, configInfo);
    }

    public generateFiles(tableInfos: TableInfo[]) {
        using(new XLog(PojoGenerator.logger, levels.INFO, 'generateFiles'), (log) => {
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
                    this.dumpTableHeader(fd, tableInfo);

                    const dumpInterface = false;
                    if (dumpInterface) {
                        this.dumpInterface(fd, tableInfo);
                    }
                    this.dumpClass(fd, tableInfo, dumpInterface);

                    fs.close(fd, (exc) => {
                        if (exc) {
                            throw exc;
                        }
                    });
                });
            }

            this.generateIndex(tableInfos);
        });
    }

 
    // tslint:disable-next-line:no-empty
    public generateFile(fileName: string, tableInfos: TableInfo[]) {
    }

    
    /**
     * erzeugt eine Indexdatei, die alle Modellklassen exportiert
     * 
     * @private
     * @param {TableInfo[]} tableInfos
     * 
     * @memberOf PojoGenerator
     */
    private generateIndex(tableInfos: TableInfo[]) {
        using(new XLog(PojoGenerator.logger, levels.INFO, 'generateIndex'), (log) => {
            const filePath = path.join(this.outputDir, 'index.ts');

            fs.open(filePath, 'w', (err, fd) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        log.info('overwriting file %s', filePath);
                    } else {
                        throw err;
                    }
                }

                for (const tableInfo of tableInfos) {
                    const tableName = tableInfo.name;
                    GeneratorBase.writeLineSync(fd, `export * from './${tableName}';`);
                }
            });
        });
    }
    

    /**
     * Erzeugt einen Tabellenheader
     * 
     * @private
     * @param {any} fd
     * @param {TableInfo} info
     * 
     * @memberOf PojoGenerator
     */
    private dumpTableHeader(fd, info: TableInfo) {
        GeneratorBase.writeCommentline(fd);
        GeneratorBase.writeLineSync(fd, '// Tabelle ' + info.name);
        GeneratorBase.writeCommentline(fd);

        GeneratorBase.writeLineSync(fd);
        GeneratorBase.writeLineSync(fd, 'import { Table, Column } from \'@fluxgate/common\';');
        GeneratorBase.writeLineSync(fd);

        // GeneratorBase.writeLineSync(fd, "import { ITableInfo, TableInfo } from './tableInfo';");
        // GeneratorBase.writeLineSync(fd);
    }

    /**
     * erzeugt eine Interfacedefinition für eine Modellklasse
     * 
     * @private
     * @param {number} fd
     * @param {TableInfo} info
     * 
     * @memberOf PojoGenerator
     */
    private dumpInterface(fd: number, info: TableInfo): void {
        using(new XLog(PojoGenerator.logger, levels.DEBUG, 'dumpInterface', 'table = ', info.name), (log) => {
            GeneratorBase.writeLineSync(fd, `export interface ${GeneratorBase.getInterfaceName(info)} {`);

            for (const colInfo of info.columns) {
                const colName = this.stripPrefix(colInfo.name, info.name + '_');

                const sb = new StringBuilder();
                sb.append('  ');
                sb.append(colName + (colInfo.isNullable ? '?' : ''));
                sb.append(': ');
                sb.append(GeneratorBase.mapDataType(colInfo.type));
                sb.append(';');

                if (colInfo.isPrimaryKey || colInfo.hasAutoIncrement) {
                    sb.append('    // ');

                    if (colInfo.isPrimaryKey) {
                        sb.append('primaryKey');
                        if (colInfo.hasAutoIncrement) {
                            sb.append(', ');
                        }
                    }
                    if (colInfo.hasAutoIncrement) {
                        sb.append('autoincrement');
                    }
                }

                GeneratorBase.writeLineSync(fd, sb.toString());
            }
            GeneratorBase.writeLineSync(fd, '}');
        });
    }

    /**
     * Erzeugt eine Modellklasse
     * 
     * @private
     * @param {number} fd
     * @param {TableInfo} info
     * @param {boolean} dumpInterface
     * 
     * @memberOf PojoGenerator
     */
    private dumpClass(fd: number, info: TableInfo, dumpInterface: boolean): void {
        using(new XLog(PojoGenerator.logger, levels.DEBUG, 'dumpClass', 'table = ', info.name), (log) => {
            const tableName = GeneratorBase.capitalizeFirstLetter(info.name);

            GeneratorBase.writeLineSync(fd);
            GeneratorBase.writeLineSync(fd, `@Table({ name: '${info.name}' })`);
            const sb = new StringBuilder();
            sb.append(`export class ${GeneratorBase.getClassName(info)}`);

            if (dumpInterface) {
                sb.append(` implements ${GeneratorBase.getInterfaceName(info)}`);
            }
            sb.append(' {');
            GeneratorBase.writeLineSync(fd, sb.toString());

            for (const colInfo of info.columns) {
                GeneratorBase.writeLineSync(fd);
                this.dumpColumnDecorator(fd, colInfo);

                const colName = this.stripPrefix(colInfo.name, info.name + '_');

                GeneratorBase.writeLineSync(fd, '  public ' + colName + (colInfo.isNullable ? '?' : '') + ': '
                    + GeneratorBase.mapDataType(colInfo.type) + GeneratorBase.formatDefaultValue(colInfo) + ';');
            }

            // this.dumpDeserialization(fd, info);

            GeneratorBase.writeLineSync(fd, '}');
        });
    }

    /**
     * Entfernt vom Text @path{text} den Stringpräfix @param{prefix}
     * 
     * @private
     * @param {string} text
     * @param {string} prefix
     * @returns
     * 
     * @memberOf PojoGenerator
     */
    private stripPrefix(text: string, prefix: string) {
        if (text.startsWith(prefix)) {
            text = text.substr(prefix.length);
        }
        return text;
    }


    /**
     * Erzeugt einen @Column-Decorator für die Spalte @param{column}
     * 
     * @private
     * @param {number} fd
     * @param {ColumnInfo} colInfo
     * 
     * @memberOf PojoGenerator
     */
    private dumpColumnDecorator(fd: number, colInfo: ColumnInfo) {
        const sb = new StringBuilder();
        sb.append('  @Column({ ');
        sb.append(`name: '${colInfo.name}'`);
        if (colInfo.isPrimaryKey) {
            sb.append(`, primary: true`);
        }
        if (colInfo.isNullable) {
            sb.append(`, nullable: true`);
        }
        if (colInfo.hasAutoIncrement) {
            sb.append(`, generated: true`);
        }

        switch (colInfo.type) {
            case DataType.Date:
                sb.append(`, propertyType: 'date'`);
                break;
            default:
                break;
        }

        sb.append(' })');

        GeneratorBase.writeLineSync(fd, sb.toString());
    }

    /**
     * 
     * 
     * @private
     * @param {number} fd
     * @param {TableInfo} info
     * 
     * @memberOf PojoGenerator
     */
    private dumpDeserialization(fd: number, info: TableInfo) {
        GeneratorBase.writeLineSync(fd);
        GeneratorBase.writeLineSync(fd, '  //');
        GeneratorBase.writeLineSync(fd, '  // Deserialisierung aus Json: Behandlung von speziellen Spaltentypen');
        GeneratorBase.writeLineSync(fd, '  //');
        GeneratorBase.writeLineSync(fd, `  public static deserialize(json: any):` +
            ` ${GeneratorBase.getClassName(info)} {`);
        GeneratorBase.writeLineSync(fd, `    let rval = new ${GeneratorBase.getClassName(info)}();`);

        for (const colInfo of info.columns) {
            switch (colInfo.type) {
                case DataType.Date:
                    GeneratorBase.writeLineSync(fd, `    rval.${colInfo.name} = new Date(json.${colInfo.name});`);
                    break;
                case DataType.String:
                    GeneratorBase.writeLineSync(fd, `    rval.${colInfo.name} = json.${colInfo.name};`);
                    break;
                case DataType.Number:
                    GeneratorBase.writeLineSync(fd, `    rval.${colInfo.name} = json.${colInfo.name};`);
                    break;
                default:
                    throw new Error(`Invalid type ${colInfo.type}`);
            }
        }
        GeneratorBase.writeLineSync(fd, '    return rval;');
        GeneratorBase.writeLineSync(fd, '  }');
    }

}