// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Component } from '../../../src/di/component.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Module } from '../../../src/di/module.decorator';

import { UnitTest } from '../../../src/testing/unit-test';
import { Logger } from './logger.service';


@Injectable()
@Component({
})
export class CoreComponent {
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
    CoreComponent
  ],
  exports: [
    CoreComponent
  ],
  providers: [
    Logger
  ],
  bootstrap: CoreComponent
})
export class CoreModule {
}


@suite('core.di.core: CoreModule/-Component')
class CoreTest extends UnitTest {
  private metadata: ModuleMetadata;


  @test 'should check imports'() {
    expect(this.metadata.imports.length).to.be.empty;
  }

  @test 'should have one declaration'() {
    expect(this.metadata.declarations.length).to.equal(1);
    expect(this.metadata.declarations[0].target).to.equal(CoreComponent);
  }


  @test 'should check exports'() {
    expect(this.metadata.exports.length).to.equal(1);
    expect(this.metadata.exports[0].target).to.equal(CoreComponent);
  }

  @test 'should check providers'() {
    expect(this.metadata.providers.length).to.equal(1);
    expect(this.metadata.providers[0]).to.equal(Logger);
  }

  @test 'should check bootstrap'() {
    expect(this.metadata.bootstrap).to.exist;
    expect(this.metadata.bootstrap.target).to.equal(CoreComponent);
  }


  @test 'should create CoreComponent instance'() {
    const injector = ReflectiveInjector.resolveAndCreate([CoreComponent, Logger]);
    const instance = injector.get(CoreComponent);

    expect(instance).to.exist;
    expect(instance).to.be.instanceof(CoreComponent);
  }


  @test 'should create CoreComponent instance by metadata'() {
    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: this.metadata.bootstrap.target as any, useClass: this.metadata.bootstrap.target as any },
      ...this.metadata.providers
    ]);
    const instance: CoreComponent = injector.get(CoreComponent);

    expect(instance).to.exist;
    expect(instance).to.be.instanceof(CoreComponent);
  }

  @test 'should create CoreComponent instance by metadata and log message'() {
    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: this.metadata.bootstrap.target as any, useClass: this.metadata.bootstrap.target as any },
      ...this.metadata.providers
    ]);
    const instance: CoreComponent = injector.get(CoreComponent);
    expect(instance.logger).to.be.instanceof(Logger);

    instance.log('Hallo');
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(CoreModule);
  }
}