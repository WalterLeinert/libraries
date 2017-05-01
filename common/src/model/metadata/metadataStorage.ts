// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, Clone, Dictionary, Funktion, InvalidOperationException, Types, Utility } from '@fluxgate/core';

import { CompoundValidator } from './../validation/compoundValidator';
import { Validator } from './../validation/validator';

import { ColumnMetadata } from './columnMetadata';
import { EnumMetadata } from './enumMetadata';
import { SpecialColumn } from './specialColumns';
import { TableMetadata } from './tableMetadata';
import { ValidationMetadata } from './validationMetadata';


/**
 * Verwaltet Metadaten zu Modellklassen und Attribute, die über die Decorators
 * @see{Table} oder @see{Column} annotiert wurden.
 *
 * @export
 * @class MetadataStorage
 */
export class MetadataStorage {
  protected static readonly logger = getLogger(MetadataStorage);

  private static _instance = new MetadataStorage();

  private tableValidationDict: Dictionary<string, ValidationMetadata[]> =
  new Dictionary<string, ValidationMetadata[]>();

  private tableColumnDict: Dictionary<string, ColumnMetadata[]> = new Dictionary<string, ColumnMetadata[]>();
  private tableEnumDict: Dictionary<string, Array<EnumMetadata<any, any, any>>> =
  new Dictionary<string, Array<EnumMetadata<any, any, any>>>();
  private tableSpecialColumnDict: Dictionary<string, Dictionary<string, SpecialColumn>> =
  new Dictionary<string, Dictionary<string, SpecialColumn>>();

  private tableDict: Dictionary<string, TableMetadata> = new Dictionary<string, TableMetadata>();
  private dbTableDict: Dictionary<string, TableMetadata> = new Dictionary<string, TableMetadata>();

  /**
   * fügt eine neue {TableMetadata} hinzu.
   *
   * @param {TableMetadata} metadata
   *
   * @memberOf MetadataStorage
   */
  public addTableMetadata(metadata: TableMetadata) {
    Assert.notNull(metadata);

    using(new XLog(MetadataStorage.logger, levels.INFO, 'addTableMetadata', `targetName = ${metadata.target.name}`),
      (log) => {

        const targetName = metadata.target.name;

        if (this.tableDict.containsKey(targetName)) {
          throw new InvalidOperationException(`Table ${targetName} already registered.`);
        }


        const colMetadata: ColumnMetadata[] = this.tableColumnDict.get(targetName);
        const valMetadata: ValidationMetadata[] = this.tableValidationDict.get(targetName);
        const enumMetadata: Array<EnumMetadata<any, any, any>> = this.tableEnumDict.get(targetName);


        //
        // Dictionary (propertyName, ValidationMetadata[]) aufbauen, um
        // anschliessend die Validatoren mit ColumnMetadata verknüpfen zu können
        //
        const propNameToValidator: Dictionary<string, ValidationMetadata[]> =
          new Dictionary<string, ValidationMetadata[]>();

        if (valMetadata) {
          for (const vm of valMetadata) {
            let vms = propNameToValidator[vm.propertyName];
            if (!vms) {
              vms = [];
              propNameToValidator[vm.propertyName] = vms;
            }
            vms.push(vm);
          }
        }

        //
        // Dictionary (propertyName, EnumMetadata[]) aufbauen, um
        // anschliessend die Enums mit ColumnMetadata verknüpfen zu können
        //
        const propNameToEnum: Dictionary<string, EnumMetadata<any, any, any>> =
          new Dictionary<string, EnumMetadata<any, any, any>>();

        if (enumMetadata) {
          for (const enmMeta of enumMetadata) {
            propNameToEnum.set(enmMeta.propertyName, enmMeta);
          }
        }


        if (colMetadata) {

          colMetadata.forEach((item) => {

            // ggf. Enum-Metadaten setzen
            const enmMeta = propNameToEnum.get(item.propertyName);
            if (enmMeta) {
              item.setEnum(enmMeta);
            }

            //
            // Validierung ermitteln und attachen
            //
            const validationMetadatas = propNameToValidator[item.propertyName];


            if (validationMetadatas) {
              let validator: Validator;

              //
              // falls mehrere Validation-Decorators an Modelproperty sind,
              // werden die Validatoren in einen CompoundValidator gekapselt.
              //
              if (validationMetadatas.length > 1) {
                for (const vm of validationMetadatas) {
                  vm.validator.attachColumnMetadata(item);
                }
                const validators = validationMetadatas.map((v) => v.validator);
                validator = new CompoundValidator(validators);
              } else {
                validator = validationMetadatas[0].validator;
              }
              item.setValidation(validator);
            }

            metadata.add(item);
          });

          if (!metadata.primaryKeyColumn) {
            log.info(`Table ${metadata.options.name}: no primary key column`);
          }


          /**
           * nun alle speziellen Columns übernehmen
           */
          if (this.tableSpecialColumnDict.containsKey(targetName)) {
            const dict = this.tableSpecialColumnDict.get(targetName);

            for (const propertyName of dict.keys) {
              metadata.setSpecialColumn(propertyName, dict.get(propertyName));
            }
          }
        }


        //
        // abgeleitete Modelklasse?
        //
        const baseClazz = Types.getBaseClass(metadata.target);

        if (baseClazz && this.tableDict.containsKey(baseClazz.name)) {

          // Metadaten der Basisklasse ermitteln
          const baseTableMetadata = this.tableDict.get(baseClazz.name);

          baseTableMetadata.columnMetadata.forEach((baseCol) => {
            //
            // bei gleichen DB-Spaltennamen müssen die Propertynamen gleich sein!
            //
            const dbCol = metadata.getColumnMetadataByDbCol(baseCol.options.name);
            if (dbCol) {
              Assert.that(dbCol.propertyName === baseCol.propertyName,
                `${metadata.className}/${baseTableMetadata.className}: ` +
                `${dbCol.propertyName}/${baseCol.propertyName} properties must have same name`);
            }

            //
            // bei gleichen Propertynamen bleiben die Properties der abgeleiteten Klasse erhalten;
            // sonst werden die Properties der Basisklasse übernommen
            //
            const col = metadata.getColumnMetadataByProperty(baseCol.propertyName);
            if (!col) {
              metadata.add(Clone.clone(baseCol));
            }

          });
        }


        this.tableDict.set(targetName, metadata);
        this.dbTableDict.set(metadata.options.name, metadata);
      });
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

    const targetName = metadata.target.name;
    let colMetadata: ColumnMetadata[] = this.tableColumnDict.get(targetName);
    if (!colMetadata) {
      colMetadata = [];
      this.tableColumnDict.set(targetName, colMetadata);
    }
    colMetadata.push(metadata);
  }


  public setSpecialColumn(target: Funktion, propertyName: string, key: SpecialColumn) {
    let dict: Dictionary<string, SpecialColumn>;

    if (!this.tableSpecialColumnDict.containsKey(target.name)) {
      dict = new Dictionary<string, SpecialColumn>();
      this.tableSpecialColumnDict.set(target.name, dict);
    } else {
      dict = this.tableSpecialColumnDict.get(target.name);
    }

    dict.set(propertyName, key);
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

    const targetName = metadata.target.name;
    let valMetadata: ValidationMetadata[] = this.tableValidationDict.get(targetName);
    if (!valMetadata) {
      valMetadata = [];
      this.tableValidationDict.set(targetName, valMetadata);
    }
    valMetadata.push(metadata);
  }

  public addEnumMetadata<T, TText, TId>(metadata: EnumMetadata<T, TText, TId>) {
    Assert.notNull(metadata);

    const targetName = metadata.target.name;
    let enumMetadata: Array<EnumMetadata<any, any, any>> = this.tableEnumDict.get(targetName);
    if (!enumMetadata) {
      enumMetadata = [];
      this.tableEnumDict.set(targetName, enumMetadata);
    }
    enumMetadata.push(metadata);
  }


  /**
   * Liefert für das angegebene @param{target} (z.B. Modellklasse 'Artikel') die Metadaten oder null.
   *
   * @param {Function} target
   * @returns {TableMetadata}
   *
   * @memberOf MetadataStorage
   */
  public findTableMetadata(target: Funktion | string): TableMetadata {
    Assert.notNull(target);
    if (Types.isString(target)) {
      return this.tableDict.get(target as string);
    }
    Assert.that(Types.isFunction(target));

    return this.tableDict.get((target as Funktion).name);
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
    return this.dbTableDict.get(tableName);
  }


  public dump() {
    using(new XLog(MetadataStorage.logger, levels.INFO, 'dump'), (log) => {
      for (const name in this.tableDict.keys) {
        if (name) {
          const table = this.tableDict.get(name);

          log.log('\n');
          log.log(`${table.options.name}, ${table.target}`);

          table.columnMetadata.forEach((col) => {
            log.log(`  ${col.propertyName}/${col.options.name}: ${col.propertyType}`);
          });
        }
      }
    });
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