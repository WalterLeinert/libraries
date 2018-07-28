import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AutoformDialogComponent, ComponentGuardModule, ComponentGuardService,
  CurrentUserGuardService
} from '@fluxgate/components';

// lokale Komponenten
import { ArtikelListComponent } from './artikel-list.component';
import { ArtikelResolver } from './artikel-resolver.service';


const routes: Routes = [
  {
    path: 'artikel',
    component: ArtikelListComponent,
    canActivate: [CurrentUserGuardService],

    children: [
      {
        path: 'view/:id',
        component: AutoformDialogComponent,
        canDeactivate: [ComponentGuardService],
        data: {
          action: 'view',
          resolverKey: 'artikel'
        },
        resolve: {
          artikel: ArtikelResolver
        }
      },
      {
        path: 'update/:id',
        component: AutoformDialogComponent,
        canDeactivate: [ComponentGuardService],
        data: {
          action: 'update',
          resolverKey: 'artikel'
        },
        resolve: {
          artikel: ArtikelResolver
        }
      },
      {
        path: 'create/:id',
        component: AutoformDialogComponent,
        canDeactivate: [ComponentGuardService],
        data: {
          action: 'create',
          resolverKey: 'artikel'
        },
        resolve: {
          artikel: ArtikelResolver
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
    ArtikelResolver
  ]
})
export class ArtikelRoutingModule { }
