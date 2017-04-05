// tslint:disable:member-ordering

import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { Hour, ShortTime } from '@fluxgate/common';

import { ControlBaseComponent } from '../../common/base/control-base.component';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'flx-time-selector',
  template: `
<div>
  <p-calendar [(ngModel)]="date" [timeOnly]="true" hourFormat="24"
    [readonlyInput]="readonly"
    (onBlur)="onBlur($event)" (onSelect)="onSelect($event)"
  >
  </p-calendar>
</div>
`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimeSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TimeSelectorComponent,
      multi: true,
    }
  ]
})
export class TimeSelectorComponent extends ControlBaseComponent<ShortTime> {
  protected static readonly logger = getLogger(TimeSelectorComponent);

  public date: Date;

  @ViewChild(NgModel) public model: NgModel;
  @Input() public readonly: boolean;


  constructor(messageService: MessageService) {
    super(messageService);
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


  private updateTime() {
    if (this.date) {
      this.value = new ShortTime(this.date.getHours() as Hour, this.date.getMinutes());
    }
  }
}