// tslint:disable:max-classes-per-file

// Angular
import { Injectable, NgModule } from '@angular/core';

import { MessageServiceBase } from '@fluxgate/client';


@Injectable()
export class MessageService extends MessageServiceBase {
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [MessageService]
})
export class MessageServiceModule { }