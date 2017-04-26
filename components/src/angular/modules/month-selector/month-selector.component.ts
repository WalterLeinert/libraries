import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { DisplayInfo, MessageService, MetadataService, PrimeNgCalendarLocale } from '@fluxgate/client';
import { Types } from '@fluxgate/core';


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
<flx-dropdown-selector [data]="months" [(ngModel)]="value"
  [textField]="textField" [valueField]="valueField"
  [style]="style"
  [debug]="debug" name="monthSelector">
</flx-dropdown-selector>
`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MonthSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: MonthSelectorComponent,
      multi: true,
    }
  ]

})
export class MonthSelectorComponent extends SelectorBaseComponent<number> {

  public months: IMonth[] = [
  ];

  @ViewChild(NgModel) public model: NgModel;

  /**
   * Die textField-Property: steuert, welche Property in @see{IMonth} angezeigt wird.
   *
   * @type {string}
   * @memberOf MonthSelectorComponent
   */
  @Input() public textField: string = 'name';

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'value' übernommen werden soll.
   *
   * @type {string}
   * @memberOf MonthSelectorComponent
   */
  @Input() public valueField: string = DisplayInfo.CURRENT_ITEM;


  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

    this.style = {
      width: '150px'
    };
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();

    this.updateData();
  }

  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      monthError: {
        valid: false
      },
    };
  }


  protected onLocaleChange(value: string) {
    super.onLocaleChange(value);
    this.updateData();
  }


  /**
   * Liefert den Wert für das Item @param{item} (wird bei Änderung der Selektion angebunden)
   * Konfiguration muss berücksichtigt werden.
   */
  private getValue(item: any): any {
    let value: any;

    if (this.valueField === DisplayInfo.CURRENT_ITEM) {
      value = item;
    } else {
      value = item[this.valueField];
    }

    return value;
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
    }

    this.months = months;

    if (this.value === undefined) {
      // den aktuellen Monat vorselektieren
      const thisMonth = new Date().getMonth() + 1;

      const month = months.find((item, index, items) => {
        return item.id === thisMonth;
      });

      this.value = this.getValue(month);
    }
  }

}