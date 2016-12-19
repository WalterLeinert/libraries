/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// fluxgate
import { User, IUser, Assert } from '@fluxgate/common';

import { BaseComponent } from '../../../common/base'
import { PassportService } from './../passport.service';
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
        <button type="submit" class="btn btn-default" (click)='signup()'>Registrieren</button>
      </form>
    </div>  
  `,
  styles: []
})
export class RegisterComponent extends BaseComponent<PassportService> {
  public user: IUser;

  constructor(router: Router, service: PassportService, metadataService: MetadataService) {
    super(router, service);

    let userTableMetadata = metadataService.findTableMetadata(User.name);
    Assert.notNull(userTableMetadata, `Metadaten für Tabelle ${User.name}`);

    this.user = userTableMetadata.createEntity<IUser>();
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