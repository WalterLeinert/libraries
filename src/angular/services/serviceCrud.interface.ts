/**
 * Interface mit CRUD-Funktionen
 * 
 * Hier sind keine generischen Typen verwendet, damit man das Interface auch 
 * generisch in Zusammenhang mit Reflection un Metadaten verwenden kann.
 */
export interface IServiceCrud {

    /**
     * Create the entity {item} and return {Observable<T>}
     * 
     * @param {T} item
     * @returns {Observable<T>}
     * 
     */
    create(item: any): any;

    /**
    * Find all entities of type T and return {Observable<T[]>}.
    * 
    * @returns {Observable<T[]>}
    * 
    */
    find(): any;

    /**
     * Find the entity with the given id and return {Observable<T>}
     * 
     * @param {TId} id -- entity id.
     * @returns {Observable<T>}
     * 
     */
    findById(id: any): any;

    /**
     * Update the entity {item} with the given id and return {Observable<T>}
     * 
     * @param {T} item
     * @returns {Observable<T>}
     * 
     */
    update(item: any): any;


    /**
     * Delete the entity with the given id and return {Observable<T>}
     * 
     * @param {TId} id
     * @returns {Observable<T>}
     * 
     * @memberOf Service
     */
    delete(id: any): any;

}