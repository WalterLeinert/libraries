/* tslint:disable:use-life-cycle-interface -> BaseComponent */
// tslint:disable:max-line-length

// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SelectItem } from 'primeng/primeng';

// fluxgate
import { Assert, IRole, IUser, User } from '@fluxgate/common';

// -------------------------- logging -------------------------------
import {
  configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Base2Component } from '../../../common/base';
import { MetadataService } from '../../../services';
import { NavigationService } from '../navigation.service';
import { PassportService } from '../passport.service';
import { RoleService } from '../role.service';


@Component({
  selector: 'flx-register',
  template: `
<div class="container">
  <h1>Register</h1>

  <p-messages [value]="messages"></p-messages>

  <form>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="username">Name</label>
      <div class="col-sm-5">
        <input type="text" flxAutofocus class="form-control" required id="username" required [(ngModel)]="user.username" name="username"
          placeholder="Benutzername">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="firstname">Vorname</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" id="firstname" [(ngModel)]="user.firstname" name="firstname"
          placeholder="Vorname">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="lastname">Nachname</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" id="lastname" [(ngModel)]="user.lastname" name="lastname"
          placeholder="Nachname">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Password</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" required id="password" [(ngModel)]="user.password" name="password"
          placeholder="Passwort">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="email">Email</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" required id="email" required [(ngModel)]="user.email" name="email" placeholder="Email">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="role">Rolle</label>
      <div class="col-sm-5">
        <flx-dropdown-selector [dataService]="service2" [textField]="'description'" [valueField]="'id'" [selectedValue]="user.role"
          (selectedValueChange)="onSelectedRoleChanged($event)"
          [style]="{'width':'200px'}" [debug]="false" name="roles">
          </flx-dropdown-selector>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-sm-5">
        <button type="submit" class="btn btn-primary" (click)='signup()'>Registrieren</button>
      </div>
    </div>
    
  </form>
</div>
  `,
  styles: []
})
export class RegisterComponent extends Base2Component<PassportService, RoleService> {
  protected static logger = getLogger('LoginComponent');

  public user: User;
  public selectedRole: IRole;

  constructor(router: Router, private navigationService: NavigationService, service: PassportService,
    roleService: RoleService, metadataService: MetadataService) {

    super(router, service, roleService);

    const userTableMetadata = metadataService.findTableMetadata(User.name);
    Assert.notNull(userTableMetadata, `Metadaten für Tabelle ${User.name}`);

    this.user = userTableMetadata.createEntity<User>();
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public signup() {
    this.service.signup(this.user)
      .subscribe((result) => {
        RegisterComponent.logger.info(JSON.stringify(result));

        this.navigate([
          this.navigationService.navigationPath
        ]);
      },
      (error: Error) => {
        this.handleInfo(error);
      });
  }

  public onSelectedRoleChanged(item: IRole) {
    RegisterComponent.logger.info(`RegisterComponent.onSelectedRoleChanged: item = ${JSON.stringify(item)}`);
  }
}