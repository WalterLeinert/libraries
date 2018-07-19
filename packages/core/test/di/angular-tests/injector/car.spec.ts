// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import 'reflect-metadata';

import { Injectable, InjectionToken, ReflectiveInjector } from 'injection-js';

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


@Injectable()
class Engine {
}

@Injectable()
class Car {
  constructor(public engine: Engine) { }
}

@suite('core.di.angular-tests.injector')
class CarTest {


  @test 'should create car by ReflectiveInjector.resolveAndCreate'() {
    const injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
    expect(injector.get(Car) instanceof Car).to.be.true;
  }


  @test 'should test engine'() {
    const injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
    const car = injector.get(Car);
    expect(car.engine).to.be.instanceof(Engine);
  }
}