import { NgModule } from '@angular/core';
import { RegisterGuardService } from './register/register-guard.service';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoffComponent } from './logoff/logoff.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'register',
        canActivate: [RegisterGuardService],
        component: RegisterComponent
    },
    { path: 'logout', component: LogoffComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { }