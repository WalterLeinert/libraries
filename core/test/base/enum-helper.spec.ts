// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { EnumHelper } from '../../src/base/enum-helper';
import { CoreUnitTest } from '../unit-test';

enum Farbe {
  Rot,
  Gruen,
  Blau
}


@suite('core.base.EnumHelpber')
class Test extends CoreUnitTest {

  @test 'should get names'() {
    return expect(EnumHelper.getNames(Farbe)).to.deep.equal([
      'Rot',
      'Gruen',
      'Blau'
    ]);
  }

  @test 'should get values'() {
    return expect(EnumHelper.getValues(Farbe)).to.deep.equal([
      0,
      1,
      2
    ]);
  }

  @test 'should get names and values'() {
    return expect(EnumHelper.getNamesAndValues(Farbe)).to.deep.equal([
      {
        name: 'Rot',
        value: 0
      },
      {
        name: 'Gruen',
        value: 1
      },
      {
        name: 'Blau',
        value: 2
      }
    ]);
  }

  @test 'should get bidirectionalMap name -> value'() {
    const map = EnumHelper.getBidirectionalMap(Farbe);
    expect(map.map1To2('Rot')).to.equal(0);
    expect(map.map1To2('Gruen')).to.equal(1);
    expect(map.map1To2('Blau')).to.equal(2);
  }


  @test 'should get bidirectionalMap value -> name'() {
    const map = EnumHelper.getBidirectionalMap(Farbe);
    expect(map.map2To1(0)).to.equal('Rot');
    expect(map.map2To1(1)).to.equal('Gruen');
    expect(map.map2To1(2)).to.equal('Blau');
  }

  @test 'should get bidirectionalMap: values1'() {
    const map = EnumHelper.getBidirectionalMap(Farbe);
    expect(map.values1).to.deep.equal([
      'Rot',
      'Gruen',
      'Blau'
    ]);
  }

  @test 'should get bidirectionalMap: values2'() {
    const map = EnumHelper.getBidirectionalMap(Farbe);
    expect(map.values2).to.deep.equal([
      0,
      1,
      2
    ]);
  }
}