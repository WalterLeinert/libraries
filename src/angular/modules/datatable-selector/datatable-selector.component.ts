// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

// Fluxgate
import { Assert } from '@fluxgate/common';

import { IService } from '../../services';
import { MetadataService, ProxyService } from '../../services';

import { IDisplayInfo } from '../../../base';

import { IDataTableSelectorConfig } from './datatable-selectorConfig.interface';
import { ListSelectorComponent } from '../common/list-selector.component';

export type sortMode = 'single' | 'multiple';


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
        <p-column field="{{info.valueField}}" header="{{info.textField}}" [sortable]="true" [editable]="editable"></p-column>
      </ul>
    </div>
    </p-dataTable>
</div>
<div *ngIf="debug">
  <p>selectedIndex: {{selectedIndex}}, selectedValue: {{selectedValue | json}}</p>
</div>
  `,
  styles: []
})
export class DataTableSelectorComponent extends ListSelectorComponent {


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


  constructor(router: Router, service: ProxyService, metadataService: MetadataService, changeDetectorRef: ChangeDetectorRef) {
    super(router, service, metadataService, changeDetectorRef);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.sortMode) {
      Assert.that(this.sortMode === 'single' || this.sortMode === 'multiple');
    }
  }

  protected setupData(items: any[]) {
    this.data = items;
  }


  protected setupConfig(items: any[], useService: boolean) {

    if (!this.config) {
      // metadata/reflect
      if (useService) {
        this.setupColumnInfosByMetadata(items);
      } else {
        this.setupColumnInfosByReflection(items);
      }

    }
  }

  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  protected setupColumnInfosByMetadata(items: any[]) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');

    let columnInfos: IDisplayInfo[] = [];

    let tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());

    for (let metaData of tableMetadata.columnMetadata) {
      if (metaData.options.displayName) {
        columnInfos.push(<IDisplayInfo>{
          textField: metaData.options.displayName,
          valueField: metaData.propertyName
        });
      }
    }

    this.config = {
      columnInfos: columnInfos
    };
  }


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über Reflection erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  protected setupColumnInfosByReflection(items: any[]) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');

    let columnInfos: IDisplayInfo[] = [];

    if (items && items.length > 0) {

      // alle Properties des ersten Items über Reflection ermitteln        
      let props = Reflect.ownKeys(items[0]);

      // ... und dann entsprechende ColumnInfos erzeugen
      for (let propName of props) {
        columnInfos.push(<IDisplayInfo>{
          textField: propName,
          valueField: propName
        });
      }
    }

    this.config = {
      columnInfos: columnInfos
    };
  }


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
  protected indexOfValue(value: any): number {
    let indexFound = -1;
    if (this.data) {
      for (let index = 0; index < this.data.length; index++) {
        let item = this.data[index];
        if (item === value) {
          indexFound = index;
          break;
        }
      }
    }

    return indexFound;
  }

  /**
   * Liefert den Wert für das Item @param{item} (wird bei Änderung der Selektion angebunden)
   * DataTable: es kann immer nur eine Zeile ausgewählt werden -> item
   */
  protected getValue(item: any): any {
    return item;
  }

  public onRowSelect(row) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      console.log(`DataTableSelectorComponent.onRowSelect: ${JSON.stringify(row)}`);
    }
    this.selectedValueChange.emit(row);
  }
}