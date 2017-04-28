
import { Observable } from 'rxjs/Observable';

import { IListAdapter } from '@fluxgate/core';

import { Service } from '../base/service';

/**
 * Adapter zum Bereitstellen einer Liste von Items vom Typ {T} aus einer DB-Tabelle
 */
export class TableListAdapter<T, TId> implements IListAdapter<T> {
    private _className: string;

    /**
     * @param{string} className - der Name der Modelklasse (z.B. 'Artikel')
     */
    constructor(className: string, private service: Service<T, TId>) {
    }

    public getItems(): Observable<T[]> {
        return this.service.find();
    }

    /**
     * Liefert den Namen der Modelklasse
     */
    get className(): string {
        return this._className;
    }

}