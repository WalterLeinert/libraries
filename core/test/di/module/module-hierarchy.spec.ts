// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression
// tslint:disable:class-name

import 'reflect-metadata';

import { Injector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { DiMetadata } from '../../../src/di/di-metadata';
import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { FlxModule } from '../../../src/di/flx-module.decorator';
import { ModuleMetadata } from '../../../src/di/module-metadata';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { DiUnitTest } from '../di-unit-test';


// ------------------------ Module_1 ---------------------------------------------
@FlxComponent({
})
export class Component_1_1 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Component_1_1.injector = injector;
  }
}

@FlxModule({
  declarations: [
    Component_1_1
  ],
  exports: [
    Component_1_1
  ]
})
export class Module_1 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Module_1.injector = injector;
  }
}
// ------------------------ Module_1 ---------------------------------------------


// ------------------------ Module_2 ---------------------------------------------
@FlxComponent({
})
export class Component_2_1 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Component_2_1.injector = injector;
  }
}

@FlxModule({
  declarations: [
    Component_2_1
  ],
  exports: [
    Component_2_1
  ],
  imports: [
    Module_1
  ]
})
export class Module_2 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Module_2.injector = injector;
  }
}
// ------------------------ Module_2 ---------------------------------------------


// ------------------------ Module_3 ---------------------------------------------
@FlxComponent({
})
export class Component_3_1 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Component_3_1.injector = injector;
  }
}


@FlxModule({
  declarations: [
    Component_3_1
  ],
  exports: [
    Component_3_1
  ],
  imports: [
    Module_2
  ],
  bootstrap: [
    Component_3_1
  ]
})
export class Module_3 {
  public static injector: Injector;

  constructor(injector: Injector) {
    Module_3.injector = injector;
  }
}
// ------------------------ Module_3 ---------------------------------------------

abstract class TestHelper extends DiUnitTest {

  protected before() {
    ModuleMetadataStorage.instance.bootstrapModule(Module_3);
  }
}


@suite('core.di.Module: module hierarchy and providers')
class ModuleTest extends TestHelper {

  @test 'should get Module_3 by Module_3'() {
    expect(Module_3.injector.get(Module_3)).to.exist;
  }

  @test 'should get Component_3_1 by Component_3_1'() {
    expect(Component_3_1.injector.get(Component_3_1)).to.exist;
  }

  @test 'should get Module_3 by Component_3_1'() {
    expect(Component_3_1.injector.get(Module_3)).to.exist;
  }


  @test 'should NOT get Component_3_1 by Module_3'() {
    expect(() => Module_3.injector.get(Component_3_1)).to.Throw('No provider for Component_3_1');
  }

  @test 'should NOT get Module_2 by Module_3'() {
    expect(() => Module_3.injector.get(Module_2)).to.Throw('No provider for Module_2');
  }
}



@suite('core.di.Module: instance creation bottom up (start c11): ')
class C11Test extends TestHelper {
  private metadata;

  @test 'should get Component_1_1'() {
    expect(this.metadata).to.exist;
    expect(this.metadata.getInstance(Component_1_1)).to.exist;
    expect(this.metadata.getInstance(Component_1_1)).to.be.instanceof(Component_1_1);
  }

  @test 'should get Modul_1 by Component_1_1'() {
    expect(this.metadata.getInstance(Module_1)).to.exist;
  }

  @test 'should get Modul_2 by Component_1_1'() {
    expect(this.metadata.getInstance(Module_2)).to.exist;
  }

  @test 'should get Modul_3 by Component_1_1'() {
    expect(this.metadata.getInstance(Module_3)).to.exist;
  }


  @test 'should NOT get Component_2_1 by Component_1_1'() {
    expect(() => this.metadata.getInstance(Component_2_1)).to.Throw('No provider for Component_2_1');
  }

  @test 'should NOT get Component_3_1 by Component_1_1'() {
    expect(() => this.metadata.getInstance(Component_3_1)).to.Throw('No provider for Component_3_1');
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findComponentMetadata(Component_1_1);
  }
}



@suite('core.di.Module: instance creation bottom up (start c21): ')
class C21Test extends TestHelper {
  private metadata;

  @test 'should get Modul_2 by Component_2_1'() {
    expect(this.metadata.getInstance(Module_2)).to.exist;
  }

  @test 'should get Modul_3 by Component_2_1'() {
    expect(this.metadata.getInstance(Module_3)).to.exist;
  }

  @test 'should NOT get Component_3_1 by Component_2_1'() {
    expect(() => this.metadata.getInstance(Component_3_1)).to.Throw('No provider for Component_3_1');
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findComponentMetadata(Component_2_1);
  }
}


@suite('core.di.Module: expected errors: ')
class ErrorTest extends TestHelper {
  private metadata;

  @test 'should not get Modul_1 by Component_2_1'() {
    expect(() => this.metadata.getInstance(Module_1)).to.Throw('No provider for Module_1');
  }


  @test 'should not get Component_1_1 by Module_2.injector'() {
    expect(() => Module_2.injector.get(Component_1_1)).to.Throw('No provider for Component_1_1');
  }

  @test 'should not get Component_1_1 by Component_2_1'() {
    expect(() => this.metadata.getInstance(Component_1_1)).to.Throw('No provider for Component_1_1');
  }

  protected before() {
    super.before();
    this.metadata = ModuleMetadataStorage.instance.findComponentMetadata(Component_2_1);
  }
}