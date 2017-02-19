// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Clone } from '../../src/base/clone';
import { UniqueIdentifiable } from '../../src/base/uniqueIdentifiable';

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



@suite('Clone: cyclic graphs')
class CloneRecursiveTest {

  @test 'should check graph without cycle'() {
    const tree = new TreeNode(1, 'root', new TreeNode(2, 'child'));
    expect(tree).to.be.not.null;
    expect(tree.child).to.be.not.null;
    expect(tree.child.id).to.equal(2);

    const treeCloned = Clone.clone(tree);
    expect(treeCloned).to.deep.equal(tree);

    expect(tree === treeCloned).to.be.not.true;
    expect(() => Clone.verifyClone(tree, treeCloned)).not.to.Throw();
  }

  @test 'should check graph with cycle'() {
    const tree = new TreeNode(1, 'root');
    tree.child = tree;    // self reference
    const treeCloned = Clone.clone(tree);
    expect(treeCloned.child).to.equal(treeCloned);
  }
}