// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Component } from '../../../src/di/component.decorator';
import { ModuleMetadataStorage } from '../../../src/di/module-metadata-storage';
import { Module } from '../../../src/di/module.decorator';


// missing @Module decorator
class NoModule {
}


@Module({
  imports: [
    NoModule    // -> assertion: no module
  ]
})
export class TestModule {
}