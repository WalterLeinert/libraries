/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


import { BaseComponent, MessageService } from '@fluxgate/client';

// commands
import { CurrentUserServiceRequests } from '../../../redux/current-user-service-requests';
import { AuthenticationNavigation, AuthenticationNavigationToken } from '../authenticationNavigation';
import { ChangePasswordGuardService } from '../changePassword/changePassword-guard.service';
import { PassportService } from '../passport.service';
import { RegisterGuardService } from '../register/register-guard.service';

@Component({
  selector: 'flx-login',
  template: `
<div class="container">
  <h1>Login</h1>

  <form [formGroup]="form">
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="username">Name</label>
      <div class="col-sm-5">
        <input flxAutofocus type="text" class="form-control" formControlName="username" id="username" required
          [(ngModel)]="username" name="username" placeholder="Username">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Password:</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" formControlName="password" id="password" required
          [(ngModel)]="password" name="password" placeholder="Password">
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-5">
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid" (click)='login()'>Login</button>
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

export class LoginComponent extends BaseComponent<PassportService> {
  protected static logger = getLogger(LoginComponent);

  public username: string;
  public password: string;


  /**
   * Creates an instance of LoginComponent.
   *
   * Hinweis: Die Guard-Services @see{ChangePasswordGuardService} und
   * @see{RegisterGuardService} werden hier injiziert, damit diese dann korrekt
   * über Änderungen des aktuellen Benutzers informiert werden.
   *
   * @param {Router} router
   * @param {NavigationService} navigationService
   * @param {PassportService} service
   * @param {ChangePasswordGuardService} changePasswordGuardService
   * @param {RegisterGuardService} registerGuardService
   *
   * @memberOf LoginComponent
   */
  constructor(private serviceRequests: CurrentUserServiceRequests,
    private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService,
    @Inject(AuthenticationNavigationToken) private authenticationNavigation: AuthenticationNavigation,
    service: PassportService, changePasswordGuardService: ChangePasswordGuardService,
    registerGuardService: RegisterGuardService) {
    super(router, route, messageService, service);

    using(new XLog(LoginComponent.logger, levels.INFO, 'ctor'), (log) => {

      this.buildFormFromValidators(this.fb, {
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    });
  }


  public login() {
    using(new XLog(LoginComponent.logger, levels.INFO, 'login'), (log) => {
      this.registerSubscription(this.service.login(this.username, this.password)
        .subscribe((result) => {
          log.log(JSON.stringify(result));

          this.serviceRequests.setCurrent(result).subscribe((user) => {
            this.navigate([
              this.authenticationNavigation.loginRedirectUrl
            ]);
          });

        },
        (error: Error) => {
          this.handleError(error);
        }));
    });
  }
}