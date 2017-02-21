import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ShortTime } from '@fluxgate/common';

import { CoreComponent } from '../../common/base/core.component';

@Component({
  selector: 'flx-time-selector',
  template: `
<div>
  <p-calendar [(ngModel)]="date" [timeOnly]="true">
  </p-calendar>
</div>
`,
  styles: []
})
export class TimeSelectorComponent extends CoreComponent {
  public date: Date;

  private _time: ShortTime;
  @Output() public timeChange = new EventEmitter<ShortTime>();

  constructor() {
    super();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();
  }


  // -------------------------------------------------------------------------------------
  // Property time
  // -------------------------------------------------------------------------------------
  protected onTimeChange(value: ShortTime) {
    this.date = new Date();
    this.date.setHours(value.hour, value.minute);

    this.timeChange.emit(value);
  }

  public get time(): ShortTime {
    return this._time;
  }

  @Input() public set time(value: ShortTime) {
    if (this._time !== value) {
      this._time = value;
      this.onTimeChange(value);
    }
  }
}
