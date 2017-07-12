import { OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';


// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { Assertion } from '../base/assertion';
import { Funktion } from '../base/objectType';
import { Core } from '../diagnostics/core';
import { JsonDumper } from '../diagnostics/json-dumper';
import { ClassMetadata } from '../metadata/class-metadata';
import { Metadata } from '../metadata/metadata';
import { Dictionary } from '../types/dictionary';

import { ComponentMetadata } from './component-metadata';
import { DiMetadata } from './di-metadata';
import { MetadataVisitor } from './metadata-visitor';
import { ModuleMetadataStorage } from './module-metadata-storage';
import { IModuleOptions } from './module-options.interface';


/**
 * Modelliert Metadaten für DI-Module
 *
 * @export
 * @class ModuleMetadata
 * @extends {DiMetadata}
 */
export class ModuleMetadata extends DiMetadata {
  protected static readonly logger = getLogger(ModuleMetadata);

  private _parent: ModuleMetadata;

  private importsDict: Dictionary<Funktion, ModuleMetadata> = new Dictionary<Funktion, ModuleMetadata>();
  private declarationsDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private exportsDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private bootstrapDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();


  public constructor(private metadataStorage: ModuleMetadataStorage, target: Funktion,
    private _options: IModuleOptions) {
    super(target, _options.providers);

    using(new XLog(ModuleMetadata.logger, levels.INFO, 'ctor', `target = ${target.name}`), (log) => {

      if (this._options) {

        if (log.isDebugEnabled()) {
          log.debug(`options: ${JsonDumper.stringify(this._options, 2)}`);
        }


        if (this._options.imports) {
          this.createDict('imports', 'module',
            (metadataStorage: ModuleMetadataStorage, target: Funktion) => metadataStorage.findModuleMetadata(target),
            this._options.imports, this.importsDict, (component) => component.setParent(this));
        }

        if (this._options.declarations) {
          this.createDict('declarations', 'component',
            (metadataStorage: ModuleMetadataStorage, target: Funktion) => metadataStorage.findComponentMetadata(target),
            this._options.declarations, this.declarationsDict, (component) => component.setModule(this));
        }

        if (this._options.exports) {
          this.createDict('exports', 'component',
            (metadataStorage: ModuleMetadataStorage, target: Funktion) => metadataStorage.findComponentMetadata(target),
            this._options.exports, this.exportsDict);
        }

        if (this._options.bootstrap) {
          this.createDict('bootstrap', 'component',
            (metadataStorage: ModuleMetadataStorage, target: Funktion) => metadataStorage.findComponentMetadata(target),
            this._options.bootstrap, this.bootstrapDict);
        }
      }
    });
  }


  public get imports(): ModuleMetadata[] {
    return this.importsDict.values;
  }

  public get declarations(): ComponentMetadata[] {
    return this.declarationsDict.values;
  }

  public get exports(): ComponentMetadata[] {
    return this.exportsDict.values;
  }

  public get bootstrap(): ComponentMetadata[] {
    return this.bootstrapDict.values;
  }


  public get options(): IModuleOptions {
    return this._options;
  }


  /**
   * Liefert alle Provider der kompletten Hierarchie als flache Liste
   *
   * @returns {Provider[]}
   * @memberof ModuleMetadata
   */
  public getProvidersFlat(): Provider[] {
    const importsFlat = this.getImportsFlat();
    const providersFlat: Provider[] = [];
    importsFlat.map((item) => providersFlat.push(...item.providers));
    return providersFlat;
  }



  /**
   * Liefert alle Import-Module der kompletten Hierarchie als flache Liste
   *
   * @returns {ModuleMetadata[]}
   * @memberof ModuleMetadata
   */
  public getImportsFlat(): ModuleMetadata[] {
    const visitor = new MetadataVisitor<ModuleMetadata>((item) => item.imports);
    this.accept(visitor);
    return visitor.items;
  }

  protected get parent(): ModuleMetadata {
    return this._parent;
  }

  private setParent(module: ModuleMetadata) {
    this._parent = module;
  }


  private createDict<T extends DiMetadata>(
    name: string,
    type: string,
    finder: (metadataStorage: ModuleMetadataStorage, target: Funktion) => T,
    targets: Funktion[],
    itemsDict: Dictionary<Funktion, T>,
    moduleSetter?: (item: T) => void) {

    const duplicates = new Set<Funktion>();

    targets.forEach((target) => {
      const metadata = finder(ModuleMetadataStorage.instance, target);
      Assertion.notNull(metadata, `${name}: ${type} ${target.name} not registered`);

      Assertion.that(!duplicates.has(target),
        `${name}: ${type} ${target.name} already registered`);

      duplicates.add(target);

      itemsDict.set(target, metadata);

      if (moduleSetter) {
        moduleSetter(metadata);
      }
    });
  }
}