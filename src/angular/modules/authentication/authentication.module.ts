// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';

import { AutofocusModule, HighlightModule } from '../../common/directives';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { PassportService } from './passport.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoffComponent } from './logoff/logoff.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GrowlModule,
    MessagesModule,
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
    PassportService
  ]
})
export class AuthenticationModule { }