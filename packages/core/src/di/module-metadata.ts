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
import { Types } from '../types/types';

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
          log.debug(`options: ${JsonDumper.stringify(this._options, { maxDepth: 2 })}`);
        }


        if (this._options.imports) {
          this.createDict('imports', 'module',
            (ms: ModuleMetadataStorage, t: Funktion) => ms.findModuleMetadata(t),
            this._options.imports, this.importsDict, (component) => component.setParent(this));
        }

        if (this._options.declarations) {
          this.createDict('declarations', 'component',
            (ms: ModuleMetadataStorage, t: Funktion) => ms.findComponentMetadata(t),
            this._options.declarations, this.declarationsDict, (component) => component.setModule(this));
        }

        if (this._options.exports) {
          this.createDict('exports', 'component',
            (ms: ModuleMetadataStorage, t: Funktion) => ms.findComponentMetadata(t),
            this._options.exports, this.exportsDict);
        }

        if (this._options.bootstrap) {
          this.createDict('bootstrap', 'component',
            (ms: ModuleMetadataStorage, t: Funktion) => ms.findComponentMetadata(t),
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



  public validate() {

    //
    // Declarations prüfen: fehlt der @FlxComponent decorator?
    //
    const flattenedDeclarations = this.flattenItems<Funktion>(this.options.declarations);
    flattenedDeclarations.forEach((item) => {
      const component = ModuleMetadataStorage.instance.findComponentMetadata(item);
      if (!component) {
        throw new Error(`Unexpected value ${item.name} declared by the module ${this.targetName}.` +
          `Please add a @FlxComponent annotation.`);
      }
    });


    //
    // Bootstrap prüfen: fehlt der @FlxComponent decorator?
    //
    const flattenedBootstrap = this.flattenItems<Funktion>(this.options.bootstrap);
    flattenedBootstrap.forEach((item) => {
      const component = ModuleMetadataStorage.instance.findComponentMetadata(item);
      if (!component) {
        throw new Error(`${item.name} cannot be used as an entry component. May be @FlxComponent is missing?`);
      }
    });



    //
    // Exports prüfen: ist export in declarations oder in den exports der import module?
    //
    // Set mit Moduldeklarationen + exports der importierten Module erzeugen
    //
    const declarationsAllSet = new Set<ComponentMetadata>(this.declarations);
    this.imports.forEach((item) => {
      item.exports.forEach((exp) => {
        declarationsAllSet.add(exp);
      });
    });

    const exportsSet = new Set<ComponentMetadata>(this.exports);

    exportsSet.forEach((item) => {
      Assertion.that(declarationsAllSet.has(item), `Can't export directive ${item.targetName} from ` +
        `${this.targetName} as it was neither declared nor imported!`);
    });
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


  /**
   * erzeugt ein flaches Array vom Typ T. @param{items} können als Elementr auch Arrays enthalten;
   * diese werden rekursiv aufgelöst.
   *
   * @param items
   */
  public flattenItems<T>(items: any[]): T[] {
    const flattened: T[] = [];

    if (Types.isPresent(items)) {
      items.forEach((item: Funktion | any) => {
        if (Array.isArray(item)) {
          const itemFlattened = this.flattenItems<T>(item as any[]);
          flattened.push(...itemFlattened);
        } else {
          flattened.push(item as T);
        }
      });
    }

    return flattened;
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
    targets: Funktion[] | any[],
    itemsDict: Dictionary<Funktion, T>,
    moduleSetter?: (item: T) => void) {

    const duplicates = new Set<Funktion>();

    const flattenedTargets = this.flattenItems<Funktion>(targets);

    flattenedTargets.forEach((target) => {
      const metadata = finder(ModuleMetadataStorage.instance, target);

      if (metadata) {
        Assertion.that(!duplicates.has(target),
          `${name}: ${type} ${target.name} already registered`);

        duplicates.add(target);

        itemsDict.set(target, metadata);

        if (moduleSetter) {
          moduleSetter(metadata);
        }
      }

    });
  }


}