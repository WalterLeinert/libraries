import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/components/button/button';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { SharedModule } from 'primeng/components/common/shared';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { MessagesModule } from 'primeng/components/messages/messages';

import { AutofocusModule, ProxyService } from '@fluxgate/client';

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
    AutofocusModule,
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