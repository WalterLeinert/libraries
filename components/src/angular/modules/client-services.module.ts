import { NgModule } from '@angular/core';

// PrimeNG
import { ConfirmationService } from 'primeng/components/common/api';

import {
  AppConfigService, MessageService, MetadataService, PipeService, PrintService
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
    AppConfigService,
    MessageService,
    MetadataService,
    PipeService,
    PrintService
  ]
})
export class ClientServicesModule { }