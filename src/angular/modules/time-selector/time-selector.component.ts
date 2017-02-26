import { Component, EventEmitter, Input, Output } from '@angular/core';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { Hour, ShortTime } from '@fluxgate/common';

import { CoreComponent } from '../../common/base/core.component';

@Component({
  selector: 'flx-time-selector',
  template: `
<div>
  <p-calendar [(ngModel)]="date" [timeOnly]="true" hourFormat="24"
    (onBlur)="onBlur($event)" (onSelect)="onSelect($event)"
  >
  </p-calendar>
</div>
`,
  styles: []
})
export class TimeSelectorComponent extends CoreComponent {
  protected static readonly logger = getLogger(TimeSelectorComponent);

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

  public onBlur(eventData: any) {
    using(new XLog(TimeSelectorComponent.logger, levels.INFO, 'onBlur'), (log) => {
      this.updateTime();
    });
  }

  public onSelect(eventData: any) {
    using(new XLog(TimeSelectorComponent.logger, levels.INFO, 'onSelect'), (log) => {
      this.updateTime();
    });
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


  private updateTime() {
    this.time = new ShortTime(this.date.getHours() as Hour, this.date.getMinutes());
  }
}
