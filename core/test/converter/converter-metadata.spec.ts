// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import {
  BOOLEAN_CONVERTER, Converter, ConverterMetadataStorage, DATE_CONVERTER, NUMBER_CONVERTER
} from '../../src/converter';
import { Types } from '../../src/types/types';
import { SHORT_INT_CONVERTER, ShortInt } from './short-int';


class Test {

  @Converter(NUMBER_CONVERTER)
  public id: number;

  public name: string;

  @Converter(BOOLEAN_CONVERTER)
  public persisted: boolean;

  @Converter(DATE_CONVERTER)
  public created: Date;

  public sint: ShortInt;


  constructor() {
    this.sint = new ShortInt(1);
  }
}


@suite('core.converter (metadata)') @only
class ConverterMetadataTest {

  @test 'should find metadata'() {
    const classMetadata = ConverterMetadataStorage.instance.findClassConverterMetadata(Test);
    expect(classMetadata).to.exist;

    expect(classMetadata.key).not.to.exist;

    const idMetadata = classMetadata.getPropertyMetadata('id');
    expect(idMetadata).to.exist;
    expect(idMetadata.key).to.eql(NUMBER_CONVERTER);

    const persistedMetadata = classMetadata.getPropertyMetadata('persisted');
    expect(persistedMetadata).to.exist;
    expect(persistedMetadata.key).to.eql(BOOLEAN_CONVERTER);

    const createdMetadata = classMetadata.getPropertyMetadata('created');
    expect(createdMetadata).to.exist;
    expect(createdMetadata.key).to.eql(DATE_CONVERTER);
  }

  @test 'should find metadata for ShortInt property'() {
    const classMetadata = ConverterMetadataStorage.instance.findClassConverterMetadata(Test);

    const sintMetadata = classMetadata.getPropertyMetadata('sint');
    expect(sintMetadata).to.not.exist;

    const test = new Test();
    expect(Types.isObject(test.sint)).to.be.true;
    // expect(Types.hasConstructor(test.sint)).to.be.true;

    const typeName = test.sint.constructor.name;

    const shortIntMetadata = ConverterMetadataStorage.instance.findClassConverterMetadata(typeName);
    expect(shortIntMetadata).to.exist;

    expect(shortIntMetadata.key).to.eql(SHORT_INT_CONVERTER);
  }



  @test 'should test class converter'() {

    const classMetadata = ConverterMetadataStorage.instance.findClassConverterMetadata(ShortInt);
    expect(classMetadata).to.exist;

    const converterTuple = classMetadata.getConverterTuple<string, ShortInt>();

    const valueFrom = converterTuple.from.convert('2');
    expect(valueFrom.value).to.equal(2);

    const valueTo = converterTuple.to.convert(new ShortInt(3));
    expect(valueTo).to.equal('3');
  }

}
