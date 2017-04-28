// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { ConfirmationService } from 'primeng/components/common/api';

import { MessageService } from '@fluxgate/client';
import { TimeSelectorComponent } from './time-selector.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    CalendarModule
  ],
  declarations: [
    TimeSelectorComponent
  ],
  exports: [
    TimeSelectorComponent
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class TimeSelectorModule { }
