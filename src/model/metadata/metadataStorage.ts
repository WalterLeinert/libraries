import { Assert } from '../../util/assert';
import { CompoundValidator, Validator } from './../validation';
import { ValidationMetadata } from './validationMetadata';
import { TableMetadata } from './tableMetadata';
import { ColumnMetadata } from './columnMetadata';

/**
 * Verwaltet Metadaten zu Modellklassen und Attribute, die über die Decorators
 * @see{Table} oder @see{Column} annotiert wurden.
 * 
 * @export
 * @class MetadataStorage
 */
export class MetadataStorage {
    private static _instance = new MetadataStorage();

    private tableValidationDict: { [name: string]: ValidationMetadata[] } = {};
    private tableColumnDict: { [name: string]: ColumnMetadata[] } = {};

    private tableDict: { [name: string]: TableMetadata } = {};
    private dbTableDict: { [name: string]: TableMetadata } = {};

    /**
     * fügt eine neue {TableMetadata} hinzu.
     * 
     * @param {TableMetadata} metadata
     * 
     * @memberOf MetadataStorage
     */
    public addTableMetadata(metadata: TableMetadata) {
        Assert.notNull(metadata);

        let targetName = metadata.target.name;

        if (!this.tableDict[targetName]) {
            let colMetadata: ColumnMetadata[] = this.tableColumnDict[targetName];
            let valMetadata = this.tableValidationDict[targetName];


            //
            // Dictionary (propertyName, ValidationMetadata[]) aufbauen, um
            // anschliessend die Validatoren mit ColumnMetadata verknüpfen zu können
            //
            let propNameToValidator: { [name: string]: ValidationMetadata[] } = {};

            if (valMetadata) {
                for (let vm of valMetadata) {
                    let vms = propNameToValidator[vm.propertyName];
                    if (!vms) {
                        vms = [];
                        propNameToValidator[vm.propertyName] = vms;
                    }
                    vms.push(vm);
                }
            }


            colMetadata.forEach(item => {

                //
                // Validierung ermitteln und attachen
                //
                let validationMetadatas = propNameToValidator[item.propertyName];


                if (validationMetadatas) {
                    let validator: Validator;

                    //
                    // falls mehrere Validation-Decorators an Modelproperty sind,
                    // werden die Validatoren in einen CompoundValidator gekapselt.
                    //
                    if (validationMetadatas.length > 1) {
                        for (let vm of validationMetadatas) {
                            vm.validator.attachColumnMetadata(item);
                        }
                        let validators = validationMetadatas.map(v => v.validator);
                        validator = new CompoundValidator(validators);
                    } else {
                        validator = validationMetadatas[0].validator;
                    }
                    validator.attachColumnMetadata(item);
                    item.setValidation(validator);
                }

                metadata.add(item);
            });

            if (!metadata.primaryKeyColumn) {
                // tslint:disable-next-line:no-console
                console.info(`Table ${metadata.options.name}: no primary key column`);
            }

            this.tableDict[targetName] = metadata;
            this.dbTableDict[metadata.options.name] = metadata;
        }

    }


    /**
     * Fügt eine neue @see{ColumnMetadata} hinzu.
     * 
     * @param {ColumnMetadata} metadata
     * 
     * @memberOf MetadataStorage
     */
    public addColumnMetadata(metadata: ColumnMetadata) {
        Assert.notNull(metadata);

        let targetName = metadata.target.name;
        let colMetadata: ColumnMetadata[] = this.tableColumnDict[targetName];
        if (!colMetadata) {
            colMetadata = [];
            this.tableColumnDict[targetName] = colMetadata;
        }
        colMetadata.push(metadata);
    }


    /**
     * Fügt eine neue @see{validationMetadata} hinzu.
     * 
     * @param {ValidationMetadata} metadata
     * 
     * @memberOf MetadataStorage
     */
    public addValidationMetadata(metadata: ValidationMetadata) {
        Assert.notNull(metadata);

        let targetName = metadata.target.name;
        let valMetadata: ValidationMetadata[] = this.tableValidationDict[targetName];
        if (!valMetadata) {
            valMetadata = [];
            this.tableValidationDict[targetName] = valMetadata;
        }
        valMetadata.push(metadata);
    }


    /**
     * Liefert für das angegebene @param{target} (z.B. Modellklasse 'Artikel') die Metadaten oder null.
     * 
     * @param {Function} target
     * @returns {TableMetadata}
     * 
     * @memberOf MetadataStorage
     */
    public findTableMetadata(target: Function): TableMetadata;
    public findTableMetadata(target: string): TableMetadata;

    public findTableMetadata(target: Function | string): TableMetadata {
        Assert.notNull(target);
        if (typeof (target) === 'string') {
            return this.tableDict[target];
        }
        return this.tableDict[target.name];
    }

    /**
     * Liefert für den angegebenen Tabellennamen @param{tableName} (z.B. Modellklasse 'Artikel' -> 'artikel')
     * die Metadaten oder null.
     * 
     * @param {string} tableName
     * @returns {TableMetadata}
     * 
     * @memberOf MetadataStorage
     */
    public findTableMetadataByDbTable(tableName: string): TableMetadata {
        Assert.notNullOrEmpty(tableName);
        return this.dbTableDict[tableName];
    }


    public dump() {
        for (let name in this.tableDict) {
            if (name) {
                let table = this.tableDict[name];

                console.log();
                console.log(`${table.options.name}, ${table.target}`);

                table.columnMetadata.forEach(col => {
                    console.log(`  ${col.propertyName}/${col.options.name}: ${col.propertyType}`);
                });
            }
        }
    }


    /**
     * Liefert die Singleton-Instanz.
     * 
     * @readonly
     * @static
     * @type {MetadataStorage}
     * @memberOf MetadataStorage
     */
    public static get instance(): MetadataStorage {
        return MetadataStorage._instance;
    }

}