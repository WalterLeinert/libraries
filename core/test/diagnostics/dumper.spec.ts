// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { UniqueIdentifiable } from '../../src/base/uniqueIdentifiable';
import { Dumper } from '../../src/diagnostics/dumper';


const json = {
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
    no: 1
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



@suite('core.diagnostics.Dumper')
class DumperTest {

  @test 'should dump empty json'() {
    const dump = Dumper.dump({});
    return expect(dump).to.be.equal(`{
}`);
  }


  @test 'should dump json without cyclic reference'() {
    const dump = Dumper.dump(json);
    return expect(dump).to.be.equal(`{
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
    no: 1
  }
}`);
  }


  @test 'should dump json with cyclic reference'() {
    const tree = new TreeNode(1, 'root');
    tree.child = tree;    // self reference

    const dump = Dumper.dump(tree);
    return expect(dump).to.be.equal(`{
  _id: 1,
  _name: 'root',
  _child: {
    ----> cycle detected: type = TreeNode
  }
}`);
  }
}
