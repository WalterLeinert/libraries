import { Injectable, NgModule } from '@angular/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { MessageServiceBase } from '@fluxgate/client';

@Injectable()
export class MessageService extends MessageServiceBase {
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [
    MessageService
  ]
})
export class MessageServicesModule { }