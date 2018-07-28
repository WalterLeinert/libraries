import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  AutoformComponent, ComponentGuardModule, ComponentGuardService,
  CurrentUserGuardService
} from '@fluxgate/components';

// lokale Komponenten
import { ConfigurationResolver } from './configuration-resolver.service';
import { ConfigurationComponent } from './configuration.component';

const routes: Routes = [
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [CurrentUserGuardService],

    children: [
      {
        path: 'view/:id',
        component: AutoformComponent,
        canDeactivate: [ComponentGuardService],
        data: {
          action: 'view',
          resolverKey: 'config',
          showButtons: false
        },
        resolve: {
          config: ConfigurationResolver
        }
      },
      {
        path: 'update/:id',
        component: AutoformComponent,
        canDeactivate: [ComponentGuardService],
        data: {
          action: 'update',
          resolverKey: 'config',
          showButtons: true,
          showNewButton: true
        },
        resolve: {
          config: ConfigurationResolver
        }
      },
      {
        path: 'create/:id',
        component: AutoformComponent,
        canDeactivate: [ComponentGuardService],
        data: {
          action: 'create',
          resolverKey: 'config',
          showButtons: true
        },
        resolve: {
          config: ConfigurationResolver
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
  ]
})
export class ConfigurationRoutingModule { }
