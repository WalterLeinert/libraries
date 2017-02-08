import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Assert, Types } from '@fluxgate/common';

import { BaseComponent } from '../../common/base';
import { MetadataService } from '../../services';

/**
 * Basisklasse für alle Selector-Komponenten
 */
export abstract class SelectorBaseComponent extends BaseComponent<any> {

    /**
     * falls true, wird Debug-Info beim Control angezeigt
     *
     * @type {boolean}
     */
    @Input() public debug: boolean = false;


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


    protected constructor(router: Router, private _metadataService: MetadataService,
        private _changeDetectorRef: ChangeDetectorRef) {
        super(router, null);
    }


    // -------------------------------------------------------------------------------------
    // Property selectedValue und der Change Event
    // -------------------------------------------------------------------------------------

    protected onSelectedValueChange(value: number) {
        this.selectedValueChange.emit(value);
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
}