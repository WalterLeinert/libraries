import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Assert, Types } from '@fluxgate/common';

import { MetadataService } from '../../services';
import { SelectorBaseComponent } from '../common/selectorBase.component';

@Component({
  selector: 'flx-month-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="month" [(selectedValue)]="selectedValue"
    [style]="style"
    [debug]="debug" name="monthSelector">
  </flx-dropdown-selector>
</div>
`,
  styles: []
})
export class MonthSelectorComponent extends SelectorBaseComponent {

  public month: number[] = [
  ];

  constructor(router: Router, metadataService: MetadataService, changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);

    this.style = '{\'width\':\'70px\'}';

    for (let month = 1; month <= 12; month++) {
      this.month.push(month);
    }
  }

}