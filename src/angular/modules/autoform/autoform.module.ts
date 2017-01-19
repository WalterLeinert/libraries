import { NgModule, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG
import { ButtonModule, SharedModule, ConfirmDialogModule } from 'primeng/primeng';
import { MessagesModule, ConfirmationService } from 'primeng/primeng';

import { MetadataService } from '../../services';
import { BaseComponent } from '../../common/base';
import { PopupModule } from '../../modules/common';

import { ProxyService } from './proxy.service';
import { AutoformComponent } from './autoform.component';
import { AutoformDetailComponent } from './autoform-detail.component';
import { AutoformRoutingModule } from './autoform-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    // PrimeNG
    ButtonModule,
    SharedModule,
    MessagesModule,
    // Fluxgate
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