// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageServiceModule } from '@fluxgate/client';

import { EnumValueComponent } from './enum-value.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageServiceModule
  ],
  exports: [
    EnumValueComponent
  ],
  declarations: [
    EnumValueComponent
  ]
})
export class EnumValueModule { }
