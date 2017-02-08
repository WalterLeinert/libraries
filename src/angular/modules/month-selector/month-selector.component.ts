import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assert, Types } from '@fluxgate/common';


@Component({
  selector: 'flx-month-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="month" [(selectedValue)]="selectedMonth"
    [style]="{'width':'50px'}"
    [debug]="debug" name="monthSelector">
  </flx-dropdown-selector>
</div>
`,
  styles: []
})
export class MonthSelectorComponent {

  public month: number[] = [
  ];


  /**
   * falls true, wird Debug-Info beim Control angezeigt
   *
   * @type {boolean}
   */
  @Input() public debug: boolean = false;

  /**
   * selectedMonthChange Event: wird bei jeder Selektionsänderung gefeuert.
   *
   * Eventdaten: @type{number} - selektierten Monat.
   *
   */
  @Output() public selectedMonthChange = new EventEmitter<number>();


  /**
   * das aktuell selektierter Monat
   *
   * @type {number}
   */
  private _selectedMonth: number;


  constructor() {
    for (let month = 1; month <= 12; month++) {
      this.month.push(month);
    }

  }

  // -------------------------------------------------------------------------------------
  // Property selectedValue und der Change Event
  // -------------------------------------------------------------------------------------

  protected onSelectedMonthChange(value: number) {
    this.selectedMonthChange.emit(value);
  }

  public get selectedMonth(): number {
    return this._selectedMonth;
  }

  @Input() public set selectedMonth(value: number) {
    if (this._selectedMonth !== value) {
      this._selectedMonth = value;
      this.onSelectedMonthChange(value);
    }
  }
}