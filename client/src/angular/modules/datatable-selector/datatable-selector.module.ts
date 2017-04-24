// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DataTableModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';

import { MessageServiceModule } from '../../services/message.service';
import { PipeService } from '../../services/pipe.service';
import { ProxyService } from '../../services/proxy.service';
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

    MessageServiceModule,
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
    ProxyService,
    PipeService
  ]
})
export class DataTableSelectorModule { }
