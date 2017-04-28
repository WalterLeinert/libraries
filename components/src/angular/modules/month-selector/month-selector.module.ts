import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MetadataService } from '@fluxgate/client';

import { MessageService } from '../../services/message.service';
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