import { Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';
import { ClassMetadata } from '../metadata/class-metadata';
import { IComponentOptions } from './component-options.interface';


export class ComponentMetadata extends ClassMetadata {
  private _providers: Provider[] = [];
  private _injector: ReflectiveInjector;
  private _parent: ComponentMetadata;

  public constructor(target: Funktion, private _options: IComponentOptions) {
    super(target, target.name);

    if (this._options) {
      if (this.options.providers) {
        this._providers = [...this._options.providers];

        this._injector = ReflectiveInjector.resolveAndCreate(this._providers);
      }
    }
  }


  public get providers(): Provider[] {
    return this._providers;
  }

  protected get options(): IComponentOptions {
    return this._options;
  }

  protected get parent(): ComponentMetadata {
    return this._parent;
  }
}