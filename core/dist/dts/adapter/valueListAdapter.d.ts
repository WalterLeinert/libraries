import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { IListAdapter } from './listAdapter.interface';
/**
 * Adapter zum Bereitstellen einer Liste von Items vom Typ {T}
 */
export declare class ValueListAdapter<T> implements IListAdapter<T> {
    private items;
    /**
     * Intialisiert eine neue Instanz
     *
     * @param{T[]} items - Array von Items vom Typ @type{T}
     */
    constructor(items: T[]);
    /**
     * Liefert ein Array von Items vom Typ @type{T} als @see{Observable}
     *
     * @returns{Observable<T[]>}
     */
    getItems(): Observable<T[]>;
}
