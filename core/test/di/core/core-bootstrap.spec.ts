// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { } from 'injection-js/metadata';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Component } from '../../../src/di/component.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Module } from '../../../src/di/module.decorator';

import { Logger } from './logger.service'


@Injectable()
@Component({
})
export class CoreBootstrapComponent {
  constructor(public logger: Logger) {

  }

  public log(message: string) {
    this.logger.log(message);
  }
}



@Module({
  imports: [
  ],
  declarations: [
    CoreBootstrapComponent
  ],
  exports: [
    CoreBootstrapComponent
  ],
  providers: [
    Logger
  ],
  bootstrap: CoreBootstrapComponent
})
export class CoreBootstrapModule {
}


@suite('core.di.core: bootstrap')
class CoreTest {


  @test 'should boostrap and create root instance'() {
    const rootInstance = ModuleMetadataStorage.instance.bootstrapModule(CoreBootstrapModule);
  }

}