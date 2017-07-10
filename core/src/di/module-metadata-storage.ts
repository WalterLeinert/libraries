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


  /**
   * DI-Boostrap über das Modul @param{mod}.
   *
   * Es wird ein Root-Injector erzeugt mit den Providern
   * - mod
   * - den Komponenten aus declarations
   * - den globalen Modul-Providern (gesammelte Provider alle Module)
   *
   * @template T
   * @param {T} mod
   * @returns {T}
   * @memberof ModuleMetadataStorage
   */
  public bootstrapModule<T>(mod: T): T {
    Assert.notNull(mod);

    const bootstrapMod = this.findModuleMetadata(mod as any as Funktion);
    Assert.notNull(bootstrapMod, `bootstrap: module ${bootstrapMod.name} not registered`);

    const componentProviders = bootstrapMod.declarations.map((item) => item.target);

    if (bootstrapMod.bootstrap) {
      if (componentProviders.indexOf(bootstrapMod.bootstrap.target) < 0) {
        componentProviders.push(bootstrapMod.bootstrap.target);
      }
    }


    const importsFlat = bootstrapMod.getImportsFlat();
    const providersFlat = bootstrapMod.getProvidersFlat();

    // root injector erzeugen über Provider aus
    // - components declarations + bootstrap component
    // - alle import modules
    // - providers des bootstrapModules
    // - providers aller importierten Module
    bootstrapMod.createInjector([
      mod as any,
      ...componentProviders, ,
      importsFlat.map((item) => item.target),
      ...bootstrapMod.providers,
      ...providersFlat
    ]);

    return bootstrapMod.getInstance<T>(mod);
  }

  public static get instance(): ModuleMetadataStorage {
    return ModuleMetadataStorage._instance;
  }

}