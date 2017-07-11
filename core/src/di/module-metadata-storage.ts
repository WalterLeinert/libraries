import { Injector, Provider, ReflectiveInjector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------

import { Assertion } from '../base/assertion';
import { Funktion } from '../base/objectType';
import { Metadata } from '../metadata/metadata';
import { Dictionary } from '../types/dictionary';

import { ComponentMetadata } from './component-metadata';
import { ModuleMetadata } from './module-metadata';


/**
 * Hält die DI-Metadaten für Module und Komponenten
 *
 * @export
 * @class ModuleMetadataStorage
 */
export class ModuleMetadataStorage {
  protected static readonly logger = getLogger(ModuleMetadataStorage);

  private static _instance = new ModuleMetadataStorage();

  private moduleDict: Dictionary<Funktion, ModuleMetadata> = new Dictionary<Funktion, ModuleMetadata>();
  private componentDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private _bootstrapModule: ModuleMetadata;

  private constructor() {
  }


  /**
   * Fügt neue Modul-Metadaten @param{metadata} hinzu.
   *
   * @param {ModuleMetadata} metadata
   * @memberof ModuleMetadataStorage
   */
  public addModuleMetadata(metadata: ModuleMetadata) {
    Assertion.notNull(metadata);

    using(new XLog(ModuleMetadataStorage.logger, levels.DEBUG, 'addModuleMetadata',
      `targetName = ${metadata.targetName}`), (log) => {
        Assertion.that(!this.moduleDict.containsKey(metadata.target),
          `Module ${metadata.targetName} already registered.`);

        if (metadata.options.bootstrap) {
          this._bootstrapModule = metadata;
        }

        this.moduleDict.set(metadata.target, metadata);
      });
  }


  /**
   * Fügt neue Komponenten-Metadaten @param{metadata} hinzu.
   *
   * @param {ComponentMetadata} metadata
   * @memberof ModuleMetadataStorage
   */
  public addComponentMetadata(metadata: ComponentMetadata) {
    using(new XLog(ModuleMetadataStorage.logger, levels.DEBUG, 'addComponentMetadata',
      `targetName = ${metadata.targetName}`), (log) => {
        Assertion.notNull(metadata);

        Assertion.that(!this.componentDict.containsKey(metadata.target),
          `component ${metadata.targetName} already registered`);
        this.componentDict.set(metadata.target, metadata);
      });
  }

  /**
   * Liefert die Metaten für das Modul @param{module}
   *
   * @param {Funktion} target
   * @returns {ModuleMetadata}
   * @memberof ModuleMetadataStorage
   */
  public findModuleMetadata(module: Funktion): ModuleMetadata {
    return this.moduleDict.get(module);
  }

  /**
   * Liefert die Metaten für die Komponente @param{component}
   *
   * @param {Funktion} component
   * @returns {ComponentMetadata}
   * @memberof ModuleMetadataStorage
   */
  public findComponentMetadata(component: Funktion): ComponentMetadata {
    return this.componentDict.get(component);
  }


  /**
   * DI-Boostrap über das Modul @param{mod}.
   *
   * Es wird ein Root-Injector erzeugt und geliefert mit den Providern:
   * - mod
   * - den Komponenten aus declarations
   * - den globalen Modul-Providern (gesammelte Provider alle Module)
   *
   * @param {Funktion} mod - Modul-Klasse/Funktion
   * @returns {Injector} - der zugehörige Injector
   * @memberof ModuleMetadataStorage
   */
  public bootstrapModule(module: Funktion): Injector {
    return using(new XLog(ModuleMetadataStorage.logger, levels.INFO, 'bootstrapModule',
      `model = ${module.name}`), (log) => {
        Assertion.notNull(module);

        const moduleMetadata = this.findModuleMetadata(module as any as Funktion);
        Assertion.notNull(moduleMetadata, `bootstrap: module ${moduleMetadata.name} not registered`);

        const declaredComponents = moduleMetadata.declarations.map((item) => item.target);

        if (moduleMetadata.bootstrap) {
          if (declaredComponents.indexOf(moduleMetadata.bootstrap.target) < 0) {
            declaredComponents.push(moduleMetadata.bootstrap.target);
          }
        }


        const importsFlat = moduleMetadata.getImportsFlat();
        const moduleProvidersFlat = moduleMetadata.getProvidersFlat();

        // root injector erzeugen über Provider aus
        // - components declarations + bootstrap component
        // - alle import modules
        // - providers des bootstrapModules
        // - providers aller importierten Module
        moduleMetadata.createInjector([
          module as any,
          ...declaredComponents,
          ...importsFlat.map((item) => item.target),
          ...moduleMetadata.providers,
          ...moduleProvidersFlat
        ]);

        const moduleInstance = moduleMetadata.injector.get(moduleMetadata.target);

        return moduleMetadata.injector;
      });
  }

  public static get instance(): ModuleMetadataStorage {
    return ModuleMetadataStorage._instance;
  }

}