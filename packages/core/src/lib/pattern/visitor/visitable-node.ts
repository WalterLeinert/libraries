import { Node } from '../../base/node';
import { IVisitable } from './visitable.interface';
import { IVisitor } from './visitor.interface';

/**
 * abstrakte Basisklasse für "besuchbare" Knoten (visitor pattern)
 *
 * @export
 * @class VisitableNode
 * @extends {Node}
 * @implements {IVisitable<Node>}
 */
export abstract class VisitableNode extends Node implements IVisitable<Node> {

  protected constructor(left?: Node, right?: Node) {
    super(left, right);
  }

  /**
   * Akzeptiert den Visitor @param{visitor} und delegiert das Besuchen an den Visitor
   *
   * @param {IVisitor<Node>} visitor
   *
   * @memberof VisitableNode
   */
  public accept(visitor: IVisitor<Node>) {
    visitor.visit(this);
  }
}