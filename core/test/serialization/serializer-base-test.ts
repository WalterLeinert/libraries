import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
// let jsondiff = require('json-diff-patch');

import { Differ } from '../../src/base/differ';
import { JsonSerializer } from '../../src/serialization';
import { UnitTest } from '../../src/testing/unit-test';


export abstract class SerializerBaseTest extends UnitTest {
  protected formatter: JsonSerializer;

  public before() {
    super.before();
    this.formatter = new JsonSerializer();
  }

  protected checkSerialization(value: any) {
    const valueSerialized = this.formatter.serialize(value);
    const valueDeserialized = this.formatter.deserialize(valueSerialized);

    // const diff = jsondiff.diff(value, valueDeserialized);

    // tslint:disable-next-line:no-console
    // console.log(JSON.stringify(diff));
    Differ.diff(value, valueDeserialized);

    expect(value).to.eql(valueDeserialized);
  }

}