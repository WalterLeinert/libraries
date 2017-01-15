// Angular
import { Component, Input, OnInit } from '@angular/core';

import { IDropdownAdapter } from '../../common/adapter';

@Component({
  selector: 'flx-dropdown-selector',
  template: `
<p-dropdown [options]="dropDownAdapter.data" [(ngModel)]="selectedItem" (onChange)="onSelectionChanged($event)"></p-dropdown>
<p>Selected Item: {{selectedItem | json}}</p>
  `,
  styles: []
})
export class DropdownSelectorComponent implements OnInit {
  @Input() allowNoSelectionText: string = 'Auswahl';
  @Input() allowNoSelection: boolean = false;
  @Input() selectedIndex: number = -1;
  @Input() dropdownAdapter: IDropdownAdapter;

  public selectedItem: any;

  constructor() {
  }

  ngOnInit() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.dropdownAdapter.data.length) {
      this.selectedItem = this.dropdownAdapter.getValueAt(this.selectedIndex);
    }
  }

  public onSelectionChanged(event) {
    console.log(`onSelectionChanged: ${JSON.stringify(event.value)}`);
  }
}