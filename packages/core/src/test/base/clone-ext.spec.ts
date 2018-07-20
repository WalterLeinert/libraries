// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Clone } from '../../lib/base/clone';
import { CloneVerifier } from '../../lib/base/clone-verifier';
import { UniqueIdentifiable } from '../../lib/base/uniqueIdentifiable';
import { CoreUnitTest } from '../unit-test';

class TreeNode extends UniqueIdentifiable {

  constructor(private _id: number, private _name: string) {
    super();
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
}

class Tree extends UniqueIdentifiable {
  private _leftChild: TreeNode = new TreeNode(1, 'left');
  private _rightChild: TreeNode = new TreeNode(2, 'right');

  constructor(public name: string) {
    super();
  }

  public get leftChild(): TreeNode {
    return this._leftChild;
  }

  public get rightChild(): TreeNode {
    return this._rightChild;
  }

  public set rightChild(node: TreeNode) {
    this._rightChild = node;
  }
}


@suite('core.base.Clone: external class reference')
class CloneExtTest extends CoreUnitTest  {

  @test 'should check Tree properties'() {
    const tree = new Tree('my tree');
    expect(tree).to.be.not.null;
    expect(tree.leftChild).to.be.not.null;
    expect(tree.rightChild).to.be.not.null;

    expect(tree.leftChild.id).to.be.equal(1);
    expect(tree.rightChild.id).to.be.equal(2);
  }


  @test 'should clone'() {
    const tree = new Tree('Walter');
    const treeCloned = Clone.clone(tree);

    // Test so nicht möglich, da sich die Instanzen in der instanceId unterscheiden (UniqueIdentifiable)!
    // expect(treeCloned).to.deep.equal(tree);

    expect(tree === treeCloned).to.be.not.true;
    expect(() => CloneVerifier.verifyClone(tree, treeCloned)).not.to.Throw();
  }

  @test 'should expect error'() {
    const tree = new Tree('Walter');
    const treeCloned = Clone.clone(tree);

    treeCloned.rightChild = tree.rightChild;

    expect(tree === treeCloned).to.be.not.true;
    expect(() => CloneVerifier.verifyClone(tree, treeCloned)).to.Throw();
  }

}