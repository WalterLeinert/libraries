import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
import { getLogger } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { AppConfigService, ExtendedCoreComponent, MessageService } from '@fluxgate/client';

import { Tab } from './tab';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends ExtendedCoreComponent {
  protected static readonly logger = getLogger(AppComponent);

  public title = 'Fluxgate Starter Application';
  public mode: string;
  public tabs: Tab[] = [
    {
      header: 'Home',
      route: './home',
      status: ''
    },
    {
      header: 'Artikel',
      route: './artikel',
      status: 'active'
    },
    {
      header: 'Autos',
      route: './car',
      status: ''
    }
  ];


  constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    configService: AppConfigService) {
    super(router, route, messageService);

    this.mode = configService.config.mode;
  }

  public GoTo(route: string) {
    this.router.navigate([route]);
  }


}