// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ComponentMetadata } from '../../../src/di/component-metadata';
import { Component } from '../../../src/di/component.decorator';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';


@Component({
})
export class TestSingleComponent {
}

@suite('core.di.Component')
class ComponentTest {
  private metadata: ComponentMetadata;

  @test 'should annotate and register component'() {
    expect(this.metadata).to.be.not.null;
    expect(this.metadata.target).to.equal(TestSingleComponent);
  }

  @test 'should test providers'() {
    expect(this.metadata.providers).to.exist;
    expect(this.metadata.providers.length).to.be.empty;
  }


  protected before() {
    this.metadata = ModuleMetadataStorage.instance.findComponentMetadata(TestSingleComponent);
  }
}