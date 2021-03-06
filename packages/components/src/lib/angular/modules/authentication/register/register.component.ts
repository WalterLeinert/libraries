/* tslint:disable:use-life-cycle-interface -> BaseComponent */
// tslint:disable:max-line-length

// Angular
import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// fluxgate
import { ExtendedCoreComponent, MessageService, MetadataService } from '@fluxgate/client';
import { IRole, User, UserRoleId } from '@fluxgate/common';
import { Assert, Core, Types } from '@fluxgate/core';
import { AuthenticationNavigation, AuthenticationNavigationToken } from '../authenticationNavigation';
import { PassportService } from '../passport.service';

@Component({
  selector: 'flx-register',
  template: `
<div class="container">
  <h1>Register</h1>

  <form [formGroup]="form">
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="username">Username</label>
      <div class="col-sm-5">
        <input type="text" flxAutofocus class="form-control" required id="username" required [(ngModel)]="user.username" formControlName="username"
          placeholder="Username">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="firstname">Firstname</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" id="firstname" [(ngModel)]="user.firstname" formControlName="firstname"
          placeholder="Firstname">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="lastname">Lastname</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" id="lastname" [(ngModel)]="user.lastname" formControlName="lastname"
          placeholder="Lastname">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Password</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" required id="password" [(ngModel)]="user.password" formControlName="password"
          placeholder="Password">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="email">Email</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" required id="email" required [(ngModel)]="user.email" formControlName="email" placeholder="Email">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="role">Role</label>
      <div class="col-sm-5">
        <flx-role-selector styleClass="form-control" required [textField]="'description'" [valueField]="'id'" [(ngModel)]="user.role" formControlName="role"
          (valueChange)="onSelectedRoleChanged($event)"
          [debug]="false" [debug]="false" id="role">
        </flx-role-selector>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-sm-5">
        <!-- disabled Steuerung nach Umbau von flx-dropdown auf getForm().invalid umbauen -->
        <button type="submit" class="btn btn-primary" id="signup" [disabled]="form.invalid" (click)='signup()'>Register</button>
        <button type="submit" class="btn" id="cancel" (click)='cancel()'>Abbrechen</button>
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
export class RegisterComponent extends ExtendedCoreComponent {
  protected static logger = getLogger(RegisterComponent);

  public user: User;

  constructor(
    private fb: FormBuilder, router: Router, route: ActivatedRoute, private location: Location, messageService: MessageService,
    @Inject(AuthenticationNavigationToken) private authenticationNavigation: AuthenticationNavigation, private service: PassportService,
    metadataService: MetadataService) {

    super(router, route, messageService);

    const userTableMetadata = metadataService.findTableMetadata(User);
    Assert.notNull(userTableMetadata, `Metadaten für Tabelle ${User.name}`);

    this.user = userTableMetadata.createEntity<User>();
    this.user.role = UserRoleId.User;

    const groupInfos = this.createGroupInfos(userTableMetadata, this.user, User, metadataService);
    this.buildForm(this.fb, this.user, groupInfos, userTableMetadata);
  }

  public signup() {
    using(new XLog(RegisterComponent.logger, levels.INFO, 'signup'), (log) => {
      this.registerSubscription(this.service.signup(this.user)
        .subscribe((result) => {
          log.log(Core.stringify(result));
          this.addSuccessMessage('User created.');

          this.resetForm();
          if (Types.isPresent(this.authenticationNavigation.registerRedirectUrl)) {
            this.navigate([
              this.authenticationNavigation.registerRedirectUrl
            ]);
          }
        },
        (error: Error) => {
          this.handleError(error);
        }));
    });
  }

  public onSelectedRoleChanged(item: IRole) {
    RegisterComponent.logger.info(`RegisterComponent.onSelectedRoleChanged: item = ${Core.stringify(item)}`);
  }

  public isRegisterDisabled() {
    return (
      this.isFormControlInvalid('username') ||
      this.isFormControlInvalid('password') ||
      this.isFormControlInvalid('email')
    );
  }

  public cancel() {
    if (Types.isPresent(this.authenticationNavigation.registerRedirectUrl)) {
      this.navigate([this.authenticationNavigation.registerRedirectUrl]);
    } else {
      this.location.back();
    }
  }
}