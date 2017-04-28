import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfigService, MetadataService } from '@fluxgate/client';

import { RoleSelectorServiceRequestsModule } from '../../redux/role-selector-service-requests';
import { MessageService } from '../../services/message.service';
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
    ConfigService,
    MessageService,
    MetadataService
  ]
})
export class RoleSelectorModule { }