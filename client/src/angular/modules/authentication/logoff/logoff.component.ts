/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from 'redux';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { User } from '@fluxgate/common';

// redux
import { UserActions } from '../../../redux/actions';
import { AppStore } from '../../../redux/app-store';
import { IClientState } from '../../../redux/client-state.interface';

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

  constructor( @Inject(AppStore) private store: Store<IClientState>,
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