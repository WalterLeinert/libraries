import { Funktion } from '../base/objectType';
import { ClassMetadata } from '../metadata/class-metadata';
import { IComponentOptions } from './component-options.interface';


export class ComponentMetadata extends ClassMetadata {

  public constructor(target: Funktion, private _options: IComponentOptions) {
    super(target, target.name);
  }

  public get options(): IComponentOptions {
    return this._options;
  }
}