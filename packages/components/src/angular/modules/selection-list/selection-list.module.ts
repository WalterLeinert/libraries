import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectionListComponent } from './selection-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SelectionListComponent
  ],
  exports: [
    SelectionListComponent
  ],
  providers: [
  ]
})
export class SelectionListModule { }