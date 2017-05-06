import { BooleanTerm } from '@fluxgate/core';

/**
 * Interface für Knex-Queries
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