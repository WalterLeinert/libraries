// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { IDropdownAdapter } from '../../common/adapter';

export class Tuple<T1, T2, T3> {
  constructor(public v1: T1, public v2: T2, public v3?: T3) {
  }
}



@Component({
  selector: 'flx-datatable-selector',
  template: `
<div class="ui-g-3">
  <!-- filter -->
  <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
    <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
    <input #gb type="text" pInputText size="20" style="float:left" placeholder="search...">
  </div>

  <p-dataTable [value]="dropdownAdapter.data" sortMode="multiple" resizableColumns="true" [rows]="20" [paginator]="true" [globalFilter]="gb"
    selectionMode="single" [(selection)]="selectedValue" (onRowSelect)="onRowSelect($event)">
    <p-column field="lastname" header="Lastname" [sortable]="true"></p-column>
    <p-column field="firstname" header="Firstname" [sortable]="true"></p-column>
    </p-dataTable>
</div>
  `,
  styles: []
})
export class DataTableSelectorComponent implements OnInit {
  @Input() debug: boolean = true;     // TODO: wenn implementierung fertig auf false setzen
  @Input() allowNoSelectionText: string = 'Auswahl';
  @Input() allowNoSelection: boolean = false;
  @Input() selectedIndex: number = -1;
  @Input() dropdownAdapter: IDropdownAdapter;

  @Input() textField: string = 'text';
  @Input() valueField: string = 'value';
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() selectedValue: any = {};

  constructor() {
  }

  ngOnInit() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.dropdownAdapter.data.length) {
      this.dropdownAdapter.getValueAt(this.selectedIndex)
        .subscribe(item => this.selectedValue = item);
    }
  }

  ngOnDestroy() {
  }

  public onRowSelect(event) {
    console.log(`onSelectionChanged: ${JSON.stringify(event.value)}`);
    this.selectedValue = event.value;
    this.selectionChanged.emit(event.value);
  }
}