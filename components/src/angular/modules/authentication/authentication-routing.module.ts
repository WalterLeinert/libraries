import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordGuardService } from './changePassword/changePassword-guard.service';
import { RegisterGuardService } from './register/register-guard.service';

import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'register',
        canActivate: [RegisterGuardService],
        component: RegisterComponent
    },
    {
        path: 'changePassword',
        canActivate: [ChangePasswordGuardService],
        component: ChangePasswordComponent
    },
    { path: 'logout', component: LogoffComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { }