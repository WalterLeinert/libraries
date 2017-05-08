import { using } from '../../base/disposable';
import { levels } from '../../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../diagnostics/logger.interface';
import { getLogger } from '../../diagnostics/logging-core';
import { XLog } from '../../diagnostics/xlog';


import { Funktion } from '../../base/objectType';
import { InvalidOperationException } from '../../exceptions/invalidOperationException';
import { Dictionary } from '../../types/dictionary';
import { Types } from '../../types/types';
import { Assert } from '../../util/assert';
import { ClassConverterMetadata } from './class-converter-metadata';
import { PropertyConverterMetadata } from './property-converter-metadata';


export class ConverterMetadataStorage {
  protected static readonly logger = getLogger(ConverterMetadataStorage);

  private static _instance = new ConverterMetadataStorage();

  private classDict: Dictionary<string, ClassConverterMetadata> = new Dictionary<string, ClassConverterMetadata>();
  private classPropertyDict: Dictionary<string, PropertyConverterMetadata[]> =
  new Dictionary<string, PropertyConverterMetadata[]>();

  public static get instance(): ConverterMetadataStorage {
    return ConverterMetadataStorage._instance;
  }

  public addClassConverterMetadata(metadata: ClassConverterMetadata) {
    Assert.notNull(metadata);

    using(new XLog(ConverterMetadataStorage.logger, levels.INFO, 'addClassMetadata'), (log) => {
      log.info(`metadata = ${metadata.name}`);

      if (this.classDict.containsKey(metadata.name)) {
        throw new InvalidOperationException(`Class ${metadata.name} already registered.`);
      }

      const propertyMetadata: PropertyConverterMetadata[] = this.classPropertyDict.get(metadata.name);

      if (propertyMetadata) {

        propertyMetadata.forEach((item) => {
          metadata.add(item);
        });
      }


      const targetProperties = Reflect.ownKeys(metadata.target);
      targetProperties.forEach((prop) => {
        const pd = Reflect.getOwnPropertyDescriptor(metadata.target, prop);
      });

      // TODO: alle weiteren nicht dekorierten Properties hinzufügen

      this.classDict.set(metadata.name, metadata);
    });
  }



  public addPropertyConverterMetadata(propertyMetadata: PropertyConverterMetadata) {
    Assert.notNull(propertyMetadata);

    using(new XLog(ConverterMetadataStorage.logger, levels.INFO, 'addPropertyMetadata'), (log) => {
      log.info(`propertyMetadata: target.constructor = ${propertyMetadata.target.constructor.name}, ` +
        `propertyName = ${propertyMetadata.name}`);

      const className = propertyMetadata.target.constructor.name;
      let metadata: PropertyConverterMetadata[] = this.classPropertyDict.get(className);
      if (!metadata) {
        metadata = [];
        this.classPropertyDict.set(className, metadata);
      }
      metadata.push(propertyMetadata);
    });
  }


  public findClassMetadata(target: Funktion | string): ClassConverterMetadata {
    Assert.notNull(target);
    if (Types.isString(target)) {
      return this.classDict.get(target as string);
    }
    Assert.that(Types.isFunction(target));

    return this.classDict.get((target as Funktion).name);
  }
}