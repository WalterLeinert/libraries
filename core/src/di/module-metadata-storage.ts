import { Provider, ReflectiveInjector } from 'injection-js';


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
  private _bootstrapModule: ModuleMetadata;

  private constructor() {
  }


  public addModuleMetadata(metadata: ModuleMetadata) {
    Assert.notNull(metadata);

    const targetName = metadata.target.name;

    if (this.moduleDict.containsKey(targetName)) {
      throw new InvalidOperationException(`Module ${targetName} already registered.`);
    }

    if (metadata.options.bootstrap) {
      this._bootstrapModule = metadata;
    }

    this.moduleDict.set(targetName, metadata);
  }



  public addComponentMetadataMetadata(metadata: ComponentMetadata) {
    Assert.notNull(metadata);

    const targetName = metadata.target.name;

    Assert.that(!this.componentDict.containsKey(targetName), `component ${targetName} already registered`);
    this.componentDict.set(targetName, metadata);
  }


  public findModuleMetadata(target: Funktion): ModuleMetadata {
    return this.moduleDict.get(Metadata.getTargetName(target));
  }

  public findComponentMetadata(target: Funktion): ComponentMetadata {
    return this.componentDict.get(Metadata.getTargetName(target));
  }


  public bootstrapModule<T>(mod: T): T {
    Assert.notNull(mod);

    const bootstrapMod = this.findModuleMetadata(mod as any as Funktion);
    Assert.notNull(bootstrapMod, `bootstrap: module ${bootstrapMod.name} not registered`);

    const componentProviders = bootstrapMod.declarations.map((item) => item.target);
    if (componentProviders.indexOf(bootstrapMod.bootstrap.target) < 0) {
      componentProviders.push(bootstrapMod.bootstrap.target);
    }

    // root injector erzeugen über Provider aus
    // - components declarations + bootstrap component
    // - providers
    bootstrapMod.createInjector([
      mod as any,
      ...componentProviders,
      ...bootstrapMod.providers
    ]);

    return bootstrapMod.getInstance<T>(bootstrapMod.bootstrap.target);
  }

  public static get instance(): ModuleMetadataStorage {
    return ModuleMetadataStorage._instance;
  }

}