import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MessageServiceModule } from '../../services/message.service';
import { DropdownSelectorModule } from '../dropdown-selector';
import { MonthSelectorComponent } from './month-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MessageServiceModule,
    DropdownSelectorModule
  ],
  declarations: [
    MonthSelectorComponent
  ],
  exports: [
    MonthSelectorComponent
  ],
  providers: [
  ]
})
export class MonthSelectorModule { }