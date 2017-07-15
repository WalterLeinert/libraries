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


        // Module validieren
        this.validate();

        const moduleMetadata = this.findModuleMetadata(module);
        Assertion.notNull(moduleMetadata, `bootstrap: module ${moduleMetadata.targetName} no registered FlxModule`);

        Assertion.that(!Types.isNullOrEmpty(moduleMetadata.bootstrap),
          `The module ${moduleMetadata.targetName} was bootstrapped, but it does not declare "@FlxModule.bootstrap" ` +
          `components. Please define one.`);

        moduleMetadata.bootstrap.forEach((item) => {
          const bootstrapComponent = item.getInstance(item.target);
        });


        const rootInjector = this.createModuleInjector(moduleMetadata, undefined);


        // rekursiv eine Injector-Hierarchie erzeugen
        // - Rekursion über die "imports" Module
        // - in den Imports-Modulen für die "declarations" Components
        this.createInjectorsRec(moduleMetadata);



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


  /**
   * erzeugt die Injector Hierarchie rekursiv
   *
   * @param module - das aktuelle Modul
   * @param parentInjector - der aktuelle Injector des Parent-Moduls
   */
  private createInjectorsRec(module: ModuleMetadata, parentInjector?: ReflectiveInjector) {
    using(new XLog(ModuleMetadataStorage.logger, levels.INFO, 'createInjectorsRec',
      `model = ${module.targetName}`), (log) => {

        //
        // für jedes importierte Modul, die Provider aller exportierten Komponenten
        // in die Modul-Providers aufnehmen, damit die Komponenten (und deren Provider) im Modulkontext
        // alle aufgelöst werden können
        //
        module.imports.forEach((mod) => {
          if (log.isDebugEnabled()) {
            log.debug(`import: ${mod.targetName}, merging exported module providers`);
          }
          mod.exports.forEach((item) => {
            if (log.isDebugEnabled()) {
              log.debug(`  exported component: ${item.targetName}`);
            }
            module.providers.push(...item.providers);
          });
        });

        //
        // für jedes importierte Modul alle deklarierten Komponenten  in die Modul-Providers
        // aufnehmen, damit die Komponenten im Modulkontext alle aufgelöst werden können
        //
        module.imports.forEach((mod) => {
          if (log.isDebugEnabled()) {
            log.debug(`import: ${mod.targetName}, merging declared components as providers`);
          }
          mod.declarations.forEach((item) => {
            if (log.isDebugEnabled()) {
              log.debug(`  declared component: ${item.targetName}`);
            }
            module.providers.push(...item.providers);
          });
        });


        // nun den Module-Injectorhierarchie rekursiv erzeugen
        const modInjector = this.createModuleInjector(module, parentInjector);

        module.imports.forEach((mod) => {
          this.createInjectorsRec(mod, modInjector);
        });

        //
        // ist die Rekursion über die importierten Module bei einem leaf module angekommen,
        // dann werden für die dort deklarierten Komponenten die Injectors erzeugt. Die deklarierten Komponenten
        // gehören zu diesem Modul.
        //
        module.declarations.forEach((item) => {

          //
          // ... und für jede Komponente einen Injector erzeugen
          //
          if (!item.__injector) {
            this.createComponentInjector(item, modInjector);
          }
        });
      });
  }


  /**
   * erzeugt einen Injector zur Komponente @param{component} mit dem zugehörigen@param{parentInjector}.
   *
   * @param component
   * @param parentInjector
   */
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


  /**
   * erzeugt einen Injector für @param{module} und den zugehörigen @param{parentInjector}.
   *
   * @param module
   * @param parentInjector
   */
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



  /**
   * Gibt für das Root-Modul @param{rootModule} rekursiv (über alle importierten Module) die
   * Injector-Hierarchie als inverse tree mit leaf declaration components als Wurzeln.
   *
   * Ein Pfad ausgehend von einer leaf declaration component endent dann immer beim root module.
   *
   * @param module
   */
  private dumpInjectors(rootModule: ModuleMetadata) {
    using(new XLog(ModuleMetadataStorage.logger, levels.DEBUG, 'dumpInjectorsRec',
      `rootModule = ${rootModule.targetName}`), (log) => {

        this.dumpInjectorsRec(rootModule);
      });
  }

  /**
   * Gibt für das Modul @param{module}
   *
   * @param module
   */
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


  private validate() {
    this.moduleDict.values.forEach((item) => {
      item.validate();
    });
  }
}