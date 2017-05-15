import { using } from '../../base/disposable';
import { levels } from '../../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../diagnostics/logger.interface';
import { getLogger } from '../../diagnostics/logging-core';
import { XLog } from '../../diagnostics/xlog';


import { Funktion } from '../../base/objectType';
import { ExceptionFactory } from '../../exceptions/exceptionFactory';
import { InvalidOperationException } from '../../exceptions/invalidOperationException';
import { Dictionary } from '../../types/dictionary';
import { Types } from '../../types/types';
import { Assert } from '../../util/assert';
import { ClassSerializerMetadata } from './class-serializer-metadata';
import { PropertySerializerMetadata } from './property-serializer-metadata';


export class SerializerMetadataStorage {
  protected static readonly logger = getLogger(SerializerMetadataStorage);

  private static _instance = new SerializerMetadataStorage();

  private classDict: Dictionary<string, ClassSerializerMetadata> = new Dictionary<string, ClassSerializerMetadata>();
  private classPropertyDict: Dictionary<string, PropertySerializerMetadata[]> =
  new Dictionary<string, PropertySerializerMetadata[]>();

  public static get instance(): SerializerMetadataStorage {
    return SerializerMetadataStorage._instance;
  }


  constructor() {
    for (let exc of ExceptionFactory.exceptions) {
      this.addClassMetadata(new ClassSerializerMetadata(exc));
    }

    this.addClassMetadata(new ClassSerializerMetadata(Error));
  }

  public addClassMetadata(metadata: ClassSerializerMetadata) {
    Assert.notNull(metadata);

    using(new XLog(SerializerMetadataStorage.logger, levels.INFO, 'addClassMetadata'), (log) => {
      log.info(`metadata = ${metadata.name}`);

      if (this.classDict.containsKey(metadata.name)) {
        throw new InvalidOperationException(`Class ${metadata.name} already registered.`);
      }

      const propertyMetadata: PropertySerializerMetadata[] = this.classPropertyDict.get(metadata.name);

      const propertyDict: Dictionary<string, PropertySerializerMetadata> =
        new Dictionary<string, PropertySerializerMetadata>();

      if (propertyMetadata) {

        propertyMetadata.forEach((item) => {
          metadata.add(item);
          propertyDict.set(item.name, item);
        });
      }

      //
      // default: alle weiteren nicht dekorierten Properties hinzufügen
      //
      const prototype = (metadata.target as any).prototype;

      const targetProperties = Reflect.ownKeys(prototype);
      targetProperties.forEach((prop) => {
        const pd = Reflect.getOwnPropertyDescriptor(prototype, prop);

        log.debug(`prop = ${prop}, pd = ${JSON.stringify(pd)}`);

        if (!propertyDict.containsKey(prop.toString())) {
          metadata.add(new PropertySerializerMetadata(metadata.target, prop.toString(),  true));
        }
      });

      this.classDict.set(metadata.name, metadata);
    });
  }



  public addPropertyMetadata(propertyMetadata: PropertySerializerMetadata) {
    Assert.notNull(propertyMetadata);

    using(new XLog(SerializerMetadataStorage.logger, levels.INFO, 'addPropertyMetadata'), (log) => {
      log.info(`propertyMetadata: target.constructor = ${propertyMetadata.target.constructor.name}, ` +
        `propertyName = ${propertyMetadata.name}`);

      const className = propertyMetadata.target.constructor.name;
      let metadata: PropertySerializerMetadata[] = this.classPropertyDict.get(className);
      if (!metadata) {
        metadata = [];
        this.classPropertyDict.set(className, metadata);
      }
      metadata.push(propertyMetadata);
    });
  }


  public findClassMetadata(target: Funktion | string): ClassSerializerMetadata {
    Assert.notNull(target);
    if (Types.isString(target)) {
      return this.classDict.get(target as string);
    }
    Assert.that(Types.isFunction(target));

    return this.classDict.get((target as Funktion).name);
  }
}