// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';

import { AutofocusModule, HighlightModule } from '../../common/directives';

import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { PassportService } from './passport.service';
import { RoleService } from './role.service';
import { NavigationService } from './navigation.service';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { RegisterComponent } from './register/register.component';
import { LogoffComponent } from './logoff/logoff.component';
import { RegisterGuardService } from './register/register-guard.service';
import { ChangePasswordGuardService } from './changePassword/changePassword-guard.service';

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
    AuthenticationRoutingModule
  ],
  declarations: [
    LoginComponent,
    LogoffComponent,
    ChangePasswordComponent,
    RegisterComponent
  ],
  providers: [
    NavigationService,
    PassportService,
    RoleService,
    RegisterGuardService,
    ChangePasswordGuardService
  ]
})
export class AuthenticationModule { }