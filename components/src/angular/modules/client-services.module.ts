import { NgModule } from '@angular/core';

import {
  ConfigService, MetadataService, PipeService, PrintService, ProxyService
} from '@fluxgate/client';

import { MessageService } from '../services/message.service';

/**
 * Exportiert diverse zentrale Client-Services als Modul (hier wegen angular aot)
 *
 * @export
 * @class ClientServicesModule
 */
@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    ConfigService,
    MessageService,
    MetadataService,
    PipeService,
    PrintService,
    ProxyService
  ]
})
export class ClientServicesModule { }