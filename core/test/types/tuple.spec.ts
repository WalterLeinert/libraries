// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Tuple, Tuple3, Tuple4 } from '../../src/types';
import { CoreUnitTest } from '../unit-test';


@suite('core.types.Tuple')
class TupleTest extends CoreUnitTest {

  @test 'should test Tuple'() {
    const t = new Tuple<string, number>('hugo', 4711);
    expect(t.item1).to.equal('hugo');
    expect(t.item2).to.equal(4711);
    expect(t.toString()).to.equal('hugo-4711');
  }

  @test 'should test Tuple3'() {
    const t = new Tuple3<string, number, string>('hugo', 4711, 'maier');
    expect(t.item1).to.equal('hugo');
    expect(t.item2).to.equal(4711);
    expect(t.item3).to.equal('maier');
    expect(t.toString()).to.equal('hugo-4711-maier');
  }

  @test 'should test Tuple4'() {
    const s = Symbol('sym');
    const t = new Tuple4<string, number, string, symbol>('hugo', 4711, 'maier', s);
    expect(t.item1).to.equal('hugo');
    expect(t.item2).to.equal(4711);
    expect(t.item3).to.equal('maier');
    expect(t.item4).to.equal(s);
    expect(t.toString()).to.equal('hugo-4711-maier-Symbol(sym)');
  }
}