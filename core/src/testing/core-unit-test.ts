// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector } from 'injection-js';

// -------------------------------------- logging --------------------------------------------
import { IConfig } from '../diagnostics/config.interface';
import { configure } from '../diagnostics/logging-core';
// -------------------------------------- logging --------------------------------------------

import { CoreTestModule } from './core-test.module';
import { ModuleMetadataStorage } from '../di/module-metadata-storage';


/**
 * abstrakte Basisklasse für alle Unittests.
 *
 * Hinweis: die Klasse muss vor allen anderen Testklassen importiert werden, damit die Initialisierung
 * korrekt durchgeführt wird!
 *
 * @export
 * @abstract
 * @class UnitTest
 */
export abstract class CoreUnitTest {

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'FATAL',
      'Test': 'DEBUG',
      'Test2': 'INFO'
    }
  };

  protected before() {
    configure(this.config);
  }

  protected static before() {
    ModuleMetadataStorage.instance.bootstrapModule(CoreTestModule);
  }
}