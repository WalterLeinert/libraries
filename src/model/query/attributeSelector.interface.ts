
/**
 * Interface für den Aufbau von Knex-Queries
 */
export interface IAttributeSelector {
    /**
     * Modelpropertyname (nicht: DB-Columnname) 
     */
    name: string;

    /**
     * Operator (z.B. 'like') 
     */
    operator: string;

    /**
     * Wert
     */
    value: any;
}