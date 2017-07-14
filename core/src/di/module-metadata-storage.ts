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
import { Types } from '../types/types';

import { ComponentMetadata } from './component-metadata';
import { InjectorDumper } from './injector-dumper';
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
  public bootstrapModule(module: Funktion) {
    using(new XLog(ModuleMetadataStorage.logger, levels.INFO, 'bootstrapModule',
      `model = ${module.name}`), (log) => {
        Assertion.notNull(module);

        const moduleMetadata = this.findModuleMetadata(module);
        Assertion.notNull(moduleMetadata, `bootstrap: module ${moduleMetadata.targetName} not registered`);

        Assertion.that(!Types.isNullOrEmpty(moduleMetadata.bootstrap),
          `bootstrap: module ${moduleMetadata.targetName} no bootstrap components defined`);


        const rootInjector = this.createModuleInjector(moduleMetadata, undefined);


        // rekursiv eine Injector-Hierarchie erzeugen
        // - Rekursion über die "imports" Module
        // - in den Imports-Modulen für die "declarations" Components
        this.createInjectorsRec(moduleMetadata);


        //
        // ... dann für alle bootstrap Komponenten injectors erzeugen
        //
        moduleMetadata.bootstrap.forEach((item) => {
          item.createInjector([
            item.target as any,
            ...item.providers
          ], rootInjector);
        });

        if (log.isDebugEnabled()) {
          this.dumpInjectorsRec(moduleMetadata);
        }

        // Instanzen erzeugen, damit die entsprechenden Konstruktoren aufgerufen werden
        // - das Modul selbst
        // - für alle bootstrap components

        if (moduleMetadata.bootstrap) {
          moduleMetadata.bootstrap.forEach((item) => {
            const bootstrapInstance = item.getInstance(item.target);
          });
        }
        const moduleInstance = moduleMetadata.getInstance(moduleMetadata.target);
      });
  }


  public static get instance(): ModuleMetadataStorage {
    return ModuleMetadataStorage._instance;
  }



  private createInjectorsRec(module: ModuleMetadata) {
    using(new XLog(ModuleMetadataStorage.logger, levels.INFO, 'createInjectorsRec',
      `model = ${module.targetName}`), (log) => {

        const modInjector = this.createModuleInjector(module, module.__injector);

        module.imports.forEach((mod) => {
          this.createInjectorsRec(mod);
        });

        module.declarations.forEach((item) => {
          if (!item.__injector) {
            this.createComponentInjector(item, modInjector);
          }
        });
      });
  }


  private createComponentInjector(component: ComponentMetadata, parentInjector: ReflectiveInjector) {
    using(new XLog(ModuleMetadataStorage.logger, levels.INFO, 'createComponentInjector',
      `component = ${component.targetName}, ` +
      // tslint:disable-next-line:no-string-literal
      `parentInjector = ${parentInjector ? parentInjector['displayName'] : undefined}`), (log) => {

        component.createInjector([
          component.target as any,
          ...component.providers
        ], parentInjector);
      });
  }

  private createModuleInjector(module: ModuleMetadata, parentInjector: ReflectiveInjector): ReflectiveInjector {
    return using(new XLog(ModuleMetadataStorage.logger, levels.INFO, 'createModuleInjector',
      `model = ${module.targetName}, ` +
      // tslint:disable-next-line:no-string-literal
      `parentInjector = ${parentInjector ? parentInjector['displayName'] : undefined}`), (log) => {

        // nun alle Provider der Moduls sammeln zum Erzeugen des Module-Injectors
        const declaredComponents = new Set(module.declarations);

        // bootstrap Components, die nicht bereits in declaredComponents enthalten sind
        const additionalBootstrapComponents = new Set<ComponentMetadata>();

        if (module.bootstrap) {
          module.bootstrap.forEach((item) => {
            if (!declaredComponents.has(item)) {
              additionalBootstrapComponents.add(item);
            }
          });
        }

        const importsFlat = module.getImportsFlat();
        const moduleProvidersFlat = module.getProvidersFlat();


        //
        // root injector erzeugen über Provider aus
        // - components declarations + bootstrap components (nicht in declarations)
        // - alle import modules
        // - providers des bootstrapModules
        // - providers aller importierten Module
        //
        const injector = module.createInjector([
          module.target as any,
          ...Array.from(declaredComponents).map((item) => item.target),
          ...Array.from(additionalBootstrapComponents).map((item) => item.target),
          ...importsFlat.map((item) => item.target),
          ...module.providers,
          ...moduleProvidersFlat
        ], parentInjector);

        return injector;
      });
  }

  private dumpInjectorsRec(module: ModuleMetadata) {
    using(new XLog(ModuleMetadataStorage.logger, levels.DEBUG, 'dumpInjectorsRec',
      // tslint:disable-next-line:no-string-literal
      `model = ${module.targetName}, injector = ${module.__injector['displayName']}`), (log) => {

        module.imports.forEach((mod) => {
          this.dumpInjectorsRec(mod);
        });

        module.declarations.forEach((item) => {
          // tslint:disable-next-line:no-string-literal
          log.debug(`component = ${item.targetName}, ` +
            `injector hierarchy: \n${InjectorDumper.stringify(item.__injector)}`);
        });
      });
  }

}