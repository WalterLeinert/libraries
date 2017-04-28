import { NgModule } from '@angular/core';

// PrimeNG
import { ConfirmationService } from 'primeng/components/common/api';

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
    ConfirmationService,
    ConfigService,
    MessageService,
    MetadataService,
    PipeService,
    PrintService,
    ProxyService
  ]
})
export class ClientServicesModule { }