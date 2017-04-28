import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ConfirmationService } from 'primeng/components/common/api';

import { ConfigService, MessageService, MetadataService } from '@fluxgate/client';

import { RoleSelectorServiceRequestsModule } from '../../redux/role-selector-service-requests';
import { DropdownSelectorModule } from '../dropdown-selector';
import { RoleSelectorComponent } from './role-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownSelectorModule,
    RoleSelectorServiceRequestsModule
  ],
  declarations: [
    RoleSelectorComponent
  ],
  exports: [
    RoleSelectorComponent
  ],
  providers: [
    ConfirmationService,
    ConfigService,
    MessageService,
    MetadataService
  ]
})
export class RoleSelectorModule { }