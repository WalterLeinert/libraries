import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageServiceModule } from '../../services/message.service';
import { UserService } from '../authentication/user.service';
import { DropdownSelectorModule } from '../dropdown-selector';
import { UserSelectorComponent } from './user-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageServiceModule,
    DropdownSelectorModule
  ],
  declarations: [
    UserSelectorComponent
  ],
  exports: [
    UserSelectorComponent
  ],
  providers: [
    UserService
  ]
})
export class UserSelectorModule { }