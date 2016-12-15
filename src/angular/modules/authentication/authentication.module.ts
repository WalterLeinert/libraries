// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';

import { AutofocusModule, HighlightModule } from '../../common/directives';

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
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logout', component: LogoffComponent }
    ]),
    HighlightModule,
    AutofocusModule
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