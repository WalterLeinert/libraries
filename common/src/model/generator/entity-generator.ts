// -------------------------------------- logging --------------------------------------------
import { using } from '../../base/disposable';
import { levels } from '../../diagnostics/level';
import { getLogger } from '../../diagnostics/logger';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../diagnostics/logger.interface';
import { XLog } from '../../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { Funktion } from '../../base/objectType';
import { IToString } from '../../base/toString.interface';
import { NotSupportedException } from '../../exceptions/notSupportedException';
import { Dictionary } from '../../types/dictionary';
import { Types } from '../../types/types';
import { IFlxEntity } from '../flx-entity.interface';
import { ColumnMetadata } from '../metadata/columnMetadata';
import { MetadataStorage } from '../metadata/metadataStorage'
import { TableMetadata } from '../metadata/tableMetadata';
import { BooleanValueGenerator } from './boolean-value-generator';
import { DateValueGenerator } from './date-value-generator';
import { IEntityGeneratorConfig } from './entity-generator-config.interface';
import { NumberValueGenerator } from './number-value-generator';
import { SequenceGeneratorStrategy } from './sequence-generator-strategy';
import { ShortTimeValueGenerator } from './shortTime-value-generator';
import { StringValueGenerator } from './string-value-generator';
import { TimeValueGenerator } from './time-value-generator';
import { ValueGenerator } from './value-generator';
import { IValueGenerator } from './value-generator.interface';


export class EntityGenerator<T extends IFlxEntity<TId>, TId extends IToString> {
  protected static readonly logger = getLogger(EntityGenerator);

  private config: IEntityGeneratorConfig;
  private valueGeneratorDict: Dictionary<string, IValueGenerator> = new Dictionary<string, IValueGenerator>();

  constructor(
    count: number,
    maxCount: number,
    tableMetadata: TableMetadata,
    idGenerator: ValueGenerator<TId>
  );

  constructor(entityGeneratorConfig: IEntityGeneratorConfig);

  /**
   * Creates an instance of EntityGenerator.
   *
   * @param {number} count
   * @param {IIdGenerator<TId>} _idGenerator
   * @param {TableMetadata} _tableMetadata
   *
   * @memberOf EntityGenerator
   */
  constructor(
    countOrConfig: number | IEntityGeneratorConfig,
    maxCount?: number,
    tableMetadata?: TableMetadata,
    idGenerator?: ValueGenerator<TId>
  ) {

    if (typeof countOrConfig === 'number') {
      this.config = {
        count: countOrConfig,
        maxCount: maxCount,
        idGenerator: idGenerator,
        tableMetadata: tableMetadata,
        columns: {
        }
      }
    } else {
      this.config = countOrConfig;
      if (!Types.isPresent(this.config.maxCount)) {
        this.config.maxCount = this.config.count;
      }
    }


    this.config.tableMetadata.columnMetadata.forEach((metadata) => {
      //
      // für alle Properties, die persistiert werden (asser Id-Property) Value-Generatoren erzeugen
      //
      if (!metadata.options.primary && metadata.options.persisted) {
        const valueGenerator = this.config.columns[metadata.propertyName];

        if (valueGenerator) {
          this.valueGeneratorDict.set(metadata.propertyName, valueGenerator);
        } else {
          this.valueGeneratorDict.set(metadata.propertyName, this.createValueGenerator(metadata, this.config.maxCount));
        }
      }
    });
  }


  /**
   *
   * @param count
   * @param maxCount
   * @param model
   * @param metadataStorage
   * @param idGenerator
   */
  public static create<T extends IFlxEntity<TId>, TId extends IToString>(
    count: number,
    maxCount: number,
    model: Funktion,
    metadataStorage: MetadataStorage,
    idGenerator: ValueGenerator<TId>
  ): EntityGenerator<T, TId> {
    return new EntityGenerator<T, TId>(count, maxCount, metadataStorage.findTableMetadata(model), idGenerator);
  }


  public generate(): T[] {
    return this.createItems(this.config.count);
  }


  public nextId(): TId {
    return this.config.idGenerator.next().value;
  }

  public currentId(): TId {
    return this.config.idGenerator.current();
  }


  public createEntity<T>(): T {
    return this.config.tableMetadata.createEntity<T>();
  }


  /**
   * erzeut ein Array vom Typ @see{T} mit @param{maxItems} Elementen.
   * Die Elementwerte werden anhand des Typs automatisch erzeugt.
   *
   * @param maxItems
   */
  protected createItems(maxItems: number): T[] {
    return using(new XLog(EntityGenerator.logger, levels.INFO, 'createItems'), (log) => {
      const items: T[] = [];
      for (let i = 0; i < maxItems; i++) {
        const item = this.createEntity<T>();

        this.config.tableMetadata.columnMetadata.forEach((metadata) => {
          if (metadata.options.primary) {
            item.id = this.nextId();
          } else if (metadata.options.persisted) {
            const result = this.valueGeneratorDict.get(metadata.propertyName).next();
            item[metadata.propertyName] = result.value;
          }
        });

        items.push(item);
      }

      log.log(`${JSON.stringify(items)}`);

      return items;
    });
  }



  /**
   * erzeugt für die Column-Metadaten @parem{metadata} und @param{count} einen entsprechenden Value-Generator.
   *
   * @private
   * @param {ColumnMetadata} metadata
   * @param {number} count
   * @returns {IValueGenerator}
   *
   * @memberOf EntityGenerator
   */
  private createValueGenerator(metadata: ColumnMetadata, count: number): IValueGenerator {
    let rval: IValueGenerator;

    const strategy = new SequenceGeneratorStrategy(count);

    switch (metadata.propertyType) {
      case 'int':
      case 'integer':
      case 'bigint':
      case 'number':
        rval = new NumberValueGenerator(strategy);
        break;

      case 'float':
      case 'double':
        rval = new NumberValueGenerator(strategy);
        break;

      case 'text':
      case 'string':
        rval = new StringValueGenerator(metadata.propertyName, strategy);
        break;

      case 'boolean':
        rval = new BooleanValueGenerator(strategy);
        break;

      case 'date':
        rval = new DateValueGenerator(strategy);
        break;

      case 'shorttime':
        rval = new ShortTimeValueGenerator(strategy);
        break;

      case 'time':
        rval = new TimeValueGenerator(strategy);
        break;

      default:
        throw new NotSupportedException(`column ${metadata.propertyName}: type ${metadata.propertyType}`);
    }

    return rval;
  }

}