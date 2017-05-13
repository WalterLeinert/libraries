import { NgModule } from '@angular/core';

// PrimeNG
import { ConfirmationService } from 'primeng/components/common/api';

import {
  ConfigService, MessageService, MetadataService, PipeService, PrintService
} from '@fluxgate/client';


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
    PrintService
  ]
})
export class ClientServicesModule { }