import { Funktion } from '../base/objectType';

import { ComponentMetadata } from './component-metadata';
import { IComponentOptions } from './component-options.interface';
import { ModuleMetadataStorage } from './module-metadata-storage';


/**
 * Decorator für die Annotation von DI-Komponenten
 *
 * @export
 * @param {IComponentOptions} [options]
 * @returns
 */
export function FlxComponent(options?: IComponentOptions) {
  return (target: Funktion) => {
    ModuleMetadataStorage.instance.addComponentMetadata(new ComponentMetadata(target, options));
  };
}