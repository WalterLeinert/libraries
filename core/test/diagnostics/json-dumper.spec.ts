// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UniqueIdentifiable } from '../../src/base/uniqueIdentifiable';
import { JsonDumper } from '../../src/diagnostics/json-dumper';
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



@suite('core.diagnostics.JsonDumper')
class DumperTest extends CoreUnitTest {

  @test 'should dump empty json'() {
    const dump = JsonDumper.stringify({});
    return expect(dump).to.be.equal(`{    // Object
}`);
  }


  @test 'should dump json without cyclic reference'() {
    const dump = JsonDumper.stringify(json);
    return expect(dump).to.be.equal(`{    // Object
  null: null,
  undefined: undefined,
  items: [
    'name1',
    4711
  ],
  name: 'Walter',
  id: 4711,
  valid: true,
  inner1: {    // Object
    no: 1,
    inner: {    // Object
      hallo: 'du'
    }
  },
  inner2: {    // Object
    no: 2
  }
}`);
  }


  @test 'should dump json with maxDepth 1'() {
    const dump = JsonDumper.stringify(json, 1);
    return expect(dump).to.be.equal(`{    // Object
  null: null,
  undefined: undefined,
  items: [
    'name1',
    4711
  ],
  name: 'Walter',
  id: 4711,
  valid: true,
  inner1: {    // Object
    no: 1,
    inner: {    // Object
      ...
    }
  },
  inner2: {    // Object
    no: 2
  }
}`);
  }


  @test 'should dump json with maxDepth 0'() {
    const dump = JsonDumper.stringify(json, 0);
    return expect(dump).to.be.equal(`{    // Object
  null: null,
  undefined: undefined,
  items: [
    ...    // 2 items
  ],
  name: 'Walter',
  id: 4711,
  valid: true,
  inner1: {    // Object
    ...
  },
  inner2: {    // Object
    ...
  }
}`);
  }



  @test 'should dump json with cyclic reference'() {
    const tree = new TreeNode(1, 'root');
    tree.child = tree;    // self reference

    const dump = JsonDumper.stringify(tree);
    return expect(dump).to.be.equal(`{    // TreeNode
  _id: 1,
  _name: 'root',
  _child:     ----> cycle detected: type = TreeNode
}`);
  }
}
