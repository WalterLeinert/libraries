import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { ChangePasswordComponent, LoginComponent, LogoffComponent, RegisterComponent } from '@fluxgate/components';


const routes: Routes = [
  // {
  //   path: 'overtime',
  //   loadChildren: 'app/clientuser/overtime/overtime.module#OvertimeModule',
  //   // canLoad: [AuthGuard]
  // },

  // { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        enableTracing: false
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }

