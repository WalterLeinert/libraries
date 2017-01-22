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



export abstract class ListSelectorComponent extends BaseComponent<ProxyService> {

    /**
     * Schutz vor rekursivem Ping-Pong
     */
    private isPreselecting: boolean = false;


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
    private _selectedValue: any = {};



    constructor(router: Router, service: ProxyService, private _metadataService: MetadataService,
        private _changeDetectorRef: ChangeDetectorRef) {
        super(router, service);
    }

    ngOnInit() {
        super.ngOnInit();

        /**
         * Werteliste vorbereiten
         */
        if (this.data) {
            Assert.that(!this.dataService, `Wenn Property data gesetzt ist, darf dataService nicht gleichzeitig gesetzt sein.`);

            this.setupConfig(this.data, false);
            this.setupData(this.data);

            this.preselectData();
        } else {
            Assert.notNull(this.dataService, `Wenn Property data nicht gesetzt ist, muss dataService gesetzt sein.`);

            this.service.proxyService(this.dataService);

            this.service.find()
                .subscribe(
                items => {
                    this.setupConfig(items, true);
                    this.setupData(items);

                    this.preselectData();
                },
                (error: Error) => {
                    this.handleError(error);
                });
        }
    }

    protected abstract setupData(items: any[]);

    protected abstract setupConfig(items: any[], useService: boolean);


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
                if (!this.data) {
                    return;
                }
                if (this.selectedIndex >= 0 && this.selectedIndex < this.data.length) {
                    this.selectedValue = this.data[this.selectedIndex];
                } else if (this.data.length > 0) {
                    this.selectedValue = this.data[0];
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
        this.selectedValueChange.emit(value);

        if (this.selectedValue) {
            let index = this.data.indexOf(value);
            this.selectedIndex = index;
        }

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


    // -------------------------------------------------------------------------------------
    // Property selectedIndex und der Change Event
    // -------------------------------------------------------------------------------------

    protected onSelectedIndexChange(index: number) {
        this.selectedIndexChange.emit(index);

        this.preselectData();
    }

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    @Input() public set selectedIndex(index: number) {
        if (this._selectedIndex !== index) {
            this._selectedIndex = index;
            this.onSelectedIndexChange(index);
        }
    }


    // -------------------------------------------------------------------------------------
    // Property data und der Change Event
    // -------------------------------------------------------------------------------------

    protected onDataChange(value: any) {
        this.dataChange.emit(value);
    }

    public get data(): any {
        return this._data;
    }

    @Input() public set data(data: any) {
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