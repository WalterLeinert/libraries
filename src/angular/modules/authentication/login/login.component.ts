/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../../../common/base/base.component';

import { PassportService } from '../passport.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'flx-login',
  template: `
<div class="container">
  <h1>Login</h1>

  <p-messages [value]="messages"></p-messages>

  <form>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="username">Name</label>
      <div class="col-sm-5">
        <input flxAutofocus type="text" class="form-control" id="username" required 
          [(ngModel)]="username" name="username" placeholder="Benutzername">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Password:</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" id="password" required
          [(ngModel)]="password" name="password" placeholder="Passwort">
      </div>    
    </div> 

    <div class="form-group row">
      <div class="col-sm-5">
        <button type="submit" class="btn btn-primary" (click)='login()'>Anmelden</button>
      </div>
    </div>
  </form>
</div>
  `,
  styles: []
})

export class LoginComponent extends BaseComponent<PassportService> {
  username: string;
  password: string;

  constructor(router: Router, private navigationService: NavigationService, service: PassportService) {
    super(router, service);
  }

  login() {
    this.service.login(this.username, this.password)
      .subscribe(result => {
        console.log(result);
        this.navigate([
          this.navigationService.navigationPath
        ]);
      },
      (error: Error) => {
        this.handleInfo(error);
      });
  }
}