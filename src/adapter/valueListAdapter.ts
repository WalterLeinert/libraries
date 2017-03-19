import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { Assert } from '../util/assert';

import { IListAdapter } from './listAdapter.interface';

/**
 * Adapter zum Bereitstellen einer Liste von Items vom Typ {T}
 */
export class ValueListAdapter<T> implements IListAdapter<T> {
    private items: T[] = [];

    /**
     * Intialisiert eine neue Instanz
     * 
     * @param{T[]} items - Array von Items vom Typ @type{T}
     */
    constructor(items: T[]) {
        Assert.notNull(items);

        for (const item of items) {
            this.items.push(item);
        }
    }


    /**
     * Liefert ein Array von Items vom Typ @type{T} als @see{Observable}
     * 
     * @returns{Observable<T[]>}
     */
    public getItems(): Observable<T[]> {
        return Observable.of(this.items);
    }
}