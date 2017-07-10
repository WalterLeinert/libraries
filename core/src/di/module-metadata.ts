import { OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';


// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { Funktion } from '../base/objectType';
import { ClassMetadata } from '../metadata/class-metadata';
import { Metadata } from '../metadata/metadata';
import { Dictionary } from '../types/dictionary';
import { Assert } from '../util/assert';

import { ComponentMetadata } from './component-metadata';
import { DiMetadata } from './di-metadata';
import { MetadataVisitor } from './metadata-visitor';
import { ModuleMetadataStorage } from './module-metadata-storage';
import { IModuleOptions } from './module-options.interface';


export class ModuleMetadata extends DiMetadata {
  protected static readonly logger = getLogger(ModuleMetadata);
  private _parent: ModuleMetadata;

  private importsDict: Dictionary<Funktion, ModuleMetadata> = new Dictionary<Funktion, ModuleMetadata>();
  private declarationsDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private exportsDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private _bootstrap: ComponentMetadata;



  public constructor(private metadataStorage: ModuleMetadataStorage, target: Funktion,
    private _options: IModuleOptions) {
    super(target, _options.providers);

    using(new XLog(ModuleMetadata.logger, levels.INFO, 'ctor'), (log) => {

      if (this._options) {
        if (this._options.imports) {
          const duplicates = new Set<Funktion>();
          this._options.imports.forEach((item) => {
            const imprt = this.metadataStorage.findModuleMetadata(item);
            Assert.notNull(imprt, `imports: module ${item.name} not registered`);

            Assert.that(!duplicates.has(item),
              `imports: module ${item.name} already registered`);

            duplicates.add(item);
            this.importsDict.set(imprt.target, imprt);

            imprt.setParent(this);
          });
        }

        if (this._options.declarations) {
          this._options.declarations.forEach((item) => {
            const declaration = this.metadataStorage.findComponentMetadata(item);
            Assert.notNull(declaration, `declarations: component ${item.name} not registered`);

            this.declarationsDict.set(declaration.target, declaration);
          });
        }

        if (this._options.exports) {
          this._options.exports.forEach((item) => {
            const exprt = this.metadataStorage.findComponentMetadata(item);
            Assert.notNull(exprt, `exports: component ${item.name} not registered`);

            this.exportsDict.set(exprt.target, exprt);
          });
        }

        if (this._options.bootstrap) {
          const bootstrap = this.metadataStorage.findComponentMetadata(this._options.bootstrap);
          Assert.notNull(bootstrap, `bootstrap: component ${bootstrap.name} not registered`);
          this._bootstrap = bootstrap;

          const componentProviders = this.declarations.map((item) => item.target);
          if (!this.declarationsDict.containsKey(this.bootstrap.target)) {
            componentProviders.push(this.bootstrap.target);
          }
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

  public get bootstrap(): ComponentMetadata {
    return this._bootstrap;
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
    importsFlat.map((item) => providersFlat.push(item.providers));
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


  protected onCreateInjector(providers: Provider[], parentInjector?: ReflectiveInjector): ReflectiveInjector {
    return ReflectiveInjector.resolveAndCreate(providers, parentInjector);
  }


  private setParent(module: ModuleMetadata) {
    this._parent = module;
  }

}