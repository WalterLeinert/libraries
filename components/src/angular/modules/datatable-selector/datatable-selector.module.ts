// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { MessageService, MetadataService, PipeService } from '@fluxgate/client';

import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { EnumValueModule } from '../enum-value/enum-value.module';
import { TimeSelectorModule } from '../time-selector/time-selector.module';
import { DataTableSelectorComponent } from './datatable-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    CalendarModule,
    TooltipModule,

    EnumValueModule,
    DropdownSelectorModule,
    TimeSelectorModule
  ],
  exports: [
    DataTableSelectorComponent
  ],
  declarations: [
    DataTableSelectorComponent
  ],
  providers: [
    MessageService,
    MetadataService,
    PipeService
  ]
})
export class DataTableSelectorModule { }
