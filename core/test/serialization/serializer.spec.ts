// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion } from '../../src/base/objectType';
import { configure, IConfig } from '../../src/diagnostics/';
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
  }

  public doNothingMethod(): void {
    // ok
  }


  public get idProperty(): number {
    return this._id;
  }
}



@suite('core.decorator.Serialization')
class SerializerTest {


  @test 'should register serializable class'() {
    tester();
  }


  @test 'should serialize primitive types'() {
    this.doTest(17);
    this.doTest('walter');
  }


  @test 'should serialize class'() {
    const test2 = new Test2(4711);
    test2.name = 'walter';

    this.doTest(test2, Test2);
  }


  private doTest<T>(value: T, clazz?: Funktion) {
    const formatter = new JsonFormatter();

    const valueSerialized = formatter.serialize(value);
    console.log(JSON.stringify(valueSerialized));

    const valueDeserialized = formatter.deserialize(valueSerialized, clazz);
    console.log(JSON.stringify(valueDeserialized));

    expect(valueDeserialized).to.deep.equal(value);
  }

}