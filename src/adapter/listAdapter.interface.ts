/**
 * Interface für Adapter zum Bereitstellen von Listen des Typs {T}
 */
export interface IListAdapter<T> {

    /**
     * Liefert ein Array von Items vom Typ @type{T}
     * 
     * @returns{T[]}
     */
    getItems(): T[];
}