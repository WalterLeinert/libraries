import { Provider } from 'injection-js';


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
import { ModuleMetadataStorage } from './module-metadata-storage';
import { IModuleOptions } from './module-options.interface';


export class ModuleMetadata extends ClassMetadata {
  protected static readonly logger = getLogger(ModuleMetadata);

  private importsDict: Dictionary<Funktion, ModuleMetadata> = new Dictionary<Funktion, ModuleMetadata>();
  private declarationsDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private exportsDict: Dictionary<Funktion, ComponentMetadata> = new Dictionary<Funktion, ComponentMetadata>();
  private _providers: Provider[] = [];



  public constructor(private metadataStorage: ModuleMetadataStorage, target: Funktion,
    private _options: IModuleOptions) {
    super(target, target.name);

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
        if (this._options.providers) {
          this._providers = [...this._options.providers];
        }
      }
    });
  }


  public getImport(target: Funktion) {
    return this.importsDict.get(target);
  }

  public getImportMetadata(target: string | Funktion) {
    return this.metadataStorage.findModuleMetadata(target);
  }

  public getDeclaration(target: Funktion) {
    return this.declarationsDict.get(target);
  }

  public getDeclarationMetadata(target: string | Funktion) {
    return this.metadataStorage.findModuleMetadata(target);
  }

  public getExport(target: Funktion) {
    return this.exportsDict.get(target);
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

  public get providers(): Provider[] {
    return this._providers;
  }

  public get options(): IModuleOptions {
    return this._options;
  }

}