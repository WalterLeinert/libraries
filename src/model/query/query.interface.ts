import { IAttributeSelector } from './attributeSelector.interface';

/**
 * Interface für Knex-Queries
 */
export interface IQuery {
    selector: IAttributeSelector;
}