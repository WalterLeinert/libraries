// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { FlxComponent } from '../../../src/di/flx-component.decorator';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { FlxModule } from '../../../src/di/flx-module.decorator';


// missing @Module decorator
class NoModule {
}


@FlxModule({
  imports: [
    NoModule    // -> assertion: no module
  ]
})
export class TestModule {
}