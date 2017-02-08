import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownSelectorModule } from '../dropdown-selector';

import { YearSelectorComponent } from './year-selector.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownSelectorModule
  ],
  declarations: [
    YearSelectorComponent
  ],
  exports: [
    YearSelectorComponent
  ],
  providers: [
  ]
})
export class YearSelectorModule { }