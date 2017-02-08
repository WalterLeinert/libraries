import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Assert, Types } from '@fluxgate/common';

import { PrimeNgCalendarLocale } from '../../../primeng/calendarLocale';
import { MetadataService } from '../../services';
import { SelectorBaseComponent } from '../common/selectorBase.component';

export interface IMonth {
  id: number;
  name: string;
  shortname: string;
}


@Component({
  selector: 'flx-month-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="months" [(selectedValue)]="selectedValue"
    [style]="style"
    [debug]="debug" name="monthSelector">
  </flx-dropdown-selector>
</div>
`,
  styles: []
})
export class MonthSelectorComponent extends SelectorBaseComponent {

  public months: IMonth[] = [
  ];


  /**
   * Die textField-Property: steuert, welche Property in @see{IMonth} angezeigt wird.
   * 
   * @type {string}
   * @memberOf MonthSelectorComponent
   */
  @Input() public textField: string = 'name';


  constructor(router: Router, metadataService: MetadataService, changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);

    this.style = '{\'width\':\'150px\'}';
  }


  public ngOnInit() {
    super.ngOnInit();

    this.updateData();
  }

  protected onLocaleChange(value: string) {
    super.onLocaleChange(value);
    this.updateData();
  }


  private updateData() {
    let localeSettings = PrimeNgCalendarLocale[this.locale];
    if (Types.isUndefined(localeSettings)) {
      localeSettings = PrimeNgCalendarLocale.en;
    }

    const months = [];
    for (let month = 1; month <= 12; month++) {
      months.push({
        id: month,
        name: localeSettings.monthNames[month - 1],
        shortname: localeSettings.monthNamesShort[month - 1]
      });

      this.months = months;
    }
  }

}