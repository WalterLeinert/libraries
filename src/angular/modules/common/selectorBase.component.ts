import { EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';

import { CoreComponent } from '../../common/base';
import { MetadataService } from '../../services';
import { MessageService } from '../../services/message.service';

/**
 * Basisklasse für alle Selector-Komponenten
 */
export abstract class SelectorBaseComponent extends CoreComponent {
    protected static logger = getLogger(SelectorBaseComponent);


    /**
     * falls true, wird Debug-Info beim Control angezeigt
     *
     * @type {boolean}
     */
    @Input() public debug: boolean = false;


    /**
     * falls true, ist die Komponente editierbar
     *
     * @type {boolean}
     */
    private _editable: boolean = false;


    /**
     * locale-Property
     *
     * @type {string}
     */
    private _locale: string = 'en';


    /**
     * * setzt das style-Attribut von p-dropdown
     *
     * @type {string}
     */
    @Input() public style: string;


    /**
     * selectedValueChange Event: wird bei jeder Selektionsänderung gefeuert.
     *
     * Eventdaten: @type{any} - selektiertes Item.
     *
     */
    @Output() public selectedValueChange = new EventEmitter<any>();


    /**
     * das aktuell selektierte Item
     *
     * @type {any}
     */
    private _selectedValue: any;


    protected constructor(router: Router, private _metadataService: MetadataService, messageService: MessageService,
        private _changeDetectorRef: ChangeDetectorRef) {
        super(messageService);
    }


    // -------------------------------------------------------------------------------------
    // Property selectedValue und der Change Event
    // -------------------------------------------------------------------------------------

    protected onSelectedValueChange(value: any) {
        using(new XLog(SelectorBaseComponent.logger, levels.INFO, 'onSelectedValueChange'), (log) => {
            if (log.isInfoEnabled()) {
                log.log(`value = ${JSON.stringify(value)}`);
            }
            this.selectedValueChange.emit(value);
        });
    }

    public get selectedValue(): any {
        return this._selectedValue;
    }

    @Input() public set selectedValue(value: any) {
        if (this._selectedValue !== value) {
            this._selectedValue = value;
            this.onSelectedValueChange(value);
        }
    }


    protected get metadataService(): MetadataService {
        return this._metadataService;
    }

    protected get changeDetectorRef(): ChangeDetectorRef {
        return this._changeDetectorRef;
    }


    // -------------------------------------------------------------------------------------
    // Property locale
    // -------------------------------------------------------------------------------------
    protected onLocaleChange(value: string) {
        // ok
    }

    public get locale(): string {
        return this._locale;
    }

    @Input() public set locale(value: string) {
        if (this._locale !== value) {
            this._locale = value;
            this.onLocaleChange(value);
        }
    }


    /**
     * Property editable
     */
    protected onEditableChange(value: boolean) {
        using(new XLog(SelectorBaseComponent.logger, levels.INFO,
            'onEditableChange', `value = ${JSON.stringify(value)}`), (log) => {
                // ok
        });
    }

    public get editable(): boolean {
        return this._editable;
    }

    @Input() public set editable(value: boolean) {
        if (this._editable !== value) {
            this._editable = value;
            this.onEditableChange(value);
        }
    }

}