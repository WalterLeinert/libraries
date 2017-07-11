import { OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Assertion } from '../base/assertion';
import { Funktion } from '../base/objectType';
import { Types } from '../types/types';
import { IComponentOptions } from './component-options.interface';
import { DiMetadata } from './di-metadata';
import { ModuleMetadata } from './module-metadata';


/**
 * Modelliert Metadaten für DI-Komponenten
 *
 * @export
 * @class ComponentMetadata
 * @extends {DiMetadata}
 */
export class ComponentMetadata extends DiMetadata {
  private _module: ModuleMetadata;
  private _parent: ComponentMetadata;

  public constructor(target: Funktion, private _options: IComponentOptions) {
    super(target, _options.providers);
  }

  /**
   * setzt das zugehörige Modul
   *
   * @param {ModuleMetadata} module
   * @memberof ComponentMetadata
   */
  public setModule(module: ModuleMetadata) {
    Assertion.that(!Types.isPresent(this._module), `Component ${this.targetName}: module already set.`);
    this._module = module;
  }

  public get module(): ModuleMetadata {
    return this._module;
  }

  protected get options(): IComponentOptions {
    return this._options;
  }

  protected get parent(): ComponentMetadata {
    return this._parent;
  }

}