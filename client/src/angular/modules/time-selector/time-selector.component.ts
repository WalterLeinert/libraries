// tslint:disable:member-ordering

import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { Hour, ShortTime, Types } from '@fluxgate/common';

import { ControlBaseComponent } from '../../common/base/control-base.component';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'flx-time-selector',
  template: `
<p-calendar [(ngModel)]="date" [timeOnly]="true" hourFormat="24"
  [readonlyInput]="readonly"
  (onBlur)="onBlur($event)" (onSelect)="onSelect($event)"
>
</p-calendar>
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
      super.onTouched();

      // TODO: Validierung über angular triggern

      const controlValue = eventData.target.value;
      if (Types.isPresent(controlValue)) {
        try {
          const t = ShortTime.parse(controlValue);
          this.updateTime(t);
          this.parseError = false;
        } catch (exc) {
          log.warn(`TODO: angular Validierung einbinden (value: ${controlValue})`);
          this.parseError = true;
          eventData.target.value = null;
        }
      }
    });
  }

  public onSelect(eventData: any) {
    using(new XLog(TimeSelectorComponent.logger, levels.INFO, 'onSelect'), (log) => {
      this.parseError = false;
      this.updateTime();
    });
  }


  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      timeError: {
        valid: false
      },
    };
  }

  protected onValueChange(value: ShortTime) {
    if (value) {
      const date = new Date();
      date.setHours(value.hour);
      date.setMinutes(value.minute);

      this.date = date;
    }
  }

  private updateTime(time?: ShortTime) {
    if (!time) {
      if (this.date) {
        time = new ShortTime(this.date.getHours() as Hour, this.date.getMinutes());
      }
    }
    if (time) {
      this.value = time;
      this.model.control.reset();
    }
  }
}