import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Sidebar
import { SidebarModule } from 'ng-sidebar';

// Resizing
import { ResizeEvent } from 'angular-resizable-element';

import { FlxSidebarComponent } from './flx-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule
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