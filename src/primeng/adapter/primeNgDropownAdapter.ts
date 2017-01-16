// PrimeNG
import { SelectItem } from 'primeng/primeng';

// fluxgate
import { Assert, IListAdapter } from '@fluxgate/common';

import { IDropdownAdapter, IDropdownAdapterOptions, DropdownAdapter } from '../../angular/common/adapter';


/**
 * Adapter für PrimeNG DropDown-Control
 */
export class PrimeNgDropdownAdapter<T> extends DropdownAdapter<T> {
    public data: SelectItem[] = [];

    constructor(listAdapter: IListAdapter<T>, adapterOptions: IDropdownAdapterOptions) {
        super(listAdapter, adapterOptions);

        if (this.adapterOptions.allowNoSelection) {
            this.data.push({
                label: this.adapterOptions.allowNoSelectionText,
                value: null
            });
        }

        this.getItems()
            .subscribe(items => {
                for (const item of items) {
                    this.data.push({
                        label: this.getText(item),
                        value: this.getValue(item)
                    });
                }
            });
    }
}