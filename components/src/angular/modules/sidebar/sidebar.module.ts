import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SidebarComponent
  ],
  exports: [
    SidebarComponent
  ],
  providers: [
  ]
})
export class SidebarModule { }