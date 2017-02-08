import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Assert, Types } from '@fluxgate/common';

import { MetadataService } from '../../services';
import { SelectorBaseComponent } from '../common/selectorBase.component';

export interface IYearRange {
  lowerYear?: number;
  upperYear?: number;
}


@Component({
  selector: 'flx-year-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="years" [(selectedValue)]="selectedValue"
    [style]="style"
    [debug]="debug" name="yearSelector">
  </flx-dropdown-selector>
</div>
`,
  styles: []
})
export class YearSelectorComponent extends SelectorBaseComponent {
  public static readonly YEAR_MIN = 1900;
  public static readonly YEAR_MAX = 2050;

  private _yearRange: IYearRange;

  public years: number[] = [
    2017,
    2016,
    2015
  ];


  constructor(router: Router, metadataService: MetadataService, changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);

    this.style = '{\'width\':\'70px\'}';
  }


  public get yearRange(): IYearRange {
    return this._yearRange;
  }


  @Input() public set yearRange(value: IYearRange) {

    if (this._yearRange !== value) {
      this.years = [];

      if (!Types.isUndefined(value)) {
        let lowerYear = YearSelectorComponent.YEAR_MIN;
        let upperYear = new Date().getFullYear();

        if (!Types.isUndefined(value.lowerYear)) {
          Assert.that(value.lowerYear >= YearSelectorComponent.YEAR_MIN,
            `Das Anfangsjahr ${value.lowerYear} ist kleiner als ${YearSelectorComponent.YEAR_MIN}`);

          lowerYear = value.lowerYear;
        }

        if (!Types.isUndefined(value.upperYear)) {
          Assert.that(value.upperYear <= YearSelectorComponent.YEAR_MAX,
            `Das Endjahr ${value.lowerYear} ist größer als ${YearSelectorComponent.YEAR_MAX}`);

          upperYear = value.upperYear;
        }

        const years = [];
        for (let year = upperYear; year >= lowerYear; year--) {
          years.push(year);
        }

        this.years = years;
      }

      this._yearRange = value;
    }
  }
}