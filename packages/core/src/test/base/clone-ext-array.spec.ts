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
  private _childs: TreeNode[] = [];

  constructor(public name: string, childs: TreeNode[]) {
    super();

    if (childs) {
      this._childs = childs.slice();
    }
  }


  public get childs(): TreeNode[] {
    return this._childs;
  }
}


@suite('core.base.Clone: array with external class references')
class CloneExtArrayTest extends CoreUnitTest {

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

    // Test so nicht möglich, da sich die Instanzen in der instanceId unterscheiden (UniqueIdentifiable)!
    // expect(treeCloned).to.deep.equal(tree);

    expect(tree === treeCloned).to.be.not.true;
    expect(() => CloneVerifier.verifyClone(tree, treeCloned)).not.to.Throw();
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
    expect(() => CloneVerifier.verifyClone(tree, treeCloned)).to.Throw();
  }

}