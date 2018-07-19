/**
 * Interface für das Visitor-Pattern
 *
 * @export
 * @interface IVisitor
 * @template T
 */
export interface IVisitor<T> {

  /**
   * Methode zum Besuchen eines Elements vom Typ T
   *
   * @param {T} elem
   *
   * @memberof IVisitor
   */
  visit(elem: T);
}