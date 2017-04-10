import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageServiceModule } from '../../services/message.service';
import { RoleServiceRequestsModule } from '../authentication/redux/role-service-requests';
import { DropdownSelectorModule } from '../dropdown-selector';
import { RoleSelectorComponent } from './role-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageServiceModule,
    DropdownSelectorModule,
    RoleServiceRequestsModule
  ],
  declarations: [
    RoleSelectorComponent
  ],
  exports: [
    RoleSelectorComponent
  ],
  providers: [

  ]
})
export class RoleSelectorModule { }