// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { IDropdownAdapter } from '../../common/adapter';
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

  <p-dataTable [value]="dropdownAdapter.data" sortMode="sortMode" resizableColumns="true" [rows]="rows" 
    [paginator]="true" [globalFilter]="gb"
    selectionMode="single" [(selection)]="selectedValue" (onRowSelect)="onRowSelect($event.data)">
    <ul *ngFor="let info of config.columnInfos">
      <p-column field="{{info.field}}" header="{{info.label}}" [sortable]="true"></p-column>
    </ul>
    </p-dataTable>
</div>
<div *ngIf="debug">
  <p>Selected Item: {{selectedValue | json}}</p>
</div>
  `,
  styles: []
})
export class DataTableSelectorComponent implements OnInit {

  /**
   * falls true, wird Debug-Info beim Control angezeigt
   * 
   * @type {boolean}
   * @memberOf DataTableSelectorComponent
   */
  @Input() debug: boolean = true;     // TODO: wenn implementierung fertig auf false setzen


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
   * der zugehörige Adapter für die Anbindung der Daten für die Werteliste
   * 
   * @type {IDropdownAdapter}
   * @memberOf DropdownSelectorComponent
   */
  @Input() dropdownAdapter: IDropdownAdapter;


  /**
   * 
   * 
   * @type {IDataTableSelectorConfig}
   * @memberOf DataTableSelectorComponent
   */
  @Input() config: IDataTableSelectorConfig = {
    columnInfos: [
      { label: 'Name', field: 'name' },
      { label: 'Nummer', field: 'nummer' },
      { label: 'Saison', field: 'saison' }
    ]
  };

  /**
   *  angebundene Objektliste (TODO: nur zum Test)
   * 
   * @type {any[]}
   * @memberOf DataTableSelectorComponent
   */
  @Input() data: any[] = [];


  /**
   * Index der initial zu selektierenden Zeile (0..n-1)
   * 
   * @type {number}
   * @memberOf DataTableSelectorComponent
   */
  @Input() selectedIndex: number = -1;


  /**
   * selectedValueChanged Event: wird bei jeder Selektionsänderung gefeuert.
   * 
   * Eventdaten: @type{any} - selektiertes Objekt.
   * 
   * @memberOf DataTableSelectorComponent
   */
  @Output() selectedValueChanged = new EventEmitter<any>();


  /**
   * das aktuell selektierte Objekt
   * 
   * @type {*}
   * @memberOf DataTableSelectorComponent
   */
  @Input() selectedValue: any = {};


  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.dropdownAdapter.data.length) {
      this.dropdownAdapter.getValueAt(this.selectedIndex)
        .subscribe(item => this.selectedValue = item);
    }
  }

  ngOnDestroy() {
  }

  public onRowSelect(row) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      console.log(`DataTableSelectorComponent.onSelectionChanged: ${JSON.stringify(row)}`);
    }
    this.selectedValueChanged.emit(row);
  }
}