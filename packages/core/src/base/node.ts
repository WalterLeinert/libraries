
/**
 * allgemeine Basisklasse für Knoten eines Binärbaums.
 * Fehlen beide Childknoten, dann ist dieser Knoten ein Blatt (leaf node)
 *
 * @export
 * @abstract
 * @class Node
 */
export abstract class Node {

  protected constructor(private _left?: Node, private _right?: Node) {
  }

  protected get left(): Node {
    return this._left;
  }

  protected get right(): Node {
    return this._right;
  }
}
