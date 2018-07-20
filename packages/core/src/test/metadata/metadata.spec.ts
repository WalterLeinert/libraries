// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion } from '../../lib/base/objectType';
import { ClassMetadata, Metadata, PropertyMetadata } from '../../lib/metadata/';
import { CoreUnitTest } from '../unit-test';


const metadatas: Array<Metadata<any>> = new Array<Metadata<any>>();


class TestClassMetadata extends ClassMetadata {
  constructor(target: Funktion) {
    super(target);
  }
}

class TestPropertyMetadataObject extends PropertyMetadata<object> {
  constructor(target: object, propertyName: string) {
    super(target, propertyName);
  }
}

class TestPropertyMetadataFunktion extends PropertyMetadata<Funktion> {
  constructor(target: Funktion, propertyName: string) {
    super(target, propertyName);
  }
}



export function ClazzDecorator() {
  // tslint:disable-next-line:only-arrow-functions
  return (target: Funktion) => {
    metadatas.push(new TestClassMetadata(target));
  };
}



export function PropertyDecoratorObject() {
  // tslint:disable-next-line:only-arrow-functions
  return (target: object, propertyName: string) => {
    metadatas.push(new TestPropertyMetadataObject(target, propertyName));
  };
}

export function PropertyDecoratorFunktion() {
  // tslint:disable-next-line:only-arrow-functions
  return (target: object, propertyName: string) => {
    metadatas.push(new TestPropertyMetadataFunktion(target.constructor, propertyName));
  };
}



@ClazzDecorator()
class TestClass {

  @PropertyDecoratorObject()
  public nameObject: string;

  @PropertyDecoratorFunktion()
  public nameFunktion: string;

  @PropertyDecoratorFunktion()
  public test() {
    // ok
  }
}



@suite('core.metadata')
class MetadataTest extends CoreUnitTest {

  @test 'should test no of metadata'() {
    expect(metadatas.length).to.equal(4);
  }

  @test 'should test TestPropertyMetadataObject'() {
    const metadata = metadatas[0] as TestPropertyMetadataObject;
    expect(metadata.name).to.equal('nameObject');
    expect(metadata).to.be.instanceof(TestPropertyMetadataObject);
    expect(metadata.target.constructor).to.equal(TestClass);
    expect(metadata.targetName).to.equal(TestClass.name);
  }

  @test 'should test TestPropertyMetadataFunktion'() {
    const metadata = metadatas[1] as TestPropertyMetadataFunktion;
    expect(metadata.name).to.equal('nameFunktion');
    expect(metadata).to.be.instanceof(TestPropertyMetadataFunktion);
    expect(metadata.target).to.equal(TestClass);
    expect(metadata.targetName).to.equal(TestClass.name);
  }


  @test 'should test TestPropertyMetadataFunktion (function)'() {
    const metadata = metadatas[2] as TestPropertyMetadataFunktion;
    expect(metadata.name).to.equal('test');
    expect(metadata).to.be.instanceof(TestPropertyMetadataFunktion);
    expect(metadata.target).to.equal(TestClass);
    expect(metadata.targetName).to.equal(TestClass.name);
  }

  @test 'should test TestClassMetadata'() {
    const metadata = metadatas[3] as TestClassMetadata;
    expect(metadata.targetName).to.equal(TestClass.name);
    expect(metadata).to.be.instanceof(TestClassMetadata);
    expect(metadata.target).to.equal(TestClass);
    expect(metadata.targetName).to.equal(TestClass.name);
  }

}