/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { BaseComponent } from '../../../common/base/base.component';
import { MessageService } from '../../../services/message.service';
import { PassportService } from './../passport.service';

@Component({
  selector: 'flx-logoff',
  template: `
  `,
  styles: []
})
export class LogoffComponent extends BaseComponent<PassportService> {
  protected static logger = getLogger(LogoffComponent);

  constructor(router: Router, route: ActivatedRoute, messageService: MessageService, service: PassportService) {
    super(router, route, messageService, service);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.logoff();
  }

  public logoff() {
    using(new XLog(LogoffComponent.logger, levels.INFO, 'logoff'), (log) => {
      this.registerSubscription(this.service.logoff()
        .subscribe(() => {
          log.log('done');
          this.navigate(['/']);
        },
        (error: Error) => {
          this.handleError(error);
        }));
    });
  }
}