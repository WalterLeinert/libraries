import { BooleanTerm } from './boolean-term';

/**
 * Interface für Queries
 */
export interface IQuery {

  /**
   * Query-Term/Tree
   *
   * @type {BooleanTerm}
   * @memberOf IQuery
   */
  term: BooleanTerm;
}