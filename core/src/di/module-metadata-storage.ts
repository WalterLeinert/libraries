import { Funktion } from '../base/objectType';
import { InvalidOperationException } from '../exceptions/invalidOperationException';
import { Metadata } from '../metadata/metadata';
import { Dictionary } from '../types/dictionary';
import { Assert } from '../util/assert';

import { ComponentMetadata } from './component-metadata';
import { ModuleMetadata } from './module-metadata';

export class ModuleMetadataStorage {
  private static _instance = new ModuleMetadataStorage();

  private moduleDict: Dictionary<string, ModuleMetadata> = new Dictionary<string, ModuleMetadata>();

  private componentDict: Dictionary<string, ComponentMetadata> = new Dictionary<string, ComponentMetadata>();


  private constructor() {
  }


  public addModuleMetadata(metadata: ModuleMetadata) {
    Assert.notNull(metadata);

    const targetName = metadata.target.name;

    if (this.moduleDict.containsKey(targetName)) {
      throw new InvalidOperationException(`Module ${targetName} already registered.`);
    }

    this.moduleDict.set(targetName, metadata);
  }



  public addComponentMetadataMetadata(metadata: ComponentMetadata) {
    Assert.notNull(metadata);

    const targetName = metadata.target.name;

    Assert.that(!this.componentDict.containsKey(targetName), `component ${targetName} already registered`);
    this.componentDict.set(targetName, metadata);
  }


  public findModuleMetadata(target: string | Funktion): ModuleMetadata {
    return this.moduleDict.get(Metadata.getTargetName(target));
  }

  public findComponentMetadata(target: string | Funktion): ComponentMetadata {
    return this.componentDict.get(Metadata.getTargetName(target));
  }

  public static get instance(): ModuleMetadataStorage {
    return ModuleMetadataStorage._instance;
  }

}