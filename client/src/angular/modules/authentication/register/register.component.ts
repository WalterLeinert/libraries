/* tslint:disable:use-life-cycle-interface -> BaseComponent */
// tslint:disable:max-line-length

// Angular
import { Component, Inject, Injector } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// fluxgate
import { Assert, IRole, Types, User } from '@fluxgate/common';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

// commands
import { UserServiceRequests } from '../commands/user-service-requests';

import { Base2Component } from '../../../common/base';
import { MetadataService } from '../../../services';
import { MessageService } from '../../../services/message.service';
import { AuthenticationNavigation, IAuthenticationNavigation } from '../authenticationNavigation';
import { PassportService } from '../passport.service';
import { RoleService } from '../role.service';


@Component({
  selector: 'flx-register',
  template: `
<div class="container">
  <h1>Register</h1>

  <form [formGroup]="getForm()">
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
        <flx-dropdown-selector [dataService]="service2" [textField]="'description'" [valueField]="'id'" [ngModel]="user.role"
          (selectedValueChange)="onSelectedRoleChanged($event)"
          [style]="{'width':'200px'}" [debug]="false" id="role" >   <!-- formControlName="role" -->
          </flx-dropdown-selector>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-sm-5">
        <!-- disabled Steuerung nach Umbau von flx-dropdown auf getForm().invalid umbauen -->
        <button type="submit" class="btn btn-primary" [disabled]="isRegisterDisabled()" (click)='signup()'>Register</button>
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
export class RegisterComponent extends Base2Component<PassportService, RoleService> {
  protected static logger = getLogger(RegisterComponent);

  public user: User;
  public selectedRole: IRole;

  constructor(private userServiceRequests: UserServiceRequests,
    private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService,
    @Inject(AuthenticationNavigation) private authenticationNavigation: IAuthenticationNavigation, service: PassportService,
    roleService: RoleService, metadataService: MetadataService, injector: Injector) {

    super(router, route, messageService, service, roleService);

    const userTableMetadata = metadataService.findTableMetadata(User.name);
    Assert.notNull(userTableMetadata, `Metadaten f�r Tabelle ${User.name}`);

    this.user = userTableMetadata.createEntity<User>();

    const displayInfos = this.createDisplayInfos(this.user, User, metadataService, injector);
    this.buildForm(this.fb, this.user, displayInfos, userTableMetadata);
  }

  public signup() {
    using(new XLog(RegisterComponent.logger, levels.INFO, 'signup'), (log) => {
      this.registerSubscription(this.service.signup(this.user)
        .subscribe((result) => {
          log.log(JSON.stringify(result));

          this.userServiceRequests.setCurrent(result);

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
    RegisterComponent.logger.info(`RegisterComponent.onSelectedRoleChanged: item = ${JSON.stringify(item)}`);
  }

  public isRegisterDisabled() {
    return (
      this.isFormControlInvalid('username') ||
      this.isFormControlInvalid('password') ||
      this.isFormControlInvalid('email')
    );
  }
}