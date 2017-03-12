// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DropdownModule } from 'primeng/primeng';

import { MessageServiceModule } from '../../services/message.service';
import { DropdownSelectorComponent } from './dropdown-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,

    MessageServiceModule
  ],
  exports: [
    DropdownSelectorComponent
  ],
  declarations: [
    DropdownSelectorComponent
  ]
})
export class DropdownSelectorModule { }
