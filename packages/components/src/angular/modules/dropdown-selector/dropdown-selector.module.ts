// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DropdownModule } from 'primeng/components/dropdown/dropdown';

import { MessageService, MetadataService } from '@fluxgate/client';

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
  ],
  providers: [
    MessageService,
    MetadataService
  ]
})
export class DropdownSelectorModule { }
