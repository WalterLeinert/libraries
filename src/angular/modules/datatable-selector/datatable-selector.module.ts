// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DataTableModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';

import { PipeService, ProxyService } from '../../services';
import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { DataTableSelectorComponent } from './datatable-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    CalendarModule,
    DropdownSelectorModule
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
