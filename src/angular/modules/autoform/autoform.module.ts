import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule, ConfirmDialogModule, SharedModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';


import { PopupModule } from '../../modules/common';
import { ProxyService } from '../../services';
import { MessageServiceModule } from '../../services/message.service';
import { AutoformDetailComponent } from './autoform-detail.component';
import { AutoformRoutingModule } from './autoform-routing.module';
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
    // Fluxgate
    MessageServiceModule,
    ConfirmDialogModule,
    PopupModule,
    AutoformRoutingModule
  ],
  exports: [
    AutoformComponent,
    AutoformDetailComponent
  ],
  declarations: [
    AutoformComponent,
    AutoformDetailComponent
  ],
  providers: [
    ProxyService
  ]
})
export class AutoformModule { }