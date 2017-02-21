// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CalendarModule } from 'primeng/primeng';

// Fluxgate
import { TimeSelectorComponent } from './time-selector.component';


@NgModule({
  imports: [
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
  ]
})
export class TimeSelectorModule { }
