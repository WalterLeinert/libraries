import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentGuardModule, CurrentUserGuardService } from '@fluxgate/components';

// lokale Komponenten
import { CarDetailComponent } from './car-detail.component';
import { CarListComponent } from './car-list.component';
import { CarResolver } from './car-resolver.service';


const routes: Routes = [
  {
    path: 'car',
    component: CarListComponent,
    canActivate: [CurrentUserGuardService],
    children: [
      {
        path: 'car/:id',
        component: CarDetailComponent,
        outlet: 'detail',
        resolve: {
          car: CarResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    ComponentGuardModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CarResolver
  ]
})
export class CarRoutingModule { }
