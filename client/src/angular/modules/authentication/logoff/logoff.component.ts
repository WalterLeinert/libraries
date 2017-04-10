/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Types, User } from '@fluxgate/common';

// commands
import { UserServiceRequests } from '../redux/user-service-requests';

import { BaseComponent } from '../../../common/base/base.component';
import { MessageService } from '../../../services/message.service';
import { AuthenticationNavigation, IAuthenticationNavigation } from '../authenticationNavigation';
import { PassportService } from './../passport.service';

@Component({
  selector: 'flx-logoff',
  template: `
  `,
  styles: []
})
export class LogoffComponent extends BaseComponent<PassportService> {
  protected static logger = getLogger(LogoffComponent);

  constructor(private userServiceRequests: UserServiceRequests,
    router: Router, route: ActivatedRoute, messageService: MessageService, service: PassportService,
    @Inject(AuthenticationNavigation) private authenticationNavigation: IAuthenticationNavigation) {
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

          this.userServiceRequests.setCurrent(User.Null);

          if (Types.isPresent(this.authenticationNavigation.logoutRedirectUrl)) {
            this.navigate([this.authenticationNavigation.logoutRedirectUrl]);
          }
        },
        (error: Error) => {
          this.handleError(error);
        }));
    });
  }
}