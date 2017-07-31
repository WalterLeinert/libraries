// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from '@fluxgate/client';

import { AutoformInputComponent } from './autoform-input.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    AutoformInputComponent
  ],
  declarations: [
    AutoformInputComponent
  ],
  providers: [
  ]
})
export class AutoformInputModule { }
