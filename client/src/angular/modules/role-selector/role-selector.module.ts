import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { MessageServiceModule } from '../../services/message.service';
import { RoleService } from '../authentication/role.service';
import { DropdownSelectorModule } from '../dropdown-selector';
import { RoleSelectorComponent } from './role-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MessageServiceModule,
    DropdownSelectorModule
  ],
  declarations: [
    RoleSelectorComponent
  ],
  exports: [
    RoleSelectorComponent
  ],
  providers: [
    RoleService
  ]
})
export class RoleSelectorModule { }