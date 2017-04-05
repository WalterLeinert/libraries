import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { Assert, Types } from '@fluxgate/common';

import { MetadataService } from '../../services';
import { MessageService } from '../../services/message.service';
import { SelectorBaseComponent } from '../common/selectorBase.component';


@Component({
  selector: 'flx-year-selector',
  template: `
<div>
  <flx-dropdown-selector [data]="years" [(ngModel)]="value"
    [style]="style"
    [debug]="debug" name="yearSelector">
  </flx-dropdown-selector>
</div>
`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: YearSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: YearSelectorComponent,
      multi: true,
    }
  ]
})
export class YearSelectorComponent extends SelectorBaseComponent<number> {
  public static readonly YEAR_MIN = 1900;
  public static readonly YEAR_MAX = 2050;

  public years: number[] = [
  ];

  @ViewChild(NgModel) public model: NgModel;
  @Input() public lowerYear: number;
  @Input() public upperYear: number;

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

    this.style = {
      width: '70px'
    };
  }

  // tslint:disable-next-line:use-life-cycle-interface
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

    if (this.value === undefined) {
      // das aktuelle Jahr vorselektieren
      const thisYear = new Date().getFullYear();

      const year = years.find((item, index, items) => {
        return item === thisYear;
      });

      this.value = year;
    }
  }


  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      yearError: {
        valid: false,
      },
    };
  }
}