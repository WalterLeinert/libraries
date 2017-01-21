// Angular
import { IColumnInfo } from "./datatable-selectorConfig.interface";
import { Component, Injector, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

// Fluxgate
import { TableMetadata, ColumnMetadata, ColumnTypes, Constants, Assert } from '@fluxgate/common';

import { ProxyService } from '../autoform//proxy.service';
import { Service, IService } from '../../services';
import { MetadataService } from '../../services';
import { BaseComponent } from '../../common/base';

import { IDataTableSelectorConfig } from './datatable-selectorConfig.interface';

export class Tuple<T1, T2, T3> {
  constructor(public v1: T1, public v2: T2, public v3?: T3) {
  }
}


/**
 * Komponente DataTableSelector (Selektion eines Objekts aus einer Objektliste über eine PrimeNG-DataTable)
 * 
 * @export
 * @class DataTableSelectorComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'flx-datatable-selector',
  template: `
<div>
  <!-- filter -->
  <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
    <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
    <input #gb type="text" pInputText size="20" style="float:left" placeholder="search...">
  </div>

  <p-dataTable [(value)]="data" sortMode="sortMode" resizableColumns="true" [rows]="rows" 
    [paginator]="true" [globalFilter]="gb"
    selectionMode="single" [(selection)]="selectedValue" (onRowSelect)="onRowSelect($event.data)">
    
    <div *ngIf="config && config.columnInfos">
      <ul *ngFor="let info of config.columnInfos">
        <p-column field="{{info.field}}" header="{{info.label}}" [sortable]="true"></p-column>
      </ul>
    </div>
    </p-dataTable>
</div>
<div *ngIf="debug">
  <p>Selected Item: {{selectedValue | json}}</p>
</div>
  `,
  styles: []
})
export class DataTableSelectorComponent extends BaseComponent<ProxyService> {

  /**
   * falls true, wird Debug-Info beim Control angezeigt
   * 
   * @type {boolean}
   * @memberOf DataTableSelectorComponent
   */
  @Input() debug: boolean = false;


  /**
   * Sortmodus: single|multiple 
   * 
   * @type {string}
   * @memberOf DataTableSelectorComponent
   */
  @Input() sortMode: string = 'single';

  /**
   * Anzahl der anzuzeigenden Gridzeilen
   * 
   * @type {number}
   * @memberOf DataTableSelectorComponent
   */
  @Input() rows: number = 5;


  /**
   * Die Spaltenkonfiguration.
   * 
   * @type {IDataTableSelectorConfig}
   * @memberOf DataTableSelectorComponent
   */
  @Input() config: IDataTableSelectorConfig;


  /**
   * angebundene Objektliste statt Liste von Entities aus DB.
   * 
   * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
   * 
   * @type {any[]}
   * @memberOf DataTableSelectorComponent
   */
  @Input() data: any;

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
  @Input() selectedIndex: number = -1;


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
  @Input() selectedValue: any = {};

  constructor(router: Router, service: ProxyService, private metadataService: MetadataService,
    private injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
    super(router, service);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.data) {
      Assert.that(!this.dataService, `Wenn Property data gesetzt ist, darf dataService nicht gleichzeitig gesetzt sein.`);

      this.preselectData();
      this.setupColumnInfosByReflection();
    } else {
      Assert.notNull(this.dataService, `Wenn Property data nicht gesetzt ist, muss dataService gesetzt sein.`);

      this.service.proxyService(this.dataService);

      // this.setupProxy(this.entityName);
      this.service.find()
        .subscribe(
        items => {
          this.data = items;

          this.preselectData();
          this.setupColumnInfosByMetadata();
        },
        (error: Error) => {
          this.handleError(error);
        });
    }

  }


  /**
   * Falls ein positiver und gültiger selectedIndex angegeben ist, wird der selectedValue auf des 
   * entsprechende Item gesetzt. 
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  private preselectData() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.data.length) {
      this.selectedValue = this.data[this.selectedIndex];
    }
  }


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  private setupColumnInfosByMetadata() {
    if (!this.config) {
      let columnInfos: IColumnInfo[] = [];

      let tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());
      let columnMetadata = tableMetadata.columnMetadata;

      for (let cm of tableMetadata.columnMetadata) {
        if (cm.options.displayName) {
          columnInfos.push(<IColumnInfo>{
            label: cm.options.displayName,
            field: cm.propertyName
          });
        }
      }

      this.config = {
        columnInfos: columnInfos
      }
    }
  }


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über Reflection erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  private setupColumnInfosByReflection() {
    if (!this.config) {
      let columnInfos: IColumnInfo[] = [];

      if (this.data.length > 0) {

        // alle Properties des ersten Items über Reflection ermitteln        
        let props = Reflect.ownKeys(this.data[0]);

        // ... und dann entsprechende ColumnInfos erzeugen
        for (let propName of props) {
          columnInfos.push(<IColumnInfo>{
            label: propName,
            field: propName
          });
        }
      }

      this.config = {
        columnInfos: columnInfos
      }
    }
  }


  public onRowSelect(row) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      console.log(`DataTableSelectorComponent.onRowSelect: ${JSON.stringify(row)}`);
    }
    this.selectedValueChange.emit(row);
  }
}