// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DropdownModule } from 'primeng/primeng';

import { DropdownSelectorComponent } from './dropdown-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  exports: [
    DropdownSelectorComponent
  ],
  declarations: [
    DropdownSelectorComponent
  ]
})
export class DropdownSelectorModule { }
