// Angular
import { Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

// Fluxgate
import { Assert } from '@fluxgate/common';

import { IService } from '../../services';
import { MetadataService, ProxyService } from '../../services';

import { IDisplayInfo } from '../../../base';
import { BaseComponent } from '../../common/base';


export type sortMode = 'single' | 'multiple';



export abstract class ListSelectorComponent extends BaseComponent<any> {


    /**
     * Schutz vor rekursivem Ping-Pong
     */
    protected isPreselecting: boolean = false;


    /**
     * falls true, wird Debug-Info beim Control angezeigt
     *
     * @type {boolean}
     * @memberOf DataTableSelectorComponent
     */
    @Input() debug: boolean = false;


    /**
     * angebundene Objektliste statt Liste von Entities aus DB.
     *
     * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
     *
     * @type {any[]}
     * @memberOf DataTableSelectorComponent
     */
    private _data: any[];

    /**
     * dataChange Event: wird bei jeder SelektionÄänderung von data gefeuert.
     *
     * Eventdaten: @type{any} - selektiertes Objekt.
     *
     * @memberOf DataTableSelectorComponent
     */
    @Output() dataChange = new EventEmitter<any>();

    /**
     * der Service zum Bereitstellen der Daten
     *
     * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
     *
     * @type {IService}
     * @memberOf DataTableSelectorComponent
     */
    @Input() dataService: IService;

    /**
     * die Service-Methode zum Bereitstellen der Daten. Muss eine Methode von @see{dataService} sein.
     *
     * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
     *
     * @type {IService}
     * @memberOf DataTableSelectorComponent
     */
    @Input() dataServiceFunction: Function;


    /**
     * Index der initial zu selektierenden Zeile (0..n-1)
     *
     * @type {number}
     * @memberOf DataTableSelectorComponent
     */
    private _selectedIndex: number = -1;

    /**
     * selectedIndexChange Event: wird bei jeder Änderung von selectedIndex gefeuert.
     *
     * Eventdaten: @type{any} - selektiertes Objekt.
     *
     * @memberOf DataTableSelectorComponent
     */
    @Output() selectedIndexChange = new EventEmitter<number>();


    /**
     * selectedValueChange Event: wird bei jeder Selektionsänderung gefeuert.
     *
     * Eventdaten: @type{any} - selektiertes Objekt.
     *
     * @memberOf DataTableSelectorComponent
     */
    @Output() selectedValueChange = new EventEmitter<any>();


    /**
     * das aktuell selektierte Objekt
     *
     * @type {*}
     * @memberOf DataTableSelectorComponent
     */
    private _selectedValue: any;


    constructor(router: Router, private _metadataService: MetadataService,
        private _changeDetectorRef: ChangeDetectorRef) {
        super(router, null);
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.data) {
            this.initBoundData(this.data, false);
        } else {

            // Hinweis: dataService und dataServiceFunction dürfen während der Initialisierung auch undefiniert sein! 
            if (!this.dataService && !this.dataServiceFunction) {
                return;
            }

            let serviceFunction: Function;

            if (this.dataServiceFunction) {
                serviceFunction = this.dataServiceFunction;
            } else {
                serviceFunction = this.dataService.find;
            }

            serviceFunction.call(this.dataService)
                .subscribe(items => {
                    this.initBoundData(items, true);
                },
                (error: Error) => {
                    this.handleError(error);
                });
        }
    }


    private initBoundData(items: any[], useService: boolean) {
        if (this.data) {
            Assert.that(!this.dataService, `Wenn Property data gesetzt ist, darf dataService nicht gleichzeitig gesetzt sein.`);
        } else {
            Assert.that(this.dataService !== undefined,
                `Wenn Property data nicht gesetzt ist, muss dataService gesetzt sein.`);
        }

        this.setupConfig(items, useService);
        this.setupData(items);

        this.preselectData();
    }


    /**
     * Intialisiert die Daten fürs Databinding
     * 
     * @protected
     * @abstract
     * @param {any[]} items
     * 
     * @memberOf ListSelectorComponent
     */
    protected abstract setupData(items: any[]);


    /**
     * Initialisiert die Konfiguration der Anzeigewerte und Werte
     * 
     * @protected
     * @abstract
     * @param {any[]} items
     * @param {boolean} useService
     * 
     * @memberOf ListSelectorComponent
     */
    protected abstract setupConfig(items: any[], useService: boolean);

    /**
     * Liefert den Index des Items (selectedValue) in der Wertelist
     * 
     * TODO: Achtung: funktionert nicht nach Umsortierung der DataTable !!
     * 
     * @protected
     * @param {*} value
     * @returns {number}
     * 
     * @memberOf DropdownSelectorComponent
     */
    protected abstract indexOfValue(value: any): number;

    /**
     * Liefert den Wert für das @param{item} der Liste. Der Wert ist das Item selbst oder eine entsprechende Property,
     * falls die valueField-Property einen entsprechenden Propertynamen enthält (nur bei @see{DropdownSelectorComponent})
     * 
     * @protected
     * @abstract
     * @param {*} item
     * @returns {*}
     * 
     * @memberOf ListSelectorComponent
     */
    protected abstract getValue(item: any): any;


    /**
     * Liefert true, falls im konkreten Control keine Daten angebunden sind oder die Liste keine Items enthält
     * 
     * @readonly
     * @protected
     * @abstract
     * @type {boolean}
     * @memberOf ListSelectorComponent
     */
    protected abstract get isDataEmpty(): boolean;


    /**
     * Liefert die Anzahl der Data-Items beim konkreten Control
     * 
     * @readonly
     * @protected
     * @abstract
     * @type {number}
     * @memberOf ListSelectorComponent
     */
    protected abstract get dataLength(): number;


    /**
     * Liefert den Wert des Items an der Position @param{index}.
     * Hierbei wird ggf. die valueField-Property ausgewertet.
     * 
     * @protected
     * @abstract
     * @param {number} index
     * @returns {*}
     * 
     * @memberOf ListSelectorComponent
     */
    protected abstract getDataValue(index: number): any;



    /**
     * Falls ein positiver und gültiger selectedIndex angegeben ist, wird der selectedValue auf des
     * entsprechende Item gesetzt.
     *
     * @private
     *
     * @memberOf DataTableSelectorComponent
     */
    protected preselectData() {
        if (!this.isPreselecting) {
            this.isPreselecting = true;

            try {
                if (this.isDataEmpty) {
                    return;
                }
                if (this.selectedIndex >= 0 && this.selectedIndex < this.dataLength) {
                    this.selectedValue = this.getDataValue(this.selectedIndex);
                } else if (this.dataLength > 0) {
                    this.selectedValue = this.getDataValue(0);
                }
            } finally {
                this.isPreselecting = false;
            }
        }
    }


    // -------------------------------------------------------------------------------------
    // Property selectedValue und der Change Event
    // -------------------------------------------------------------------------------------

    protected onSelectedValueChange(value: any) {
        this.changeDetectorRef.detectChanges();
        this.selectedValueChange.emit(value);

        let index = -1;
        if (this.selectedValue) {
            index = this.indexOfValue(value);
        }
        this.selectedIndex = index;

        this.preselectData();
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


    // // -------------------------------------------------------------------------------------
    // // Property selectedIndex und der Change Event
    // // -------------------------------------------------------------------------------------

    // protected onSelectedIndexChange(index: number) {
    //     this.changeDetectorRef.detectChanges();
    //     this.selectedIndexChange.emit(index);

    //     this.preselectData();
    // }

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    @Input() public set selectedIndex(index: number) {
        if (this._selectedIndex !== index) {
            this._selectedIndex = index;
            // TODO: this.onSelectedIndexChange(index);
        }
    }


    // -------------------------------------------------------------------------------------
    // Property data und der Change Event
    // -------------------------------------------------------------------------------------

    protected onDataChange(values: any[]) {
        this.dataChange.emit(values);

        this.initBoundData(values, false);
    }

    public get data(): any[] {
        return this._data;
    }

    @Input() public set data(data: any[]) {
        if (this._data !== data) {
            this._data = data;
            this.onDataChange(data);
        }
    }



    protected get metadataService(): MetadataService {
        return this._metadataService;
    }

    protected get changeDetectorRef(): ChangeDetectorRef {
        return this._changeDetectorRef;
    }

}