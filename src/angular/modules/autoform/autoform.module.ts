import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule, ConfirmDialogModule, SharedModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';

import { ProxyService } from '../../services';
import { MessageServiceModule } from '../../services/message.service';
import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.component';
import { AutoformComponent } from './autoform.component';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // PrimeNG
    ButtonModule,
    SharedModule,
    MessagesModule,
    DialogModule,
    ConfirmDialogModule,

    // Fluxgate
    MessageServiceModule,
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