import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Sidebar
import { SidebarModule } from 'ng-sidebar';

import { FlxSidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    FlxSidebarComponent
  ],
  exports: [
    FlxSidebarComponent
  ],
  providers: [
  ]
})
export class FlxSidebarModule { }