import { Funktion } from '../base/objectType';

import { ComponentMetadata } from './component-metadata';
import { IComponentOptions } from './component-options.interface';
import { ModuleMetadataStorage } from './module-metadata-storage';

export function FlxComponent(options?: IComponentOptions) {
  return (target: Funktion) => {
    ModuleMetadataStorage.instance.addComponentMetadataMetadata(new ComponentMetadata(target, options));
  };
}