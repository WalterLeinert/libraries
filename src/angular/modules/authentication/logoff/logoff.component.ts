/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent} from '../../../common/base/base.component'
import { PassportService } from './../passport.service';


@Component({
  selector: 'flx-logoff',
  template: `
    <div>
        <p-messages [value]="messages"></p-messages>
    </div>  
  `,
  styles: []
})
export class LogoffComponent extends BaseComponent<PassportService> {

  constructor(router: Router, service: PassportService) {
    super(router, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.logoff();
  }

  logoff() {
    this.service.logoff()
      .subscribe((result) => {
        console.log(result);
        this.navigate(['/']);
      },
      (error: Error) => {
        this.handleError(error);
      });
  }
}