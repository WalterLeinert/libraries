import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService, MetadataService } from '@fluxgate/client';

import { DropdownSelectorModule } from '../dropdown-selector';
import { MonthSelectorComponent } from './month-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownSelectorModule
  ],
  declarations: [
    MonthSelectorComponent
  ],
  exports: [
    MonthSelectorComponent
  ],
  providers: [
    MessageService,
    MetadataService
  ]
})
export class MonthSelectorModule { }