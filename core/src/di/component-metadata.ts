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
import { IComponentOptions } from './component-options.interface';


export class ComponentMetadata extends ClassMetadata {

  public constructor(target: Funktion, private _options: IComponentOptions) {
    super(target, target.name);
  }

}