import { Injectable, OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';

import { ModuleMetadata } from './module-metadata';
import { ModuleMetadataStorage } from './module-metadata-storage';
import { IModuleOptions } from './module-options.interface';

export function Module<T>(options: IModuleOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target: Funktion) {
    ModuleMetadataStorage.instance.addModuleMetadata(
      new ModuleMetadata(ModuleMetadataStorage.instance, target, options));
  };
}