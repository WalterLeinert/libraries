// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG
import { CalendarModule } from 'primeng/components/calendar/calendar';

import { MessageServiceModule } from '../../services/message.service';
import { TimeSelectorComponent } from './time-selector.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    MessageServiceModule
  ],
  declarations: [
    TimeSelectorComponent
  ],
  exports: [
    TimeSelectorComponent
  ],
  providers: [
  ]
})
export class TimeSelectorModule { }
