import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownSelectorModule } from '../dropdown-selector';

import { MonthSelectorComponent } from './month-selector.component';

@NgModule({
  imports: [
    CommonModule,
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