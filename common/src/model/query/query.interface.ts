import { IAttributeSelector } from './attributeSelector.interface';

/**
 * Interface für Knex-Queries
 */
export interface IQuery {

    /**
     * Liste von Attributselektoren: diese werden z.Zt. als UND-verknüpft interpretiert!
     * 
     * @type {IAttributeSelector[]}
     * @memberOf IQuery
     */
    selectors: IAttributeSelector[];
}