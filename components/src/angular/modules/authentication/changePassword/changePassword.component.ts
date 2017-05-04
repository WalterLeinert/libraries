/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { BaseComponent, MessageService } from '@fluxgate/client';
import { Types } from '@fluxgate/core';


// commands
import { CurrentUserServiceRequests } from '../../../redux/current-user-service-requests';

import { AuthenticationNavigation, AuthenticationNavigationToken } from '../authenticationNavigation';
import { PassportService } from '../passport.service';


@Component({
  selector: 'flx-change-password',
  template: `
<div class="container">
  <h1>Login</h1>

  <p-messages [value]="messages"></p-messages>

  <form [formGroup]="form">
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Aktuelles Kennwort</label>
      <div class="col-sm-5">
        <input flxAutofocus type="password" class="form-control" formControlName="password" id="password" required
          [(ngModel)]="password" placeholder="Aktuelles Kennwort">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="passwordNew">Neues Kennwort</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" formControlName="passwordNew" id="passwordNew" required
          [(ngModel)]="passwordNew" placeholder="Neues Kennwort">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="passwordNewRepeated">Kennwort erneut eingeben</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" formControlName="passwordNewRepeated" id="passwordNewRepeated"
          required [(ngModel)]="passwordNewRepeated" placeholder="Kennwort erneut eingeben">
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

  public password: string;
  public passwordNew: string;
  public passwordNewRepeated: string;

  constructor(private fb: FormBuilder, private serviceRequests: CurrentUserServiceRequests,
    router: Router, route: ActivatedRoute, private location: Location, messageService: MessageService,
    @Inject(AuthenticationNavigationToken) private authenticationNavigation: AuthenticationNavigation,
    service: PassportService) {
    super(router, route, messageService, service);

    const form = fb.group({
      password: [undefined, Validators.required],
      passwordNew: [undefined, Validators.required],
      passwordNewRepeated: [undefined, Validators.required],
    });

    this.addForm(form);
  }

  public changePassword() {
    using(new XLog(ChangePasswordComponent.logger, levels.INFO, 'changePassword'), (log) => {
      if (this.password === this.passwordNew) {
        super.addInfoMessage(`Altes und neues Kennwort müssen unterschiedlich sein.`);
        return;
      }
      if (this.passwordNew !== this.passwordNewRepeated) {
        super.addInfoMessage(`Die Kennworte stimmen nicht überein.`);
        return;
      }

      this.registerSubscription(this.service.changePassword(this.currentStoreUser.username,
        this.password, this.passwordNew)
        .subscribe((user) => {
          log.info(`user = ${user}`);
          this.addSuccessMessage('Password changed.');

          this.serviceRequests.setCurrent(user).subscribe((u) => {
            if (Types.isPresent(this.authenticationNavigation.changePasswordRedirectUrl)) {
              this.navigate([this.authenticationNavigation.changePasswordRedirectUrl]);
            } else {
              this.location.back();
            }
          });

        },
        (error: Error) => {
          this.handleError(error);
        }));
    });
  }


  public cancel() {
    if (Types.isPresent(this.authenticationNavigation.changePasswordRedirectUrl)) {
      this.navigate([this.authenticationNavigation.changePasswordRedirectUrl]);
    } else {
      this.location.back();
    }
  }
}