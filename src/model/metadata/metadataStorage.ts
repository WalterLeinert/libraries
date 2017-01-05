import { Assert } from '../../util/assert';
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

    private tableColumnDict: { [name: string]: ColumnMetadata[] } = {};
    private tableDict: { [name: string]: TableMetadata } = {};

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

            colMetadata.forEach(item => {
                metadata.add(item);            
            })

            if (!metadata.primaryKeyColumn) {
                console.info(`Table ${metadata.options.name}: no primary key column`);
            }

            this.tableDict[targetName] = metadata;
        }
    }


    /**
     * Fügt eine neue {ColumnMetadata} hinzu.
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
        colMetadata.push(metadata)
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


    public dump() {
        for (let name in this.tableDict) {
            let table = this.tableDict[name];

            console.log();
            console.log(`${table.options.name}, ${table.target}`);

            table.columnMetadata.forEach(col => {
                console.log(`  ${col.propertyName}/${col.options.name}: ${col.propertyType}`);
            })
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