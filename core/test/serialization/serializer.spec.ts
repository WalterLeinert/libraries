// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion } from '../../src/base/objectType';
import { JsonClass, JsonFormatter, JsonProperty } from '../../src/serialization';

const tester = () => {

  @JsonClass()
  class Test {
    @JsonProperty()
    public static readonly logger;

    @JsonProperty()
    private _id: number;

    @JsonProperty()
    public name: string;

    @JsonProperty()
    public doNothingMethod(): void {
      // ok
    }

    @JsonProperty()
    public get idProperty(): number {
      return this._id;
    }
  }
};





@JsonClass()
class Test2 {

  @JsonProperty()
  private _id: number;

  @JsonProperty()
  public name: string;

  constructor(id: number) {
    this._id = id;
    this.name = `Test2-${id}`;
  }

  public doNothingMethod(): void {
    // ok
  }

  public get id(): number {
    return this._id;
  }
}


@JsonClass()
class Test3 {

  @JsonProperty()
  private _test2: Test2;

  @JsonProperty()
  private _test4: Test4;

  @JsonProperty()
  public name: string;

  constructor(test2: Test2, test4?: Test4) {
    this._test2 = test2;
    this._test4 = test4;
  }

  public get test2(): Test2 {
    return this._test2;
  }

  public get test4(): Test4 {
    return this._test4;
  }
}



class Test4 {
  public name: string;
}


class Test5 {
  public name: string;

  public test2Array: Test2[] = [];

  constructor(n: number) {
    this.name = `Test5-${n}`;

    for (let i = 0; i < n; i++) {
      this.test2Array.push(new Test2(i));
    }
  }
}



@suite('core.serialization.decorator')
class SerializerTest {


  @test 'should register serializable class'() {
    tester();
  }

  @test 'should serialize null/undefined'() {
    this.doTest(null);
    this.doTest(undefined);
  }

  @test 'should serialize primitive types'() {
    this.doTest(17);
    this.doTest('walter');
  }

  @test 'should serialize array of primitive numbers'() {
    const ar = [
      1, 2, 3
    ];
    this.doTest(ar);
  }

  @test 'should serialize array of primitive strings'() {
    const ar = [
      'a', 'b', 'c'
    ];
    this.doTest(ar);
  }


  @test 'should serialize array of class instances'() {
    const ar = [
      new Test2(1),
      new Test2(2),
      new Test2(3)
    ];
    this.doTest(ar, Test2);
  }

  @test 'should serialize simple class'() {
    const test2 = new Test2(4711);
    test2.name = 'walter';

    this.doTest(test2, Test2);
  }


  @test 'should serialize referenced class'() {
    const test2 = new Test2(4711);
    test2.name = 'walter';

    const test3 = new Test3(test2);
    test3.name = 'TEST3';

    this.doTest(test3, Test3);
  }


  @test 'should serialize referenced + simple class'() {
    const test2 = new Test2(4711);
    test2.name = 'walter';

    const test4 = new Test4();
    test4.name = 'TEST4';

    const test3 = new Test3(test2, test4);
    test3.name = 'TEST3';

    this.doTest(test3, Test3);
  }


  private doTest<T>(value: T, clazz?: Funktion) {
    const formatter = new JsonFormatter();

    const valueSerialized = formatter.serialize(value);
    // console.log(JSON.stringify(valueSerialized));

    const valueDeserialized = formatter.deserialize(valueSerialized, clazz);
    // console.log(JSON.stringify(valueDeserialized));

    expect(valueDeserialized).to.deep.equal(value);
  }

}