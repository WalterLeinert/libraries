import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
let jsondiff = require('json-diff-patch');

import { Clone } from '../../src/base/clone';
import { JsonFormatter } from '../../src/serialization';

export abstract class SerializerBaseTest {
  protected formatter: JsonFormatter;

  public before() {
    this.formatter = new JsonFormatter();
  }

  protected checkSerialization(value: any) {
    const valueSerialized = this.formatter.serialize(value);
    const valueDeserialized = this.formatter.deserialize(valueSerialized);

    const diff = jsondiff.diff(value, valueDeserialized);

    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(diff));
    Clone.diff(value, valueDeserialized);

    expect(value).to.eql(valueDeserialized);
  }

}