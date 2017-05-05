import { IVisitor } from './visitor.interface';

/**
 * Interface für Visitor-Pattern: für besuchbare Instanzen, die einen Visitor akzeptieren.
 *
 * @export
 * @interface IVisitable
 * @template TVisitor
 */
export interface IVisitable<T> {
  accept(visitor: IVisitor<T>);
}
