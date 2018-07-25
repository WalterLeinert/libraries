import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrentUserAdminGuardService } from '../../services/current-user-admin-guard.service';
import { CurrentUserGuardService } from '../../services/current-user-guard.service';

import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    canActivate: [CurrentUserAdminGuardService],
    component: RegisterComponent
  },
  {
    path: 'changePassword',
    canActivate: [CurrentUserGuardService],
    component: ChangePasswordComponent
  },
  { path: 'logout', component: LogoffComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    CurrentUserAdminGuardService,
    CurrentUserGuardService
  ]
})
export class AuthenticationRoutingModule { }