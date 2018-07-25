// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';

import { MessageService } from '@fluxgate/client';

import { DropdownSelectorModule } from '../../dropdown-selector/dropdown-selector.module';
import { TimeSelectorModule } from '../../time-selector/time-selector.module';
import { AutoformControlsComponent } from './autoform-controls.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CalendarModule,
    CheckboxModule,

    DropdownSelectorModule,
    TimeSelectorModule
  ],
  exports: [
    AutoformControlsComponent
  ],
  declarations: [
    AutoformControlsComponent
  ],
  providers: [
    MessageService
  ]
})
export class AutoformControlsModule { }
