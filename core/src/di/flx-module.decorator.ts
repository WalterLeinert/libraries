import { Injectable, OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';

import { ModuleMetadata } from './module-metadata';
import { ModuleMetadataStorage } from './module-metadata-storage';
import { IModuleOptions } from './module-options.interface';


/**
 * Decorator für die Annotation von DI-Modulen
 *
 * @export
 * @template T
 * @param {IModuleOptions} options
 * @returns
 */
export function FlxModule<T>(options: IModuleOptions) {
  return (target: Funktion) => {
    ModuleMetadataStorage.instance.addModuleMetadata(
      new ModuleMetadata(ModuleMetadataStorage.instance, target, options));
  };
}