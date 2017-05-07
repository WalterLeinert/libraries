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
import { ClassMetadata } from './class-metadata';
import { PropertyMetadata } from './property-metadata';


export class SerializerMetadataStorage {
  protected static readonly logger = getLogger(SerializerMetadataStorage);

  private static _instance = new SerializerMetadataStorage();

  private classDict: Dictionary<string, ClassMetadata> = new Dictionary<string, ClassMetadata>();
  private classPropertyDict: Dictionary<string, PropertyMetadata[]> = new Dictionary<string, PropertyMetadata[]>();

  public static get instance(): SerializerMetadataStorage {
    return SerializerMetadataStorage._instance;
  }

  public addClassMetadata(metadata: ClassMetadata) {
    Assert.notNull(metadata);

    using(new XLog(SerializerMetadataStorage.logger, levels.INFO, 'addClassMetadata'), (log) => {
      log.info(`metadata = ${metadata.name}`);

      if (this.classDict.containsKey(metadata.name)) {
        throw new InvalidOperationException(`Class ${metadata.name} already registered.`);
      }

      const propertyMetadata: PropertyMetadata[] = this.classPropertyDict.get(metadata.name);

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



  public addPropertyMetadata(propertyMetadata: PropertyMetadata) {
    Assert.notNull(propertyMetadata);

    using(new XLog(SerializerMetadataStorage.logger, levels.INFO, 'addPropertyMetadata'), (log) => {
      log.info(`propertyMetadata: target.constructor = ${propertyMetadata.target.constructor.name}, ` +
        `propertyName = ${propertyMetadata.name}`);

      const className = propertyMetadata.target.constructor.name;
      let metadata: PropertyMetadata[] = this.classPropertyDict.get(className);
      if (!metadata) {
        metadata = [];
        this.classPropertyDict.set(className, metadata);
      }
      metadata.push(propertyMetadata);
    });
  }


  public findClassMetadata(target: Funktion | string): ClassMetadata {
    Assert.notNull(target);
    if (Types.isString(target)) {
      return this.classDict.get(target as string);
    }
    Assert.that(Types.isFunction(target));

    return this.classDict.get((target as Funktion).name);
  }
}