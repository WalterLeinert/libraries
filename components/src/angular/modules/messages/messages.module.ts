import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { ToastModule, ToastOptions } from 'ng2-toastr';
import { ToastrModule } from 'ngx-toastr';

// TODO: import { CustomOptions } from './custom - options';
import { MessagesComponent } from './messages.component';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    MessagesComponent
  ],
  exports: [
    MessagesComponent
  ],
  // TODO: providers: [{ provide: ToastOptions, useClass: CustomOptions }]
})
export class MessagesModule { }
