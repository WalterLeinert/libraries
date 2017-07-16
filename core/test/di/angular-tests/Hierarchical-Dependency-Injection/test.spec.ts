// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression
// tslint:disable:class-name

import 'reflect-metadata';

import { Injector } from 'injection-js';

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import { DiMetadata } from '../../../../src/di/di-metadata';
import { ModuleMetadata } from '../../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../../src/di/module-metadata-storage';
import { IConfig } from '../../../../src/diagnostics/config.interface';
import { configure } from '../../../../src/diagnostics/logging-core';
import { Types } from '../../../../src/types/types';

import { CoreUnitTest } from '../../../unit-test';
import { AppModule } from './app.module';



@suite('core.di.angular-tests: Hierarchical Dependency Injection')
class ModuleTest extends CoreUnitTest {
  private metadata: ModuleMetadata;

  @test 'should annotate and register modules'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(AppModule);
  }




  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findModuleMetadata(AppModule);
  }

  protected static before() {
    // kein bootstrap in Basisklasse

    //
    // Default Loggingkonfiguration für jeden Tests
    //
    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'ERROR',
        'ModuleMetadataStorage': 'WARN',
      }
    };

    configure(config);

    ModuleMetadataStorage.instance.bootstrapModule(AppModule);
  }
}