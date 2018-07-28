// Angular
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { GrowlModule } from 'primeng/components/growl/growl';
import { MessagesModule } from 'primeng/components/messages/messages';

import { AppConfigService, CurrentUserService, MessageService, MetadataService } from '@fluxgate/client';

import { CurrentUserServiceRequestsModule } from '../../redux/current-user-service-requests';
import { RoleServiceRequestsModule } from '../../redux/role-service-requests';
import { AutofocusModule } from '../directives/autofocus.directive';
import { HighlightModule } from '../directives/highlight.directive';
import { RoleSelectorModule } from '../role-selector/role-selector.module';
// import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { PassportService } from './passport.service';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GrowlModule,
    MessagesModule,
    DropdownModule,
    ConfirmDialogModule,
    HighlightModule,
    AutofocusModule,
    RoleServiceRequestsModule,
    RoleSelectorModule,
    CurrentUserServiceRequestsModule
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
    AppConfigService,
    MessageService,
    MetadataService,
    PassportService
  ]
})
export class AuthenticationModule { }