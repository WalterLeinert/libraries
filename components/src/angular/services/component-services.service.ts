// Angular
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService, MetadataService } from '@fluxgate/client';


@Injectable()
export class ComponentServices {

  constructor(public router: Router, public route: ActivatedRoute, public messageService: MessageService) {
  }

}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  providers: [
    MessageService,
    MetadataService,
    ComponentServices
  ]
})
export class ComponentServicesModule { }