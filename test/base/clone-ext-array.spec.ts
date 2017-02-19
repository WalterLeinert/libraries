// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Clone } from '../../src/base/clone';

class TreeNode {
  constructor(private _id: number, private _name: string) {
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
}

class Tree {
  private _childs: TreeNode[] = [];

  constructor(public name: string, childs: TreeNode[]) {
    if (childs) {
      this._childs = childs.slice();
    }
  }


  public get childs(): TreeNode[] {
    return this._childs;
  }
}


@suite('Clone: array with external class references')
class CloneExtArrayTest {

  @test 'should check Tree properties'() {

    const tree = new Tree('my tree', [
      new TreeNode(1, 'child 1'),
      new TreeNode(2, 'child 2'),
      new TreeNode(3, 'child 3')
    ]);
    expect(tree).to.be.not.null;
    expect(tree.childs.length).to.equal(3);
    expect(tree.childs[0].id).to.equal(1);
    expect(tree.childs[0].name).to.equal('child 1');
  }


  @test 'should clone'() {
    const tree = new Tree('my tree', [
      new TreeNode(1, 'child 1'),
      new TreeNode(2, 'child 2'),
      new TreeNode(3, 'child 3')
    ]);
    const treeCloned = Clone.clone(tree);
    expect(treeCloned).to.deep.equal(tree);

    expect(tree === treeCloned).to.be.not.true;
    expect(() => Clone.verifyClone(tree, treeCloned)).not.to.Throw();
  }

  @test 'should expect error'() {
    const tree = new Tree('my tree', [
      new TreeNode(1, 'child 1'),
      new TreeNode(2, 'child 2'),
      new TreeNode(3, 'child 3')
    ]);
    const treeCloned = Clone.clone(tree);

    treeCloned.childs[0] = tree.childs[0];

    expect(tree === treeCloned).to.be.not.true;
    // Clone.verifyClone(tree, treeCloned);
    expect(() => Clone.verifyClone(tree, treeCloned)).to.Throw();
  }

}