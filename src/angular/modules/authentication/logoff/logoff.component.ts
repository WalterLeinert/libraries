/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// -------------------------- logging -------------------------------
import {
  configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { BaseComponent } from '../../../common/base/base.component';
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
  protected static logger = getLogger(LogoffComponent);

  constructor(router: Router, service: PassportService) {
    super(router, service);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.logoff();
  }

  public logoff() {
    this.service.logoff()
      .subscribe((result) => {
        LogoffComponent.logger.info(result);
        this.navigate(['/']);
      },
      (error: Error) => {
        this.handleError(error);
      });
  }
}