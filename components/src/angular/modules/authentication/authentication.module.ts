// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { GrowlModule } from 'primeng/components/growl/growl';
import { MessagesModule } from 'primeng/components/messages/messages';

import { ConfigService, MessageService, MetadataService } from '@fluxgate/client';

import { CurrentUserServiceRequestsModule } from '../../redux/current-user-service-requests';
import { RoleServiceRequestsModule } from '../../redux/role-service-requests';
import { AutofocusModule } from '../directives/autofocus.directive';
import { HighlightModule } from '../directives/highlight.directive';
import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { ChangePasswordGuardService } from './changePassword/changePassword-guard.service';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
// import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { PassportService } from './passport.service';
import { RegisterGuardService } from './register/register-guard.service';
import { RegisterComponent } from './register/register.component';
import { RoleService } from './role.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GrowlModule,
    MessagesModule,
    DropdownModule,
    ConfirmDialogModule,
    HighlightModule,
    AutofocusModule,
    DropdownSelectorModule,
    CurrentUserServiceRequestsModule,
    RoleServiceRequestsModule
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
    ConfigService,
    MessageService,
    MetadataService,
    PassportService,
    RoleService,
    RegisterGuardService,
    ChangePasswordGuardService
  ]
})
export class AuthenticationModule { }