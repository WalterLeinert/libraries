import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// fluxgate
import { MessageServiceModule } from '@fluxgate/client';

import { UserSelectorServiceRequestsModule } from '../../redux/user-selector-service-requests';
import { DropdownSelectorModule } from '../dropdown-selector';
import { UserSelectorComponent } from './user-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageServiceModule,
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
  ]
})
export class UserSelectorModule { }