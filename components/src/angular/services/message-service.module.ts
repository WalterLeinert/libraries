import { NgModule } from '@angular/core';

import { MessageService } from '@fluxgate/client';

// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [
    MessageService
  ]
})
export class MessageServiceModule { }