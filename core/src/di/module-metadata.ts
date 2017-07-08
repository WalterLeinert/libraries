import { Injectable, OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';


// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLog } from '../diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { Funktion } from '../base/objectType';
import { ClassMetadata } from '../metadata/class-metadata';
import { Metadata } from '../metadata/metadata';
import { Dictionary } from '../types/dictionary';
import { IDictionary } from '../types/dictionary.interface';
import { Types } from '../types/types';
import { Assert } from '../util/assert';
import { ComponentMetadata } from './component-metadata';
import { ModuleMetadataStorage } from './module-metadata-storage';
import { IModuleOptions } from './module-options.interface';


export class ModuleMetadata extends ClassMetadata {
  private importsDict: Dictionary<string, ModuleMetadata> = new Dictionary<string, ModuleMetadata>();
  private declarationsDict: Dictionary<string, ComponentMetadata> = new Dictionary<string, ComponentMetadata>();
  private exportsDict: Dictionary<string, ComponentMetadata> = new Dictionary<string, ComponentMetadata>();
  private _providers: Provider[];



  public constructor(private metadataStorage: ModuleMetadataStorage, target: Funktion,
    private _options: IModuleOptions) {
    super(target, target.name);

    if (this._options) {
      if (this._options.imports) {
        const duplicates = new Set<Funktion>();
        this._options.imports.forEach((item) => {
          const imprt = this.metadataStorage.findModuleMetadata(item);
          Assert.notNull(imprt, `imports: module ${item.name} not registered`);

          Assert.that(!duplicates.has(item),
            `imports: module ${item.name} already registered`);

          duplicates.add(item);
          this.importsDict.set(imprt.name, imprt);
        });
      }

      if (this._options.declarations) {
        this._options.declarations.forEach((item) => {
          const declaration = this.metadataStorage.findComponentMetadata(item);
          Assert.notNull(declaration, `declarations: component ${item.name} not registered`);

          this.declarationsDict.set(declaration.name, declaration);
        });
      }

      if (this._options.exports) {
        this._options.exports.forEach((item) => {
          const exprt = this.metadataStorage.findComponentMetadata(item);
          Assert.notNull(exprt, `exports: component ${item.name} not registered`);

          this.exportsDict.set(exprt.name, exprt);
        });

      }
      if (this._options.providers) {
        this._providers = [...this._options.providers];
      }
    }
  }


  public getImport(target: string | Funktion) {
    return this.importsDict.get(Metadata.getTargetName(target));
  }

  public getImportMetadata(target: string | Funktion) {
    return this.metadataStorage.findModuleMetadata(target);
  }

  public getDeclaration(target: string | Funktion) {
    return this.declarationsDict.get(Metadata.getTargetName(target));
  }

  public getDeclarationMetadata(target: string | Funktion) {
    return this.metadataStorage.findModuleMetadata(target);
  }

  public getExport(target: string | Funktion) {
    return this.exportsDict.get(Metadata.getTargetName(target));
  }

  public get providers(): Provider {
    return this._providers;
  }

  public get options(): IModuleOptions {
    return this._options;
  }

}