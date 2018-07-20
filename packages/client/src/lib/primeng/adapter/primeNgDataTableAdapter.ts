// fluxgate
import { IListAdapter } from '@fluxgate/core';

import { DropdownAdapter, IDropdownAdapterOptions } from '../../angular/common/adapter';


/**
 * Adapter für PrimeNG DropDown-Control
 */
export class PrimeNgDataTableAdapter<T> extends DropdownAdapter<T> {
    public data: any[] = [];

    constructor(listAdapter: IListAdapter<T>, adapterOptions: IDropdownAdapterOptions) {
        super(listAdapter, adapterOptions);

        /*  TODO: überflüssig?
            if (this.adapterOptions.allowNoSelection) {
            this.data.push({
                label: this.adapterOptions.allowNoSelectionText,
                value: null
            });
        }*/

        this.getItems()
            .subscribe((items) => this.data = items);
    }
}