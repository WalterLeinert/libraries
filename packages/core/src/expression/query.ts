import { VisitableNode } from '../pattern/visitor/visitable-node';
import { IVisitor } from '../pattern/visitor/visitor.interface';
import { Serializable } from '../serialization/serializable.decorator';
import { BooleanTerm } from './boolean-term';
import { IQuery } from './query.interface';


/**
 * Modelliert (DB-) Queries
 */
@Serializable()
export class Query extends VisitableNode implements IQuery {

  constructor(private _term: BooleanTerm) {
    super();
  }

  /**
   * Query-Term/Tree
   *
   * @type {BooleanTerm}
   * @memberOf IQuery
   */
  public get term(): BooleanTerm {
    return this._term;
  }


  public accept(visitor: IVisitor<VisitableNode>) {
    visitor.visit(this._term);
  }
}