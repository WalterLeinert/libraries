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
  // private classPropertyDict: Dictionary<string, PropertyConverterMetadata[]> =
  // new Dictionary<string, PropertyConverterMetadata[]>();

  public static get instance(): ConverterMetadataStorage {
    return ConverterMetadataStorage._instance;
  }

  public addClassConverterMetadata(metadata: ClassConverterMetadata) {
    Assert.notNull(metadata);

    using(new XLog(ConverterMetadataStorage.logger, levels.INFO, 'addClassMetadata'), (log) => {
      log.info(`metadata = ${metadata.name}`);

      //
      // falls bereits PropertyConverter registriert wurden, existieren an dieser Stelle bereits
      // ClassConverter-Metadaten
      //
      let classConverterMetadata: ClassConverterMetadata = metadata;
      if (this.classDict.containsKey(metadata.name)) {
        classConverterMetadata = this.classDict.get(metadata.name);
        classConverterMetadata.setConverterKey(metadata.key);
      } else {

        //
        // falls noch kein ClassConverter registriert ist, existiert nur ein Class-Decorator und
        // keine Property-Decorators
        //
        this.classDict.set(metadata.name, metadata);
      }
    });
  }



  public addPropertyConverterMetadata(propertyMetadata: PropertyConverterMetadata) {
    Assert.notNull(propertyMetadata);

    using(new XLog(ConverterMetadataStorage.logger, levels.INFO, 'addPropertyMetadata'), (log) => {
      log.info(`propertyMetadata: target.constructor = ${propertyMetadata.target.constructor.name}, ` +
        `propertyName = ${propertyMetadata.name}`);

      let classConverterMetadata: ClassConverterMetadata;
      if (!this.classDict.containsKey(propertyMetadata.target.constructor.name)) {
        classConverterMetadata = new ClassConverterMetadata(propertyMetadata.target.constructor, undefined);
        this.addClassConverterMetadata(classConverterMetadata);
      } else {
        classConverterMetadata = this.classDict.get(propertyMetadata.target.constructor.name);
      }

      classConverterMetadata.add(propertyMetadata);
    });
  }


  public findClassConverterMetadata(target: Funktion | string): ClassConverterMetadata {
    Assert.notNull(target);
    if (Types.isString(target)) {
      return this.classDict.get(target as string);
    }
    Assert.that(Types.isFunction(target));

    return this.classDict.get((target as Funktion).name);
  }
}