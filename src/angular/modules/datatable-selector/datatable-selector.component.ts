// Angular
import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, PipeTransform } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

// Fluxgate
import { Assert, Clone, ColumnTypes, StringUtil, TableMetadata, Types } from '@fluxgate/common';

// -------------------------- logging -------------------------------
import {
  configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { IService } from '../../services';
import { MetadataService, PipeService, PipeType, ProxyService } from '../../services';

import { ControlDisplayInfo, DataTypes, IControlDisplayInfo, IEnumDisplayInfo } from '../../../base';
import { ControlType } from '../common';

import { TextAlignments } from '../../../base';
import { ListSelectorComponent } from '../common/list-selector.component';
import { DropdownSelectorComponent, IDropdownSelectorConfig } from '../dropdown-selector';
import { IDataTableSelectorConfig } from './datatable-selectorConfig.interface';

export type sortMode = 'single' | 'multiple' | '';

export type selectionMode = 'single' | 'multiple' | '';


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
    [editable]="editable"
    [selectionMode]="selectionMode" [(selection)]="selectedValue">
    
    <div *ngIf="configInternal && configInternal.columnInfos">    <!-- div *ngIf="configInternal -->
      <ul *ngFor="let info of configInternal.columnInfos">

            
        <!--
          normale Text-/Eingabefelder
          -->
        <div *ngIf="info.controlType === controlType.Input">          
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="editable">

            <div [style.text-align]="info.textAlignment">
              <template let-col let-data="rowData" pTemplate="body">
                  <span [style.color]="'red'">{{ formatValue(data[col.field], info) }}</span>
              </template>
            </div>

            <!--
            <template let-col let-data="rowData" pTemplate="editor">
              {{ data[col.field] }}
            </template>
            -->

          </p-column>
        </div>

        <!--
          Datumsfelder
          -->
        <div *ngIf="info.controlType === controlType.Date">
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="editable" [style]="{'overflow':'visible' }">

            <div [style.text-align]="info.textAlignment">
              <template let-col let-data="rowData" pTemplate="body">
                <span [style.color]="'green'">{{ formatValue(data[col.field], info) }}</span>
              </template>
            </div>

            <template let-col let-data="rowData" pTemplate="editor">
                <p-calendar [(ngModel)]="data[col.field]" dateFormat="yy-mm-dd" [style.color]="'green'"></p-calendar>
            </template>

          </p-column>
        </div>


        <!--
          Dropdown/Wertelisten
          -->
        <div *ngIf="info.controlType === controlType.DropdownSelector">
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="editable" [style]=" {'overflow':'visible' }">

            <div [style.text-align]="info.textAlignment">
              <template let-col let-data="rowData" pTemplate="body">
                <flx-enum-value [dataService]="info.enumInfo.selectorDataService" 
                  [textField]="info.enumInfo.textField" [valueField]="info.enumInfo.valueField"
                  [itemSelector]="data[col.field]"
                  [style]="{'width':'100%'}" [style.color]="'yellow'" name="flxEnumValue">
                </flx-enum-value>
              </template>
            </div>

            <template let-col let-data="rowData" pTemplate="editor">
              <flx-dropdown-selector [dataService]="info.enumInfo.selectorDataService" 
                [textField]="info.enumInfo.textField" [valueField]="info.enumInfo.valueField"
                [(selectedValue)]="data[col.field]"            
                [style]="{'width':'100%'}" [style.color]="'yellow'" name="flxDropdownSelector" [debug]="false">
              </flx-dropdown-selector>
            </template>

          </p-column>
        </div>

      </ul>
    </div>      <!-- div *ngIf="configInternal -->

  </p-dataTable>
</div>

<div *ngIf="debug">
  <p>selectedIndex: {{selectedIndex}}, selectedValue: {{selectedValue | json}}</p>
</div>
  `,
  styles: []
})
export class DataTableSelectorComponent extends ListSelectorComponent {
  protected static logger = getLogger(DataTableSelectorComponent);

  /**
   * ControlType Werte
   */
  public controlType = ControlType;

  /**
   * selectionMode: single|multiple
   * 
   * @type {selectionMode}
   * @memberOf DataTableSelectorComponent
   */
  private _selectionMode: selectionMode = 'single';

  private selectionModeSaved: selectionMode;


  /**
   * Sortmodus: single|multiple 
   * 
   * @type {sortMode}
   * @memberOf DataTableSelectorComponent
   */
  private _sortMode: sortMode = 'single';

  /**
   * falls true, ist sind die Spalten sortierbar
   *
   * @type {boolean}
   */
  @Input() public sortable: boolean = true;

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
    private injector: Injector,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);
  }

  // tslint:disable-next-line:use-life-cycle-interface
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
    using(new XLog(DataTableSelectorComponent.logger, levels.DEBUG, 'setupConfig'), (log) => {
      if (log.isDebugEnabled) {
        log.log(`no of items = ${items ? items.length : 'undefined'},` +
          ` tableMetadata = ${tableMetadata ? tableMetadata.className : 'undefined'}`);
      }

      if (this.config) {
        this.configInternal = this.config;

        // Defaults übernehmen
        for (const colInfo of this.configInternal.columnInfos) {
          if (colInfo.editable === undefined) {
            colInfo.editable = ControlDisplayInfo.DEFAULT.editable;
          }

          if (tableMetadata) {
            const colMetaData = tableMetadata.getColumnMetadataByProperty(colInfo.valueField);

            if (colInfo.dataType === undefined) {
              colInfo.dataType = DataTypes.mapColumnTypeToDataType(colMetaData.propertyType);
            }

            if (colInfo.dataType === DataTypes.DATE) {
              colInfo.controlType = ControlType.Date;
            }

            if (colMetaData.enumMetadata) {
              if (!colInfo.enumInfo) {

                const enumTableMetadata = this.metadataService.findTableMetadata(colMetaData.enumMetadata.dataSource);
                colInfo.enumInfo = {
                  selectorDataService: this.injector.get(enumTableMetadata.service),
                  textField: colMetaData.enumMetadata.textField,
                  valueField: colMetaData.enumMetadata.valueField
                };

                // if (colInfo.controlType === undefined) {
                colInfo.controlType = ControlType.DropdownSelector;
                // }
              }
            }

          }

          if (!colInfo.textAlignment && ControlDisplayInfo.isRightAligned(colInfo.dataType)) {
            colInfo.textAlignment = TextAlignments.RIGHT;
          }

          if (colInfo.controlType === undefined) {
            colInfo.controlType = ControlDisplayInfo.DEFAULT.controlType;
          }

        }

      } else {

        // metadata/reflect
        if (tableMetadata) {
          this.setupColumnInfosByMetadata(items, tableMetadata);
        } else {
          this.setupColumnInfosByReflection(items);
        }
      }

      if (log.isDebugEnabled) {
        log.log(`configInternal : ${JSON.stringify(this.configInternal)}`);
      }

    });
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
   * Überwachung der editable-Property: false editable -> Selektionsmöglichkeit ausschalten
   * 
   * @protected
   * @param {boolean} value
   * 
   * @memberOf DataTableSelectorComponent  
   */
  protected onEditableChange(value: boolean) {
    super.onEditableChange(value);

    if (value !== undefined) {
      if (value) {
        this.selectedValue = undefined;

        this.selectionModeSaved = this.selectionMode;
        this.selectionMode = undefined;
      } else {
        this.selectionMode = this.selectionModeSaved;
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
  private setupColumnInfosByMetadata(items: any[], tableMetadata: TableMetadata) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');
    Assert.notNull(tableMetadata);

    const columnInfos: IControlDisplayInfo[] = [];

    for (const metaData of tableMetadata.columnMetadata) {
      if (metaData.options.displayName) {
        const dataType = DataTypes.mapColumnTypeToDataType(metaData.propertyType);
        columnInfos.push(
          new ControlDisplayInfo(
            {
              textField: metaData.options.displayName,
              valueField: metaData.propertyName,
              dataType: dataType,
              style: undefined,
              textAlignment: (ControlDisplayInfo.isRightAligned(dataType)) ? TextAlignments.RIGHT : TextAlignments.LEFT,
              controlType: ControlType.Input
            }
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
            {
              textField: propName.toString(),
              valueField: propName.toString()
            }
          )
        );
      }
    }

    this.configInternal = {
      columnInfos: columnInfos
    };
  }

  /**
   * Property selectionMode
   */
  public get selectionMode(): selectionMode {
    return this._selectionMode;
  }

  @Input() public set selectionMode(value: selectionMode) {
    if (this._selectionMode !== value) {
      this._selectionMode = value;
    }
  }


  /**
   * Property sortMode
   */
  public get sortMode(): sortMode {
    return this._sortMode;
  }

  @Input() public set sortMode(value: sortMode) {
    if (this._sortMode !== value) {
      this._sortMode = value;

      if (!this._sortMode) {
        this.sortable = false;
      } else {
        this.sortable = true;
      }
    }
  }

}