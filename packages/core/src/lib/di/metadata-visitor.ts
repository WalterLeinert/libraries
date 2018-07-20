import { IVisitable } from '../pattern/visitor/visitable.interface';
import { IVisitor } from '../pattern/visitor/visitor.interface';
import { DiMetadata, IGetter } from './di-metadata';
import { ModuleMetadata } from './module-metadata';



/**
 * Visitor zum Ablaufen einer Hierarchie von Di-Metadaten (Component-/ModuleMetadata)
 *
 * @export
 * @class MetadataVisitor
 * @implements {IVisitor<T>}
 * @template T
 */
export class MetadataVisitor<T extends IVisitable<T>> implements IVisitor<T> {
  private _items: T[] = [];

  /**
   * Creates an instance of MetadataVisitor.
   *
   * @param {(el: T) => T[]} itemsAccessor - ein Accessor für den Zugriff auf die jeweilige Child-Collection
   * @memberof MetadataVisitor
   */
  public constructor(private itemsAccessor: (el: T) => T[]) {
  }


  public visit(elem: T) {
    this.itemsAccessor(elem).forEach((item) => {
      this._items.push(item);
      item.accept(this);
    });
  }


  public get items(): T[] {
    return this._items;
  }
}