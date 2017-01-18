// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { IDropdownAdapter } from '../../common/adapter';

@Component({
  selector: 'flx-dropdown-selector',
  template: `
<p-dropdown [options]="dropdownAdapter.data" [(ngModel)]="selectedValue" (onChange)="onSelectionChanged($event)"></p-dropdown>
<div *ngIf="debug">
  <p>Selected Item: {{selectedValue | json}}</p>
</div>
`,
  styles: []
})
export class DropdownSelectorComponent implements OnInit {
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

  public onSelectionChanged(event) {
    console.log(`onSelectionChanged: ${JSON.stringify(event.value)}`);
    this.selectedValue = event.value;
    this.selectionChanged.emit(event.value);
  }
}