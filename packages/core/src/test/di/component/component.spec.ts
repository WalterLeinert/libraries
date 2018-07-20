// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ComponentMetadata } from '../../../lib/di/component-metadata';
import { FlxComponent } from '../../../lib/di/flx-component.decorator';
import { ModuleMetadataStorage } from '../../../lib/di/module-metadata-storage';
import { DiUnitTest } from '../di-unit-test';

@FlxComponent({
})
export class TestSingleComponent {
}

@suite('core.di.Component')
class ComponentTest extends DiUnitTest {
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