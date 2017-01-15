import { Assert } from '../util';

import { IListAdapter } from './listAdapter.interface';

/**
 * Adapter zum Bereitstellen einer Liste von Items vom Typ {T}
 */
export class ValueListAdapter<T> implements IListAdapter<T> {
    private items: T[] = [];

    constructor(items: T[]) {
        Assert.notNull(items);

        for (let item of items) {
            this.items.push(item);
        }
    }

    public getItems(): T[] {
        return this.items;
    }
}