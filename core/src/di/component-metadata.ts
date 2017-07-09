import { OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';
import { IComponentOptions } from './component-options.interface';
import { DiMetadata } from './di-metadata';


export class ComponentMetadata extends DiMetadata<ReflectiveInjector, OpaqueToken> {
  private _parent: ComponentMetadata;

  public constructor(target: Funktion, private _options: IComponentOptions) {
    super(target, _options.providers);

    // this.createInjector(this.providers);
  }

  protected get options(): IComponentOptions {
    return this._options;
  }

  protected get parent(): ComponentMetadata {
    return this._parent;
  }

  protected onCreateInjector(providers: Provider[]): ReflectiveInjector {
    return ReflectiveInjector.resolveAndCreate(providers);
  }
}