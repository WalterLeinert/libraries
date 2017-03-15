import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule, ConfirmDialogModule, SharedModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';

import { ProxyService } from '../../services';
import { MessageServiceModule } from '../../services/message.service';
import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.component';
import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { TimeSelectorModule } from '../time-selector/time-selector.module';
import { AutoformComponent } from './autoform.component';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // PrimeNG
    ButtonModule,
    SharedModule,
    MessagesModule,
    DialogModule,
    CalendarModule,
    ConfirmDialogModule,

    // Fluxgate
    MessageServiceModule,
    TimeSelectorModule,
    DropdownSelectorModule,
    ConfirmationDialogModule
  ],
  exports: [
    AutoformComponent
  ],
  declarations: [
    AutoformComponent
  ],
  providers: [
    ProxyService
  ]
})
export class AutoformModule { }