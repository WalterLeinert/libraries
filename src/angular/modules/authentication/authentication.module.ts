// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';

import { AutofocusModule, HighlightModule } from '../../common/directives';

import { MessageServiceModule } from '../../services/message.service';
import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { ChangePasswordGuardService } from './changePassword/changePassword-guard.service';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
// import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CurrentUserService } from './currentUser.service';
import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { NavigationService } from './navigation.service';
import { PassportService } from './passport.service';
import { RegisterGuardService } from './register/register-guard.service';
import { RegisterComponent } from './register/register.component';
import { RoleService } from './role.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GrowlModule,
    MessagesModule,
    DropdownModule,
    ConfirmDialogModule,
    HighlightModule,
    AutofocusModule,
    DropdownSelectorModule,
    MessageServiceModule
    // AuthenticationRoutingModule
  ],
  declarations: [
    LoginComponent,
    LogoffComponent,
    ChangePasswordComponent,
    RegisterComponent
  ],
  exports: [
    LoginComponent,
    LogoffComponent,
    ChangePasswordComponent,
    RegisterComponent
  ],
  providers: [
    CurrentUserService,
    NavigationService,
    PassportService,
    RoleService,
    RegisterGuardService,
    ChangePasswordGuardService
  ]
})
export class AuthenticationModule { }