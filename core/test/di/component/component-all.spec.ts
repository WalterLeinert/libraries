// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ComponentMetadata } from '../../../src/di/component-metadata';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';

class ProviderClass {
}

@FlxComponent({
  providers: [
    ProviderClass
  ]
})
export class TestProviderComponent {
}

@suite('core.di.Component: providers')
class ComponentTest {
  private metadata: ComponentMetadata;

  @test 'should test provider'() {
    expect(this.metadata.providers).to.exist;
    expect(this.metadata.providers.length).to.equal(1);
    expect(this.metadata.providers[0]).to.equal(ProviderClass);
  }


  protected before() {
    this.metadata = ModuleMetadataStorage.instance.findComponentMetadata(TestProviderComponent);
  }
}