import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { ToastModule, ToastOptions } from 'ng2-toastr';
import { ToastOptions } from 'ng2-toastr';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { CustomOptions } from './custom-options';
import { MessagesComponent } from './messages.component';

@NgModule({
  imports: [
    CommonModule,
    ToastModule.forRoot(),
  ],
  declarations: [
    MessagesComponent
  ],
  exports: [
    MessagesComponent
  ],
  providers: [{ provide: ToastOptions, useClass: CustomOptions }]
})
export class MessagesModule { }
