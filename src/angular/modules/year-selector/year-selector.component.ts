import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assert, Types } from '@fluxgate/common';


export interface IYearRange {
  lowerYear?: number;
  upperYear?: number;
}


@Component({
  selector: 'flx-year-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="years" [(selectedValue)]="selectedYear"
    [style]="{'width':'50px'}"
    [debug]="debug" name="yearSelector">
  </flx-dropdown-selector>
</div>
`,
  styles: []
})
export class YearSelectorComponent {
  public static readonly YEAR_MIN = 1900;
  public static readonly YEAR_MAX = 2050;

  private _yearRange: IYearRange;

  public years: number[] = [
    2017,
    2016,
    2015
  ];


  /**
   * falls true, wird Debug-Info beim Control angezeigt
   *
   * @type {boolean}
   * @memberOf YearSelectorComponent
   */
  @Input() public debug: boolean = false;

  /**
   * selectedYearChange Event: wird bei jeder Selektionsänderung gefeuert.
   *
   * Eventdaten: @type{number} - selektiertes Jahr.
   *
   * @memberOf YearSelectorComponent
   */
  @Output() public selectedYearChange = new EventEmitter<number>();


  /**
   * das aktuell selektierte Jahr
   *
   * @type {number}
   */
  private _selectedYear: number;



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


  // -------------------------------------------------------------------------------------
  // Property selectedValue und der Change Event
  // -------------------------------------------------------------------------------------

  protected onSelectedYearChange(value: number) {
    this.selectedYearChange.emit(value);
  }

  public get selectedYear(): number {
    return this._selectedYear;
  }

  @Input() public set selectedYear(value: number) {
    if (this._selectedYear !== value) {
      this._selectedYear = value;
      this.onSelectedYearChange(value);
    }
  }
}
