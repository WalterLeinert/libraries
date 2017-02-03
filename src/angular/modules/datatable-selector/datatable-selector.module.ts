// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DataTableModule } from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';

import { ProxyService } from '../../services';
import { DataTableSelectorComponent } from './datatable-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    CalendarModule
  ],
  exports: [
    DataTableSelectorComponent
  ],
  declarations: [
    DataTableSelectorComponent
  ],
  providers: [
    ProxyService
  ]
})
export class DataTableSelectorModule { }
