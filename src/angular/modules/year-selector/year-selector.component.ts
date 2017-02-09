import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Assert, Types } from '@fluxgate/common';

import { MetadataService } from '../../services';
import { SelectorBaseComponent } from '../common/selectorBase.component';


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

  public years: number[] = [
  ];


  @Input() public lowerYear: number;
  @Input() public upperYear: number;


  constructor(router: Router, metadataService: MetadataService, changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);

    this.style = '{\'width\':\'70px\'}';
  }

  public ngOnInit() {
    super.ngOnInit();


    let lowerYear = YearSelectorComponent.YEAR_MIN;
    let upperYear = new Date().getFullYear();

    if (!Types.isUndefined(this.lowerYear)) {
      Assert.that(this.lowerYear >= YearSelectorComponent.YEAR_MIN,
        `Das Anfangsjahr ${this.lowerYear} ist kleiner als ${YearSelectorComponent.YEAR_MIN}`);

      lowerYear = this.lowerYear;
    }

    if (!Types.isUndefined(this.upperYear)) {
      Assert.that(this.upperYear <= YearSelectorComponent.YEAR_MAX,
        `Das Endjahr ${this.lowerYear} ist größer als ${YearSelectorComponent.YEAR_MAX}`);

      upperYear = this.upperYear;
    }

    const years = [];
    for (let year = upperYear; year >= lowerYear; year--) {
      years.push(year);
    }

    this.years = years;
  }

}