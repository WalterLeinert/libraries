// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DataTableModule } from 'primeng/primeng';

import { ProxyService } from '../../services';
import { DataTableSelectorComponent } from './datatable-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule
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