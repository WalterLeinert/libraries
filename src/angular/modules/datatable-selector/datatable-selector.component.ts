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
import {ListSelectorComponent} from '../common/list-selector.component';

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
        <p-column field="{{info.valueField}}" header="{{info.textField}}" [sortable]="true"></p-column>
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



  /**
   * Falls ein positiver und gültiger selectedIndex angegeben ist, wird der selectedValue auf des 
   * entsprechende Item gesetzt. 
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  protected preselectData() {
    super.preselectData();

    // TODO
    // if (!this.isPreselecting) {
    //   this.isPreselecting = true;
    //
    //   try {
    //     if (!this.data) {
    //       return;
    //     }
    //     if (this.selectedIndex >= 0 && this.selectedIndex < this.data.length) {
    //       this.selectedValue = this.data[this.selectedIndex];
    //     } else if (this.data.length > 0) {
    //       this.selectedValue = this.data[0];
    //     }
    //   } finally {
    //     this.isPreselecting = false;
    //   }
    // }
  }


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  protected setupColumnInfosByMetadata() {
    super.setupColumnInfosByMetadata();

    if (!this.config) {
      let columnInfos: IDisplayInfo[] = [];

      let tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());
      let columnMetadata = tableMetadata.columnMetadata;

      for (let cm of tableMetadata.columnMetadata) {
        if (cm.options.displayName) {
          columnInfos.push(<IDisplayInfo>{
            textField: cm.options.displayName,
            valueField: cm.propertyName
          });
        }
      }

      this.config = {
        columnInfos: columnInfos
      };
    }
  }


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über Reflection erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  protected setupColumnInfosByReflection() {
    super.setupColumnInfosByReflection();

    if (!this.config) {
      let columnInfos: IDisplayInfo[] = [];

      if (this.data.length > 0) {

        // alle Properties des ersten Items über Reflection ermitteln        
        let props = Reflect.ownKeys(this.data[0]);

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
  }


  public onRowSelect(row) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      console.log(`DataTableSelectorComponent.onRowSelect: ${JSON.stringify(row)}`);
    }
    this.selectedValueChange.emit(row);
  }

}