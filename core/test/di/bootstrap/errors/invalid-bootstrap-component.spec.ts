// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, Injector, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IConfig } from '../../../../src/diagnostics/config.interface';
import { configure } from '../../../../src/diagnostics/logging-core';

import { DiMetadata } from '../../../../src/di/di-metadata';
import { FlxComponent } from '../../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../../src/di/module-metadata-storage';
import { Types } from '../../../../src/types/types';

import { Logger } from '../../logger.service';


// decorator fehlt
class Bootstrap {
}


@FlxModule({
  bootstrap: [
    Bootstrap
  ]
})
export class MissingDecoratorModule {
}


@suite('core.di.core: bootstrap errors (invalid bootstrap component):')
class Test {

  @test 'should get error'() {
    expect(() => ModuleMetadataStorage.instance.bootstrapModule(MissingDecoratorModule)).to.Throw(
      'The module MissingDecoratorModule was bootstrapped, but it does not declare "@FlxModule.bootstrap" ' +
      'components. Please define one');
  }

  protected static before() {

    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'ERROR',
        'ModuleMetadataStorage': 'WARN',
      }
    };

    configure(config);
  }
}