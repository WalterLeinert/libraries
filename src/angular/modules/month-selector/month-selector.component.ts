import { Component, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Types } from '@fluxgate/common';

import { PrimeNgCalendarLocale } from '../../../primeng/calendarLocale';
import { MetadataService } from '../../services';
import { SelectorBaseComponent } from '../common/selectorBase.component';


/**
 * Interaface für Monatsdaten
 */
export interface IMonth {

  /**
   * laufende Nummer (1..12)
   */
  id: number;

  /**
   * Monatsname (für locale=de: z.B. 'Januar')
   */
  name: string;

  /**
   * Monatskurzname (für locale=de: z.B. 'Jan')
   */
  shortname: string;
}


@Component({
  selector: 'flx-month-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="months" [(selectedValue)]="selectedValue"
    [textField]="textField" [valueField]="valueField"
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

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'selectedValue' übernommen werden soll.
   *
   * @type {string}
   * @memberOf MonthSelectorComponent
   */
  @Input() public valueField: string = '.';


  constructor(router: Router, metadataService: MetadataService, changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);

    this.style = '{\'width\':\'150px\'}';
  }


  // tslint:disable-next-line:use-life-cycle-interface
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