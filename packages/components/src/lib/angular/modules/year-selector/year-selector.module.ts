import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService, MetadataService } from '@fluxgate/client';

import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { YearSelectorComponent } from './year-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    DropdownSelectorModule
  ],
  declarations: [
    YearSelectorComponent
  ],
  exports: [
    YearSelectorComponent
  ],
  providers: [
    MessageService,
    MetadataService
  ]
})
export class YearSelectorModule { }