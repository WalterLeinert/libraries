import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageServiceModule } from '@fluxgate/client';

import { DropdownSelectorModule } from '../dropdown-selector';
import { MonthSelectorComponent } from './month-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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