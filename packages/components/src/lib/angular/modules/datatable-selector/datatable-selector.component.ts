// Angular
import { Component, EventEmitter, Injector, Input, Output, PipeTransform, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';



// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


// Fluxgate
import {
  ControlType, IControlDisplayInfo, MessageService, MetadataService, PipeService, PipeType
} from '@fluxgate/client';
import { TableMetadata } from '@fluxgate/common';
import { Assert, Clone, Color, Core, InstanceAccessor, Types } from '@fluxgate/core';

import { ListSelectorComponent } from '../common/list-selector.component';
import { IDataTableSelectorConfig } from './datatable-selectorConfig.interface';
import { DataTableSelectorConfiguration } from './dataTableSelectorConfiguration';

export type sortMode = 'single' | 'multiple' | '';

export type selectionMode = 'single' | 'multiple' | '';


/**
 * Komponente DataTableSelector (Selektion eines Objekts aus einer Objektliste über eine PrimeNG-DataTable)
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

  <p-dataTable [value]="dataItems" sortMode="sortMode" resizableColumns="true" [rows]="rows"
    [paginator]="true" [globalFilter]="gb"
    [editable]="editable"
    [selectionMode]="selectionMode" [(selection)]="value">

    <div *ngIf="configInternal && configInternal.columnInfos">    <!-- div *ngIf="configInternal -->
      <ul *ngFor="let info of configInternal.columnInfos">


        <!--
          normale Text-/Eingabefelder
          -->
        <div *ngIf="info.controlType === controlType.Input">
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="isEditable(info)">

            <div [style.text-align]="info.textAlignment">
              <ng-template let-col let-data="rowData" pTemplate="body">
                  <span [style.color]="getColor(data, info)">{{ formatValue(data[col.field], info) }}</span>
              </ng-template>
            </div>

            <!--
            <ng-template let-col let-data="rowData" pTemplate="editor">
              {{ data[col.field] }}
            </ng-template>
            -->

          </p-column>
        </div>

        <!--
          Datumsfelder
          -->
        <div *ngIf="info.controlType === controlType.Date">
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="isEditable(info)" [style]="{'overflow':'visible' }">

            <div [style.text-align]="info.textAlignment">
              <ng-template let-col let-data="rowData" pTemplate="body">
                <span [style.color]="getColor(data, info)">{{ formatValue(data[col.field], info) }}</span>
              </ng-template>
            </div>

            <ng-template let-col let-data="rowData" pTemplate="editor">
                <p-calendar [(ngModel)]="data[col.field]"
                  dateFormat="yy-mm-dd" [minDate]="getMinDate(data, info)" [maxDate]="getMaxDate(data, info)"
                  [style.color]="getColor(data, info)">
                </p-calendar>
            </ng-template>

          </p-column>
        </div>


        <!--
          Zeitfelder
          -->
        <div *ngIf="info.controlType === controlType.Time">
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="isEditable(info)" [style]="{'overflow':'visible' }">

            <div [style.text-align]="info.textAlignment">
              <ng-template let-col let-data="rowData" pTemplate="body">
                <span [style.color]="getColor(data, info)">{{ formatValue(data[col.field], info) }}</span>
              </ng-template>
            </div>

            <ng-template let-col let-data="rowData" pTemplate="editor">
                <flx-time-selector [(ngModel)]="data[col.field]" [style.color]="getColor(data, info)">
                </flx-time-selector>
            </ng-template>

          </p-column>
        </div>


        <!--
          Dropdown/Wertelisten
          -->
        <div *ngIf="info.controlType === controlType.DropdownSelector">
          <p-column field="{{info.valueField}}" header="{{info.textField}}"
            [sortable]="sortable" [editable]="isEditable(info)" [style]=" {'overflow':'visible' }">

            <div [style.text-align]="info.textAlignment">
              <ng-template let-col let-data="rowData" pTemplate="body">
                <flx-enum-value [dataServiceRequests]="info.enumInfo.selectorDataServiceRequests"
                  [textField]="info.enumInfo.textField" [valueField]="info.enumInfo.valueField"
                  [itemSelector]="data[col.field]"
                  [style]="{'width':'100%'}" [style.color]="getColor(data, info)"
                  name="flxEnumValue">
                </flx-enum-value>
              </ng-template>
            </div>

            <ng-template let-col let-data="rowData" pTemplate="editor">
              <flx-dropdown-selector [dataServiceRequests]="info.enumInfo.selectorDataServiceRequests"
                [textField]="info.enumInfo.textField" [valueField]="info.enumInfo.valueField"
                [(ngModel)]="data[col.field]"
                [style]="{'width':'100%'}" [style.color]="getColor(data, info)"
                name="flxDropdownSelector" [debug]="false">
              </flx-dropdown-selector>
            </ng-template>

          </p-column>
        </div>

      </ul>

      <!--
        Button zum Editieren
        -->
      <div *ngIf="showEditButton">
        <p-column styleClass="col-button" [style]="{width: '100px', 'text-align': 'center'}" >
          <ng-template pTemplate="header">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </ng-template>


          <ng-template let-data="rowData" pTemplate="body">
            <div *ngIf="isEditing(data)">
              <div>
                <button pButton type="text" class="ui-button-secondary"
                  icon="fa-check" (click)="saveRow(data)" pTooltip="Save changes">
                </button>
                <button pButton type="text" class="ui-button-secondary"
                  icon="fa-times" (click)="cancelEdit(data)" pTooltip="Cancel changes">
                </button>
              </div>
            </div>

            <div *ngIf="!isEditing(data)">
              <div>
                <button pButton type="text" class="ui-button-secondary"
                  icon="fa-pencil" (click)="editRow(data)" pTooltip="Edit row">
                </button>
              </div>
            </div>
          </ng-template>

        </p-column>
      </div>

    </div>      <!-- div *ngIf="configInternal -->

  </p-dataTable>
</div>

<div *ngIf="debug">
  <p>selectedIndex: {{selectedIndex}}, value: {{value | json}}</p>
</div>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DataTableSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DataTableSelectorComponent,
      multi: true,
    }
  ]
})
export class DataTableSelectorComponent extends ListSelectorComponent<any> {
  protected static logger = getLogger(DataTableSelectorComponent);

  /**
   * ControlType Werte
   */
  public controlType = ControlType;

  private configurator: DataTableSelectorConfiguration;

  /**
   * selectionMode: single|multiple
   */
  private _selectionMode: selectionMode = 'single';

  private selectionModeSaved: selectionMode;


  @ViewChild(NgModel) public model: NgModel;

  /**
   * falls true, wird hinter der letzten Spalte eine Spalte mit Edit-Button angezeigt
   */
  @Input() public showEditButton: boolean = false;


  /**
   * Sortmodus: single|multiple
   */
  private _sortMode: sortMode = 'single';

  /**
   * falls true, ist sind die Spalten sortierbar
   */
  @Input() public sortable: boolean = true;

  /**
   * Anzahl der anzuzeigenden Gridzeilen
   */
  @Input() public rows: number = 5;

  /**
   * Die Spaltenkonfiguration, die von aussen gesetzt werden kann.
   */
  private _config: IDataTableSelectorConfig;

  /**
   * Die Spaltenkonfiguration, die intern verwendet wird.
   * Entweder wird sie von @see{config} übernommen oder automatisch über die @see{dataItems} erzeugt.
   */
  public configInternal: IDataTableSelectorConfig;

  public dataItems: any[];


  /**
   * die Daten der aktuell editierten Zeile
   */
  private editedRow: any;

  /**
   * die geklonten Daten der aktuell editierten Zeile
   */
  private savedRow: any;

  /**
   * wird gefeuert, falls die geänderte Zeile gespeichert werden soll.
   */
  @Output() public saveEditedRow = new EventEmitter<any>();


  /**
   * Creates an instance of DataTableSelectorComponent.
   *
   * @param router
   * @param metadataService
   * @param pipeService
   * @param injector
   * @param changeDetectorRef
   */
  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    private pipeService: PipeService, private injector: Injector,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);
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
   * @param value
   * @param info
   * @returns
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


  /**
   * Wird bei Click auf den Edit-Button aufgerufen
   *
   * @param data - die Modelinstanz der aktuellen Zeile
   */
  public editRow(data: any) {
    using(new XLog(DataTableSelectorComponent.logger, levels.INFO, 'editRow',
      `editable = ${this.editable}`), (log) => {
        this.editable = true;
        this.savedRow = Clone.clone(data);
        this.editedRow = data;
      });
  }

  public saveRow(data: any) {
    using(new XLog(DataTableSelectorComponent.logger, levels.INFO, 'saveRow',
      `editable = ${this.editable}`), (log) => {
        this.editable = false;
        this.editedRow = undefined;
        this.savedRow = undefined;

        // Event zum Speichern
        this.onSaveEditedRow(data);
      });
  }

  public cancelEdit(data: any) {
    using(new XLog(DataTableSelectorComponent.logger, levels.INFO, 'cancelEdit',
      `editable = ${this.editable}`), (log) => {
        this.editable = false;
        this.editedRow = undefined;

        const dataIndex = this.dataItems.indexOf(data);
        Assert.that(dataIndex >= 0 && dataIndex < this.dataItems.length);

        // Daten restaurieren
        this.dataItems[dataIndex] = this.savedRow;

        this.savedRow = undefined;
      });
  }




  /**
   * Liefert true, falls die
   *
   * @param info
   * @returns
   */
  public isEditable(info: IControlDisplayInfo): boolean {
    return using(new XLog(DataTableSelectorComponent.logger, levels.DEBUG, 'isEditable',
      `editable = ${this.editable}, info.editable = ${info.editable !== undefined ? info.editable : undefined}`),
      (log) => {
        return this.editable && (info.editable !== undefined ? info.editable : true);
      });
  }


  public isEditing(data: any): boolean {
    return this.editedRow !== undefined;
  }


  public getColor(data: any, info: IControlDisplayInfo): string {
    Assert.notNull(data);
    Assert.notNull(info);

    if (info.color !== undefined) {
      if (info.color instanceof Color) {
        return info.color.toString();
      } else {
        return info.color(data).toString();
      }
    }
    return undefined;
  }

  /**
   * Liefert das minimal erlaubte Datum
   */
  public getMinDate(data: any, info: IControlDisplayInfo): Date {
    Assert.notNull(data);
    Assert.notNull(info);

    if (!Types.isUndefined(info.dateInfo)) {
      if (info.dateInfo.minDate !== undefined && info.dateInfo.minDate instanceof Date) {
        return info.dateInfo.minDate;
      } else {
        return (info.dateInfo.minDate as InstanceAccessor<any, Date>)(data);
      }
    }
    return undefined;
  }

  /**
   * Liefert das maximal erlaubte Datum
   */
  public getMaxDate(data: any, info: IControlDisplayInfo): Date {
    Assert.notNull(data);
    Assert.notNull(info);

    if (!Types.isUndefined(info.dateInfo)) {
      if (info.dateInfo.maxDate !== undefined && info.dateInfo.maxDate instanceof Date) {
        return info.dateInfo.maxDate;
      } else {
        return (info.dateInfo.maxDate as InstanceAccessor<any, Date>)(data);
      }
    }
    return undefined;
  }


  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      datatableError: {
        valid: false,
      },
    };
  }


  protected initBoundData(items: any[], tableMetadata: TableMetadata) {
    this.dataItems = undefined;

    this.selectedIndex = -1;
    this.value = undefined;

    super.initBoundData(items, tableMetadata);
  }

  protected setupData(items: any[]) {
    this.dataItems = items;
  }


  protected setupConfig(items: any[], tableMetadata: TableMetadata): void {
    using(new XLog(DataTableSelectorComponent.logger, levels.DEBUG, 'setupConfig'), (log) => {
      if (log.isDebugEnabled) {
        log.log(`no of items = ${items ? items.length : 'undefined'},` +
          ` tableMetadata = ${tableMetadata ? tableMetadata.className : 'undefined'}`);
      }

      if (this.config === undefined && tableMetadata === undefined) {
        return;
      }

      this.configurator = new DataTableSelectorConfiguration(tableMetadata, this.metadataService, this.injector);

      if (this.config) {
        this.configInternal = Clone.clone(this.config);

        this.configurator.configureConfig(this.configInternal);
      } else {
        this.configInternal = this.configurator.createConfig(this.config);
      }

      if (log.isDebugEnabled) {
        log.log(`configInternal : ${Core.stringify(this.configInternal)}`);
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
   * Liefert den Index des Items (value) in der Wertelist
   *
   * TODO: Achtung: funktionert nicht nach Umsortierung der DataTable !!
   *
   * @protected
   * @param value
   * @returns
   *
   * @memberOf DataTableSelectorComponent
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
   * @param value
   */
  protected onEditableChange(value: boolean) {
    super.onEditableChange(value);

    if (value !== undefined) {
      if (value) {
        this.value = undefined;

        this.selectionModeSaved = this.selectionMode;
        this.selectionMode = undefined;
      } else {
        this.selectionMode = this.selectionModeSaved;
      }
    }
  }


  protected onSaveEditedRow(row: any) {
    this.saveEditedRow.emit(row);
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