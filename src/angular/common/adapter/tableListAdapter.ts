import { NgModule, Component, ReflectiveInjector, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Assert, IListAdapter } from '@fluxgate/common';
import { MetadataStorage, TableMetadata } from '@fluxgate/common';

import { Service } from '../../services/service';

/**
 * Adapter zum Bereitstellen einer Liste von Items vom Typ {T} aus einer DB-Tabelle
 */
export class TableListAdapter<T, TId> implements IListAdapter<T> {
    private _className: string;
    private itemsSubscription: Observable<T[]>;

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