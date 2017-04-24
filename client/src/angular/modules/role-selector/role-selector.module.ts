import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RoleSelectorServiceRequestsModule } from '../../redux/role-selector-service-requests';
import { MessageServiceModule } from '../../services/message.service';
import { DropdownSelectorModule } from '../dropdown-selector';
import { RoleSelectorComponent } from './role-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageServiceModule,
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

  ]
})
export class RoleSelectorModule { }