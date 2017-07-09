// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { useInjector } from './car-injector';

@suite('core.di.angular-tests.car')
class CarTest {


  @test 'should create car by ReflectiveInjector'() {
    useInjector();
  }
}