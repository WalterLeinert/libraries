// Angular
import { EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

// Fluxgate
import { MessageService, MetadataService } from '@fluxgate/client';
import { ICrudServiceRequests, IEntity, IService, TableMetadata } from '@fluxgate/common';
import { Assert, Funktion, InvalidOperationException, Types } from '@fluxgate/core';

import { SelectorBaseComponent } from './selectorBase.component';


export abstract class ListSelectorComponent<T> extends SelectorBaseComponent<T> {

  /**
   * Schutz vor rekursivem Ping-Pong
   */
  protected isPreselecting: boolean = false;

  /**
   * angebundene Objektliste statt Liste von Entities aus DB.
   *
   * Hinweis: data und dataServiceRequests dürfen nicht gleichzeitig gesetzt sein!
   *
   * @type {any[]}
   * @memberOf DataTableSelectorComponent
   */
  private _data: T[];

  /**
   * dataChange Event: wird bei jeder SelektionÄänderung von data gefeuert.
   *
   * Eventdaten: @type{any} - selektiertes Objekt.
   *
   * @memberOf DataTableSelectorComponent
   */
  @Output() public dataChange = new EventEmitter<T[]>();


  /**
   * die ServiceRequests zum Bereitstellen der Daten
   *
   * Hinweis: data und dataServiceRequests dürfen nicht gleichzeitig gesetzt sein!
   *
   * @type {ICrudServiceRequests}
   * @memberOf DataTableSelectorComponent
   */
  private _dataServiceRequests: ICrudServiceRequests<IEntity<any>, any>;

  /**
   * die Service-Methode zum Bereitstellen der Daten. Muss eine Methode von @see{dataServiceRequests} sein.
   *
   * Hinweis: data und dataServiceRequests dürfen nicht gleichzeitig gesetzt sein!
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


  protected constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);
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

      // Hinweis: dataServiceRequests und dataServiceFunction dürfen während der
      // Initialisierung auch undefiniert sein!
      if (!this.dataServiceRequests && !this.dataServiceFunction) {
        return;
      }

      let serviceFunction: Funktion;
      let tableMetadata: TableMetadata;
      let service: any;

      if (this.dataServiceFunction) {
        serviceFunction = this.dataServiceFunction;
      } else if (this.dataServiceRequests) {
        service = this.dataServiceRequests;
        serviceFunction = this.dataServiceRequests.find;
        tableMetadata = this.metadataService.findTableMetadata(this.dataServiceRequests.getModelClassName());
      } else {
        throw new InvalidOperationException(`no serviceFunction or serviceRequests set.`);
      }

      this.registerSubscription(serviceFunction.call(service)
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
      Assert.that(!this.dataServiceRequests,
        `Wenn Property data gesetzt ist, darf dataServiceRequests nicht gleichzeitig gesetzt sein.`);
    } else {
      // zulässig, falls DataBinding noch nicht abgeschlossen: weder data noch dataService ist gesetzt
      // Assert.that(this.dataService !== undefined,
      //     `Wenn Property data nicht gesetzt ist, muss dataService gesetzt sein.`);
    }

    this.setupConfig(items, tableMetadata);

    // ggf. den Service mit dem CacheService wrappen
    // if (Types.isPresent(this.dataService)) {
    //   this.dataService = this.createDataService(this.dataService);
    // }

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
   * Liefert den Index des Items (value) in der Wertelist
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
   * Falls ein positiver und gültiger selectedIndex angegeben ist, wird der value auf des
   * entsprechende Item gesetzt.
   *
   * @private
   *
   * @memberOf DataTableSelectorComponent
   */
  protected preselectData() {
    const trueValue = true;

    // TODO: als workaround deaktivieren wegen:
    // "...ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.""
    if (trueValue) {
      return;
    }


    if (!this.isPreselecting) {
      this.isPreselecting = true;

      try {
        if (this.isDataEmpty) {
          return;
        }

        /**
         * - falls kein value existiert, setzen wir den value auf den Wert von
         *   selectedIndex oder 0
         * - falls bereits ein value existiert, versuchen wir einen value mit der
         *   aktuellen Konfiguration zu setzen
         */
        if (this.value === undefined) {
          if (this.selectedIndex >= 0 && this.selectedIndex < this.dataLength) {
            this.value = this.getDataValue(this.selectedIndex);
          } else if (this.dataLength > 0) {
            this.value = this.getDataValue(0);
          }
        } else {
          if (this.selectedIndex >= 0 && this.selectedIndex < this.dataLength) {
            this.value = this.getDataValue(this.selectedIndex);
          }
        }


      } finally {
        this.isPreselecting = false;
      }
    }
  }


  protected onValueChange(value: any) {
    super.onValueChange(value);

    // this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();

    let index = -1;
    if (Types.isPresent(this.value)) {
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

  protected onDataChange(values: T[]) {
    this.dataChange.emit(values);

    //
    // wir prüfen, ob für Items (nur das erste Element) Metadaten vorliegen ->
    // ggf. autom. Konfiguration über Metadaten
    //
    this.initBoundData(values, this.getMetadataForValues(values));
  }

  public get data(): T[] {
    return this._data;
  }

  @Input() public set data(data: T[]) {
    if (this._data !== data) {
      this._data = data;
      this.onDataChange(data);
    }
  }


  // -------------------------------------------------------------------------------------
  // Property dataServiceRequests
  // -------------------------------------------------------------------------------------
  public get dataServiceRequests(): ICrudServiceRequests<IEntity<any>, any> {
    return this._dataServiceRequests;
  }

  @Input() public set dataServiceRequests(value: ICrudServiceRequests<IEntity<any>, any>) {
    if (this._dataServiceRequests !== value) {
      this._dataServiceRequests = value;
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


  /**
   * Erlaubt das Wrappen des Service in abgeleiteten Klassen
   * @param service
   */
  protected createDataService(service: IService<IEntity<any>, any>) {
    return service;
  }

}