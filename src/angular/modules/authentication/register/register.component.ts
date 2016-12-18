/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SelectItem } from 'primeng/primeng';

// fluxgate
import { User, IUser, IRole, Assert } from '@fluxgate/common';

import { Base2Component } from '../../../common/base'
import { PassportService, RoleService } from './..';
import { MetadataService } from '../../../services';


@Component({
  selector: 'flx-register',
  template: `
    <div class="container col-md-6">
      <h1>Registrierung</h1>
      <p-messages [value]="messages"></p-messages>
      <form>
        <div class="form-group">
          <label for="username">Name</label>
          <input type="text" flxAutofocus class="form-control" required id="username" required [(ngModel)]="user.username" name="username"
            placeholder="Benutzername">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" required id="password" [(ngModel)]="user.password" name="password" placeholder="Passwort">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" class="form-control" required id="email" required [(ngModel)]="user.email" name="email" placeholder="Email">
        </div>
        <div class="form-group">
          <label for="role">Rolle</label>
          <p-dropdown [options]="roles" [(ngModel)]="selectedRole" required id="role" name="role"></p-dropdown>
        </div>
        <button type="submit" class="btn btn-default" (click)='signup()'>Registrieren</button>
      </form>
    </div>  
  `,
  styles: []
})
export class RegisterComponent extends Base2Component<PassportService, RoleService> {
  public user: IUser;
  public selectedRole: IRole;
  public roles: SelectItem[] = [];

  constructor(router: Router, service: PassportService, roleService: RoleService, metadataService: MetadataService) {
    super(router, service, roleService);
    let userTableMetadata = metadataService.findTableMetadata(User.name);
    Assert.notNull(userTableMetadata, `Metadaten für Tabelle ${User.name}`);

    this.user = userTableMetadata.createEntity<IUser>();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.service2.find()
      .subscribe(
      roles => {
        roles.forEach(item => {
          this.roles.push(
            { label: item.name, value: item }
        )}); 
  
      },
      (error: Error) => {
        this.handleInfo(error);
      });
  }

  signup() {
    this.service.signup(this.user)
      .subscribe(result => {
        console.log(result);
        this.navigate(['/artikel']);
      },
      (error: Error) => {
        this.handleInfo(error);
      });
  }
}