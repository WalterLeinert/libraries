/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


import { ExtendedCoreComponent, FormGroupInfo, MessageService, MetadataService } from '@fluxgate/client';
import { IUser, User } from '@fluxgate/common';
import { Core } from '@fluxgate/core';

// commands
import { CurrentUserServiceRequests } from '../../../redux/current-user-service-requests';
import { AuthenticationNavigation, AuthenticationNavigationToken } from '../authenticationNavigation';
import { PassportService } from '../passport.service';

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
          [(ngModel)]="user.username" placeholder="Username">
      </div>

      <div *ngIf="getFormErrors('username')" class="alert alert-danger">
        {{ getFormErrors('username') }}
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Password:</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" formControlName="password" id="password" required
          [(ngModel)]="user.password" placeholder="Password">
      </div>

      <div *ngIf="getFormErrors('password')" class="alert alert-danger">
        {{ getFormErrors('password') }}
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-5">
        <button type="submit" class="btn btn-primary" [disabled]="!isValid()" (click)='login()'>Login</button>
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

export class LoginComponent extends ExtendedCoreComponent {
  protected static logger = getLogger(LoginComponent);

  public user: IUser;


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
   *
   * @memberOf LoginComponent
   */
  constructor(private serviceRequests: CurrentUserServiceRequests,
    private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService,
    private metadataService: MetadataService,
    @Inject(AuthenticationNavigationToken) private authenticationNavigation: AuthenticationNavigation,
    private service: PassportService) {
    super(router, route, messageService);

    using(new XLog(LoginComponent.logger, levels.INFO, 'ctor'), (log) => {
      this.user = this.buildFormFromModel<User>(this.fb, User, this.metadataService, FormGroupInfo.DEFAULT_NAME, [
        'username', 'password'
      ]);
    });
  }


  public login() {
    using(new XLog(LoginComponent.logger, levels.INFO, 'login'), (log) => {
      const clientId = 1;     // TODO
      log.warn(`Login component um clientId erweitern`);

      this.registerSubscription(this.service.login(this.user.username, this.user.password, clientId)
        .subscribe((result) => {
          log.log(Core.stringify(result));

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