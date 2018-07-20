// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UniqueIdentifiable } from '../../lib/base/uniqueIdentifiable';
import { JsonDumper } from '../../lib/diagnostics/json-dumper';
import { CoreUnitTest } from '../unit-test';


const json = {
  null: null,
  undefined: undefined,
  items: [
    'name1',
    4711
  ],
  name: 'Walter',
  id: 4711,
  valid: true,
  inner1: {
    no: 1,
    inner: {
      hallo: 'du'
    }
  },
  inner2: {
    no: 2
  }
};


class TreeNode extends UniqueIdentifiable {
  constructor(private _id: number, private _name: string, private _child?: TreeNode) {
    super();
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get child(): TreeNode {
    return this._child;
  }

  public set child(value: TreeNode) {
    this._child = value;
  }
}


class SimpleObject {
  public name: string;
}


@suite('core.diagnostics.JsonDumper')
class DumperTest extends CoreUnitTest {

  @test 'should dump empty json'() {
    const dump = JsonDumper.stringify({});
    return expect(dump).to.be.equal(`{    // Object
}`);
  }


  @test 'should stringify null'() {
    const result = JsonDumper.stringify(null);
    expect(result).to.equal('null');
  }

  @test 'should stringify undefined'() {
    const result = JsonDumper.stringify(undefined);
    expect(result).to.equal('undefined');
  }


  @test 'should stringify number'() {
    const result = JsonDumper.stringify(4711);
    expect(result).to.equal('4711');
  }

  @test 'should stringify string'() {
    const result = JsonDumper.stringify('hugo');
    expect(result).to.equal('"hugo"');
  }

  @test 'should stringify Date'() {
    const result = JsonDumper.stringify(new Date('2006-01-02T14:04:05.000Z'));
    expect(result).to.equal('"2006-01-02T14:04:05.000Z"');
  }

  @test 'should stringify SimpleObject'() {
    const result = JsonDumper.stringify(new SimpleObject());
    expect(result).to.equal(`{    // SimpleObject
}`);
  }

  @test 'should stringify SimpleObject w/o type info'() {
    const result = JsonDumper.stringify(new SimpleObject(), { showInfo: false });
    expect(result).to.equal(`{
}`);
  }

  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  // Hinweis: die Ausgabe ist typtreuer als die originale JSON.stringify Ausgabe!
  @test 'should stringify test from MDN 1 (not fully compatible)'() {
    const result = JsonDumper.stringify({ x: [10, undefined, () => { /*ok*/ }, Symbol('my-symbol')] });
    expect(result).to.equal(`{    // Object
  "x": [
    10,
    undefined,
    (),
    Symbol(my-symbol)
  ]
}`);
  }

  @test 'should stringify test from MDN 2'() {
    // tslint:disable-next-line:only-arrow-functions
    const result = JsonDumper.stringify({ [Symbol('foo')]: 'foo' });
    expect(result).to.equal(`{    // Object
}`);
  }


  @test 'should dump json without cyclic reference'() {
    const dump = JsonDumper.stringify(json);
    return expect(dump).to.be.equal(`{    // Object
  "null": null,
  "undefined": undefined,
  "items": [
    "name1",
    4711
  ],
  "name": "Walter",
  "id": 4711,
  "valid": true,
  "inner1": {    // Object
    "no": 1,
    "inner": {    // Object
      "hallo": "du"
    }
  },
  "inner2": {    // Object
    "no": 2
  }
}`);
  }


  @test 'should dump json without cyclic reference w/o type info'() {
    const dump = JsonDumper.stringify(json, { showInfo: false });
    return expect(dump).to.be.equal(`{
  "null": null,
  "undefined": undefined,
  "items": [
    "name1",
    4711
  ],
  "name": "Walter",
  "id": 4711,
  "valid": true,
  "inner1": {
    "no": 1,
    "inner": {
      "hallo": "du"
    }
  },
  "inner2": {
    "no": 2
  }
}`);
  }


  @test 'should dump json with maxDepth 1'() {
    const dump = JsonDumper.stringify(json, { maxDepth: 1 });
    return expect(dump).to.be.equal(`{    // Object
  "null": null,
  "undefined": undefined,
  "items": [
    "name1",
    4711
  ],
  "name": "Walter",
  "id": 4711,
  "valid": true,
  "inner1": {    // Object
    "no": 1,
    "inner": {    // Object
      ...
    }
  },
  "inner2": {    // Object
    "no": 2
  }
}`);
  }


  @test 'should dump json with maxDepth 0'() {
    const dump = JsonDumper.stringify(json, { maxDepth: 0 });
    return expect(dump).to.be.equal(`{    // Object
  "null": null,
  "undefined": undefined,
  "items": [
    ...    // 2 items
  ],
  "name": "Walter",
  "id": 4711,
  "valid": true,
  "inner1": {    // Object
    ...
  },
  "inner2": {    // Object
    ...
  }
}`);
  }



  @test 'should dump json with cyclic reference'() {
    const tree = new TreeNode(1, 'root');
    tree.child = tree;    // self reference

    const dump = JsonDumper.stringify(tree);
    return expect(dump).to.be.equal(`{    // TreeNode
  "_id": 1,
  "_name": "root",
  "_child":     ----> cycle detected: type = TreeNode
}`);
  }
}
