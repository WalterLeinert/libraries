// Angular
import { EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

// Fluxgate
import { Assert, Funktion, IService, TableMetadata } from '@fluxgate/common';
import { MetadataService } from '../../services';
import { SelectorBaseComponent } from './selectorBase.component';


export abstract class ListSelectorComponent extends SelectorBaseComponent {


  /**
   * Schutz vor rekursivem Ping-Pong
   */
  protected isPreselecting: boolean = false;

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
  @Output() public dataChange = new EventEmitter<any>();

  /**
   * der Service zum Bereitstellen der Daten
   *
   * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
   *
   * @type {IService}
   * @memberOf DataTableSelectorComponent
   */
  private _dataService: IService;

  /**
   * die Service-Methode zum Bereitstellen der Daten. Muss eine Methode von @see{dataService} sein.
   *
   * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
   *
   * @type {IService}
   * @memberOf DataTableSelectorComponent
   */
  private _dataServiceFunction: Funktion;


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
  @Output() public selectedIndexChange = new EventEmitter<number>();


  protected constructor(router: Router, metadataService: MetadataService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();

    if (this.data) {
      //
      // wir prüfen, ob für die Items (nur das erste Element) Metadaten vorliegen ->
      // ggf. autom. Konfiguration über Metadaten
      //
      this.initBoundData(this.data, this.getMetadataForValues(this.data));
    } else {

      // Hinweis: dataService und dataServiceFunction dürfen während der Initialisierung auch undefiniert sein! 
      if (!this.dataService && !this.dataServiceFunction) {
        return;
      }

      let serviceFunction: Funktion;

      if (this.dataServiceFunction) {
        serviceFunction = this.dataServiceFunction;
      } else {
        serviceFunction = this.dataService.find;
      }

      const tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());

      this.registerSubscription(serviceFunction.call(this.dataService)
        .subscribe((items: any[]) => {
          this.initBoundData(items, tableMetadata);
        },
        (error: Error) => {
          this.handleError(error);
        }));
    }
  }


  /**
   * Setup des Databindings für die Liste @param{items} und der Spaltenkonfiguration.
   * Ist @param{tableMetadata} angegeben und keine Konfiguration von "aussen" gesetzt,
   * so wird über die Metadaten eine automatische Konfiguration durchgeführt.
   * 
   * @protected
   * @param {any[]} items
   * @param {TableMetadata} tableMetadata
   * 
   * @memberOf ListSelectorComponent
   */
  protected initBoundData(items: any[], tableMetadata: TableMetadata) {
    if (this.data) {
      Assert.that(!this.dataService,
        `Wenn Property data gesetzt ist, darf dataService nicht gleichzeitig gesetzt sein.`);
    } else {
      // zulässig, falls DataBinding noch nicht abgeschlossen: weder data noch dataService ist gesetzt
      // Assert.that(this.dataService !== undefined,
      //     `Wenn Property data nicht gesetzt ist, muss dataService gesetzt sein.`);
    }

    this.setupConfig(items, tableMetadata);
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
  protected abstract setupData(items: any[]): void;


  /**
   * Initialisiert die Konfiguration der Anzeigewerte und Werte
   * 
   * @protected
   * @abstract
   * @param {any[]} items
   * @param {TableMetadatan} tableMetadata - Metadaten oder null/indefined
   * 
   * @memberOf ListSelectorComponent
   */
  protected abstract setupConfig(items: any[], tableMetadata: TableMetadata): void;

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
   * falls die valueField-Property einen entsprechenden Propertynamen enthält
   * (nur bei @see{DropdownSelectorComponent})
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

        /**
         * - falls kein selectedValue existiert, setzen wir den selectedValue auf den Wert von
         *   selectedIndex oder 0
         * - falls bereits ein selectedValue existiert, versuchen wir einen selectedValue mit der 
         *   aktuellen Konfiguration zu setzen
         */
        if (this.selectedValue === undefined) {
          if (this.selectedIndex >= 0 && this.selectedIndex < this.dataLength) {
            this.selectedValue = this.getDataValue(this.selectedIndex);
          } else if (this.dataLength > 0) {
            this.selectedValue = this.getDataValue(0);
          }
        } else {
          if (this.selectedIndex >= 0 && this.selectedIndex < this.dataLength) {
            this.selectedValue = this.getDataValue(this.selectedIndex);
          }
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
    super.onSelectedValueChange(value);

    this.changeDetectorRef.detectChanges();

    let index = -1;
    if (this.selectedValue) {
      index = this.indexOfValue(value);
    }
    this.selectedIndex = index;

    this.preselectData();
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

    //
    // wir prüfen, ob für Items (nur das erste Element) Metadaten vorliegen ->
    // ggf. autom. Konfiguration über Metadaten
    //
    this.initBoundData(values, this.getMetadataForValues(values));
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


  // -------------------------------------------------------------------------------------
  // Property dataService
  // -------------------------------------------------------------------------------------
  public get dataService(): IService {
    return this._dataService;
  }

  @Input() public set dataService(value: IService) {
    if (this._dataService !== value) {
      this._dataService = value;
    }
  }


  // -------------------------------------------------------------------------------------
  // Property dataServiceFunction
  // -------------------------------------------------------------------------------------
  public get dataServiceFunction(): Funktion {
    return this._dataServiceFunction;
  }

  @Input() public set dataServiceFunction(value: Funktion) {
    if (this._dataServiceFunction !== value) {
      this._dataServiceFunction = value;
    }
  }


  /**
   * Liefert @see{TableMetadata}, falls für die @param{values} (nur das erste Element) Metadaten vorliegen ->
   * ggf. autom. Konfiguration über Metadaten
   */
  protected getMetadataForValues(values: any[]): TableMetadata {
    let tableMetadata;
    if (values && values.length > 0) {
      const value = values[0];

      if (value && value.constructor) {
        const clazzName = value.constructor.name;
        tableMetadata = this.metadataService.findTableMetadata(clazzName);
      }
    }
    return tableMetadata;
  }

}