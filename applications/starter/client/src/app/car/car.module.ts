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


// Resizing
import { ResizableModule } from 'angular-resizable-element';

// Fluxgate
import {
  AutofocusModule, ComponentGuardModule, ConfirmationDialogModule, DataTableSelectorModule,
  FlxSidebarModule, HighlightModule, PopupModule, SelectionListModule, TabModule
} from '@fluxgate/components';

import { CarDetailComponent } from './car-detail.component';
import { CarListComponent } from './car-list.component';

// Service, Pipes
import { CarServiceRequestsModule } from '../redux/car-service-requests';
import { CarFilterPipe } from './car-filter.pipe';
import { CarRoutingModule } from './car-routing.module';



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
    CarRoutingModule,
    CarServiceRequestsModule,
    FlxSidebarModule,
    ResizableModule,
    TabModule,
    SelectionListModule
  ],
  declarations: [
    CarListComponent,
    CarDetailComponent,
    CarFilterPipe
  ],
  providers: [
  ],
})
export class CarModule { }
