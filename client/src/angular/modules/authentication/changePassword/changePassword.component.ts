/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IUser } from '@fluxgate/common';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Types } from '@fluxgate/common';

// commands
import { UserServiceRequests } from '../commands/user-service-requests';


import { BaseComponent } from '../../../common/base/base.component';
import { MessageService } from '../../../services/message.service';
import { AuthenticationNavigation, IAuthenticationNavigation } from '../authenticationNavigation';
import { PassportService } from '../passport.service';


@Component({
  selector: 'flx-change-password',
  template: `
<div class="container">
  <h1>Login</h1>

  <p-messages [value]="messages"></p-messages>

  <form>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Aktuelles Kennwort</label>
      <div class="col-sm-5">
        <input flxAutofocus type="text" class="form-control" id="password" required 
          [(ngModel)]="password" name="password" placeholder="Aktuelles Kennwort">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="passwordNew">Neues Kennwort</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" id="passwordNew" required
          [(ngModel)]="passwordNew" name="passwordNew" placeholder="Neues Kennwort">
      </div>    
    </div> 

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="passwordNewRepeated">Kennwort erneut eingeben</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" id="passwordNewRepeated" required
          [(ngModel)]="passwordNewRepeated" name="passwordNewRepeated" placeholder="Kennwort erneut eingeben">
      </div>    
    </div> 

    <div class="form-group row">
      <div class="btn-group">
        <button type="submit" class="btn btn-primary" (click)='changePassword()'>Ändern</button>
        <button type="submit" class="btn" (click)='cancel()'>Abbrechen</button>
      </div>
    </div>
  </form>
</div>
  `,
  styles: [`
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* green */
}

.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* red */
}
`]
})

export class ChangePasswordComponent extends BaseComponent<PassportService> {
  protected static logger = getLogger(ChangePasswordComponent);

  public username: string;
  public password: string;
  public passwordNew: string;
  public passwordNewRepeated: string;
  private currentUser: IUser;

  constructor(private userServiceRequests: UserServiceRequests,
    router: Router, route: ActivatedRoute, messageService: MessageService,
    @Inject(AuthenticationNavigation) private authenticationNavigation: IAuthenticationNavigation,
    service: PassportService) {
    super(router, route, messageService, service);
  }

  public changePassword() {
    using(new XLog(ChangePasswordComponent.logger, levels.INFO, 'changePassword'), (log) => {
      if (this.passwordNew !== this.passwordNewRepeated) {
        super.addInfoMessage(`Die Kennworte stimmen nicht überein.`);
        return;
      }

      this.registerSubscription(this.service.changePassword(this.currentUser.username, this.password, this.passwordNew)
        .subscribe((user) => {
          log.info(`user = ${user}`);

          this.userServiceRequests.setCurrent(user);

          if (Types.isPresent(this.authenticationNavigation.changeUserRedirectUrl)) {
            this.navigate([this.authenticationNavigation.changeUserRedirectUrl]);
          }
        },
        (error: Error) => {
          this.handleError(error);
        }));
    });
  }


  public cancel() {
    if (Types.isPresent(this.authenticationNavigation.changeUserRedirectUrl)) {
      this.navigate([this.authenticationNavigation.changeUserRedirectUrl]);
    }
  }
}