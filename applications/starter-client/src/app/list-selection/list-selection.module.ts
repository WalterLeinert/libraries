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
import { ListSelectionComponent } from './list-selection.component';

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
    DataTableSelectorModule
  ],
  declarations: [
    ListSelectionComponent
  ],
  providers: [
  ],

})
export class ListSelectionModule { }
