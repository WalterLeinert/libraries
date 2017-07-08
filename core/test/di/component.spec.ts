// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { CoreInjector } from '../../src/di/core-injector';
import { ConsoleLogger } from '../../src/diagnostics/consoleLogger';
import { DEFAULT_CATEGORY, LOG_EXCEPTIONS, LOGGER } from '../../src/diagnostics/logger.token';
import { SimpleStringifyer } from '../../src/diagnostics/simple-stringifyer';
import { STRINGIFYER } from '../../src/diagnostics/stringifyer.token';



import { ComponentMetadata } from '../../src/di/component-metadata';
import { Component } from '../../src/di/component.decorator';
import { ModuleMetadataStorage } from '../../src/di/module-metadata-storage';


import { UnitTest } from '../../src/testing/unit-test';


@Component({
})
export class TestSingleComponent {
}

@suite('core.di.Component')
class ComponentTest extends UnitTest {
  private metadata: ComponentMetadata;

  @test 'should annotate and register component'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(TestSingleComponent);
  }


  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findComponentMetadata(TestSingleComponent);
  }
}