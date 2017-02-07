// Angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, PipeTransform } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

// Fluxgate
import { Assert, Clone, ColumnTypes, StringUtil, TableMetadata, Types } from '@fluxgate/common';

import { IService } from '../../services';
import { MetadataService, PipeService, PipeType, ProxyService } from '../../services';

import { ControlDisplayInfo, DataTypes, IControlDisplayInfo } from '../../../base';
import { ControlType } from '../common';

import { TextAlignments } from '../../../base';
import { ListSelectorComponent } from '../common/list-selector.component';
import { IDataTableSelectorConfig } from './datatable-selectorConfig.interface';

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

  <p-dataTable [(value)]="dataItems" sortMode="sortMode" resizableColumns="true" [rows]="rows"
    [paginator]="true" [globalFilter]="gb"
    selectionMode="single" [(selection)]="selectedValue" (onRowSelect)="onRowSelect($event.data)">
    
    <div *ngIf="configInternal && configInternal.columnInfos">
      <ul *ngFor="let info of configInternal.columnInfos">

        <p-column field="{{info.valueField}}" header="{{info.textField}}"
          [sortable]="true" [editable]="editable">
    
          <div *ngIf="info.controlType === controlType.Input">
            <template let-col let-data="rowData" pTemplate="body">
              <div [style.text-align]="info.textAlignment">
                <span>{{ formatValue(data[col.field], info) }}</span>
              </div>
            </template>
          </div>

          <div *ngIf="info.controlType === controlType.Date">
            <template let-col let-data="rowData" pTemplate="body">
              <div [style.text-align]="info.textAlignment">
                <p-calendar [(ngModel)]="data[col.field]" dateFormat="yyyy-mm-dd" [readonlyInput]="true"></p-calendar>
              </div>
            </template>          
          </div>

        </p-column>
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
   * ControlType Werte
   */
  public controlType = ControlType;


  /**
   * Sortmodus: single|multiple 
   * 
   * @type {string}
   * @memberOf DataTableSelectorComponent
   */
  @Input() public sortMode: string = 'single';

  /**
   * Anzahl der anzuzeigenden Gridzeilen
   * 
   * @type {number}
   * @memberOf DataTableSelectorComponent
   */
  @Input() public rows: number = 5;

  /**
   * Die Spaltenkonfiguration, die von aussen gesetzt werden kann.
   * 
   * @type {IDataTableSelectorConfig}
   * @memberOf DataTableSelectorComponent
   */
  private _config: IDataTableSelectorConfig;

  /**
   * Die Spaltenkonfiguration, die intern verwendet wird.
   * Entweder wird sie von @see{config} übernommen oder automatisch über die @see{dataItems} erzeugt.
   * 
   * @type {IDataTableSelectorConfig}
   * @memberOf DataTableSelectorComponent
   */
  public configInternal: IDataTableSelectorConfig;

  public dataItems: any[];


  constructor(router: Router, metadataService: MetadataService, private pipeService: PipeService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.sortMode) {
      Assert.that(this.sortMode === 'single' || this.sortMode === 'multiple');
    }
  }


  public get config(): IDataTableSelectorConfig {
    return this._config;
  }

  @Input() public set config(value: IDataTableSelectorConfig) {
    this._config = value;
    this.initBoundData(this.dataItems, super.getMetadataForValues(this.dataItems));
  }

  public onRowSelect(row) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      console.log(`DataTableSelectorComponent.onRowSelect: ${JSON.stringify(row)}`);
    }
    this.selectedValueChange.emit(row);
  }


  /**
   * Formatiert den Wert @param{value} mittels der Information in @param{info}
   * 
   * @param {*} value
   * @param {IControlDisplayInfo} info
   * @returns {*}
   * 
   * @memberOf DataTableSelectorComponent
   */
  public formatValue(value: any, info: IControlDisplayInfo): any {
    Assert.notNull(info);

    let pipe: PipeTransform;

    if (info.pipe) {
      if (Types.isString(info.pipe)) {
        const pipeString = info.pipe as PipeType;

        // Die Pipe wird on-demand erzeugt
        // Assert.that(this.pipeService.hasPipe(pipeString, info.pipeLocale),
        //   `Die Pipe ${pipeString} (locale: ${info.pipeLocale}) ist nicht verfügbar.`);

        pipe = this.pipeService.getPipe(pipeString, info.pipeLocale);
      } else {
        pipe = info.pipe as PipeTransform;
      }

      return pipe.transform(value, info.pipeArgs);
    }
    return value;
  }


  protected initBoundData(items: any[], tableMetadata: TableMetadata) {
    this.dataItems = undefined;

    super.initBoundData(items, tableMetadata);
  }

  protected setupData(items: any[]) {
    this.dataItems = items;
  }


  protected setupConfig(items: any[], tableMetadata: TableMetadata) {
    if (this.config) {
      this.configInternal = this.config;

      // Defaults übernehmen
      for (const colInfo of this.configInternal.columnInfos) {
        if (colInfo.controlType === undefined) {
          colInfo.controlType = ControlDisplayInfo.DEFAULT.controlType;
        }

        if (colInfo.readonly === undefined) {
          colInfo.readonly = ControlDisplayInfo.DEFAULT.readonly;
        }

        if ((colInfo.dataType === undefined) && tableMetadata) {
          const colMetaData = tableMetadata.getColumnMetadataByProperty(colInfo.valueField);
          colInfo.dataType = DataTypes.mapColumnTypeToDataType(colMetaData.propertyType);
        }

        if (!colInfo.textAlignment && ControlDisplayInfo.isRightAligned(colInfo.dataType)) {
          colInfo.textAlignment = TextAlignments.RIGHT;
        }
      }

      return;
    }


    // metadata/reflect
    if (tableMetadata) {
      this.setupColumnInfosByMetadata(items, tableMetadata);
    } else {
      this.setupColumnInfosByReflection(items);
    }
  }


  protected get isDataEmpty(): boolean {
    return !(this.dataItems && this.dataItems.length > 0);
  }

  protected getDataValue(index: number): any {
    return this.getValue(this.dataItems[index]);
  }

  protected get dataLength(): number {
    if (this.isDataEmpty) {
      return 0;
    }
    return this.dataItems.length;
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
    if (this.dataItems) {
      for (let index = 0; index < this.dataItems.length; index++) {
        const item = this.dataItems[index];
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



  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  private setupColumnInfosByMetadata(items: any[], tableMetadata: TableMetadata) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');
    Assert.notNull(tableMetadata);

    const columnInfos: IControlDisplayInfo[] = [];

    for (const metaData of tableMetadata.columnMetadata) {
      if (metaData.options.displayName) {
        const dataType = DataTypes.mapColumnTypeToDataType(metaData.propertyType);
        columnInfos.push(
          new ControlDisplayInfo(
            metaData.options.displayName,
            metaData.propertyName,
            dataType,
            undefined,
            (ControlDisplayInfo.isRightAligned(dataType)) ? TextAlignments.RIGHT : TextAlignments.LEFT,
            ControlType.Input
          )
        );
      }
    }

    this.configInternal = {
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
  private setupColumnInfosByReflection(items: any[]) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');

    const columnInfos: IControlDisplayInfo[] = [];

    if (items && items.length > 0) {

      // alle Properties des ersten Items über Reflection ermitteln        
      const props = Reflect.ownKeys(items[0]);

      // ... und dann entsprechende ColumnInfos erzeugen
      for (const propName of props) {
        columnInfos.push(
          new ControlDisplayInfo(
            propName.toString(),
            propName.toString()
          )
        );
      }
    }

    this.configInternal = {
      columnInfos: columnInfos
    };
  }

}