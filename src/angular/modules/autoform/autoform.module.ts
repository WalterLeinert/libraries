import { CommonModule } from '@angular/common';
import { Component, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG
import { ButtonModule, ConfirmDialogModule, SharedModule } from 'primeng/primeng';
import { ConfirmationService, MessagesModule } from 'primeng/primeng';

import { BaseComponent } from '../../common/base';
import { PopupModule } from '../../modules/common';
import { MetadataService, ProxyService } from '../../services';

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