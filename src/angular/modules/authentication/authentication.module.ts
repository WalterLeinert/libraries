// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';

import { AutofocusModule, HighlightModule } from '../../common/directives';

// import { Service } from '../../services';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { PassportService } from './passport.service';
import { RoleService } from './role.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoffComponent } from './logoff/logoff.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GrowlModule,
    MessagesModule,
    DropdownModule,
    HighlightModule,
    AutofocusModule,
    AuthenticationRoutingModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoffComponent
  ],
  providers: [
    PassportService,
    RoleService
  ]
})
export class AuthenticationModule { }