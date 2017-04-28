import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MetadataService } from '@fluxgate/client';

import { MessageService } from '../../services/message.service';
import { DropdownSelectorModule } from '../dropdown-selector';
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