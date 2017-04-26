import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageServiceModule } from '@fluxgate/client';

import { DropdownSelectorModule } from '../dropdown-selector';
import { YearSelectorComponent } from './year-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageServiceModule,
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