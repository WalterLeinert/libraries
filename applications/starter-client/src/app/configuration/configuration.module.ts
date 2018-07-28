// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { GrowlModule } from 'primeng/components/growl/growl';
import { MessagesModule } from 'primeng/components/messages/messages';
import { TabViewModule } from 'primeng/primeng';

// Fluxgate
import { ConfigService, ConfigServiceRequestsModule } from '@fluxgate/components';

// lokale Komponenten
import { ConfigurationResolver } from './configuration-resolver.service';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GrowlModule,
    MessagesModule,
    TabViewModule,
    ConfigServiceRequestsModule,

    ConfigurationRoutingModule
  ],
  declarations: [
    ConfigurationComponent
  ],
  providers: [
    ConfigService,
    ConfigurationResolver
  ],

})
export class ConfigurationModule { }