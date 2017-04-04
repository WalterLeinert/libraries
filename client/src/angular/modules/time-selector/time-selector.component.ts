// tslint:disable:member-ordering

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, Validator } from '@angular/forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { Hour, ShortTime } from '@fluxgate/common';

import { CoreComponent } from '../../common/base/core.component';
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
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => TimeSelectorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => TimeSelectorComponent),
      multi: true,
    }
  ]
})
export class TimeSelectorComponent extends CoreComponent implements ControlValueAccessor, Validator {
  protected static readonly logger = getLogger(TimeSelectorComponent);

  public date: Date;

  private parseError: boolean;

  @Input() public readonly: boolean;

  private _time: ShortTime;
  @Output() public timeChange = new EventEmitter<ShortTime>();

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


  // >>> interface Validator >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  /**
   * Validiert das Control
   *
   * Muss in konkreten Klassen überschrieben werden!
   *
   * @abstract
   * @param {FormControl} control
   * @returns {*} null (falls ok), sonst ein Validation Object (dictionary)
   *
   * @memberOf SelectorBaseComponent
   */
  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      userError: {
        valid: false
      },
    };
  }
  // <<< interface Validator >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  // >>> interface ControlValueAccessor >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  /**
   * Write a new value to the element.
   *
   * @param {*} obj
   *
   * @memberOf SelectorBaseComponent
   */
  public writeValue(value: any) {
    if (value) {
      this.time = value;
    }
  }


  /**
   * Set the function to be called when the control receives a change event.
   *
   * @param {*} fn
   *
   * @memberOf SelectorBaseComponent
   */
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }


  /**
   * Set the function to be called when the control receives a touch event. (unused)
   *
   * @memberOf SelectorBaseComponent
   */
  public registerOnTouched() {
    // ok
  }


  /**
   * the method set in registerOnChange, it is just
   * a placeholder for a method that takes one parameter,
   * we use it to emit changes back to the form
   *
   * @private
   *
   * @memberOf SelectorBaseComponent
   */
  private propagateChange = (_: any) => {
    // ok
  }
  // <<< interface ControlValueAccessor >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



  // -------------------------------------------------------------------------------------
  // Property time
  // -------------------------------------------------------------------------------------
  protected onTimeChange(value: ShortTime) {
    this.date = new Date();
    this.date.setHours(value.hour, value.minute);
    this.propagateChange(this.time);

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
    if (this.date) {
      this.time = new ShortTime(this.date.getHours() as Hour, this.date.getMinutes());
    } else {
      this.onTimeChange(this.time);
    }
  }
}
