import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService, MetadataService } from '@fluxgate/client';

import { UserSelectorServiceRequestsModule } from '../../redux/user-selector-service-requests';
import { DropdownSelectorModule } from '../dropdown-selector';
import { UserSelectorComponent } from './user-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownSelectorModule,
    UserSelectorServiceRequestsModule
  ],
  declarations: [
    UserSelectorComponent
  ],
  exports: [
    UserSelectorComponent
  ],
  providers: [
    MessageService,
    MetadataService
  ]
})
export class UserSelectorModule { }