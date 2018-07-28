// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


// PrimeNG
import { ButtonModule } from 'primeng/components/button/button';
import { SharedModule } from 'primeng/components/common/shared';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { GrowlModule } from 'primeng/components/growl/growl';
import { MessagesModule } from 'primeng/components/messages/messages';

// Fluxgate
import {
  AutofocusModule, ComponentGuardModule, ConfirmationDialogModule, DataTableSelectorModule,
  HighlightModule, PopupModule
} from '@fluxgate/components';

// lokale Komponenten
import { ArtikelDetailComponent } from './artikel-detail.component';
import { ArtikelListComponent } from './artikel-list.component';

// Service, Pipes
import { ArtikelServiceRequestsModule } from '../redux/artikel-service-requests';
import { ArtikelFilterPipe } from './artikel-filter.pipe';
import { ArtikelRoutingModule } from './artikel-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    MessagesModule,
    ConfirmationDialogModule,
    ComponentGuardModule,
    AutofocusModule,
    HighlightModule,
    PopupModule,
    DataTableSelectorModule,
    ArtikelRoutingModule,
    ArtikelServiceRequestsModule
  ],
  declarations: [
    ArtikelListComponent,
    ArtikelDetailComponent,
    ArtikelFilterPipe
  ],
  providers: [
  ],

})
export class ArtikelModule { }
