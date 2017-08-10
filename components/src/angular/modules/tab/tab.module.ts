import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TabComponent } from './tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    TabComponent
  ],
  exports: [
    TabComponent
  ],
  providers: [
  ]
})
export class TabModule { }