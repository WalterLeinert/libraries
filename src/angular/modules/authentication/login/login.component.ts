/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChildren } from '@angular/core';

import { AutofocusDirective } from '../../../common/directives/autofocus.directive';
import { BaseComponent} from '../../../common/base/base.component';


import { PassportService } from './../passport.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container col-md-6">
      <h1>Login</h1>

      <p-messages [value]="messages"></p-messages>
      <form>
        <div class="form-group">
          <label [flxHighlight] for="username">Name</label>
          <input flxAutofocus type="text" class="form-control" id="username" required [(ngModel)]="username" name="username" placeholder="Benutzername">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <!--     <input flxAutofocus type="password" class="form-control" id="password" [(ngModel)]="password" name="password" placeholder="Passwort"> -->
          <input type="password" class="form-control" id="password" required [(ngModel)]="password" name="password" placeholder="Passwort">
        </div>
        <button type="submit" class="btn btn-default" (click)='login()'>Anmelden</button>

        <!--<button type="submit" class="btn" (click)='focusUsername()'>Focus auf Username</button>
        <button type="submit" class="btn" (click)='focusPassword()'>Focus auf Password</button>-->
      </form>
    </div>
  `,
  styles: []
})

export class LoginComponent extends BaseComponent<PassportService> {
  @ViewChildren(AutofocusDirective) inputs/*: AutofocusModule[]*/;

  username: string;
  password: string;

  constructor(router: Router, service: PassportService) {
    super(router, service);
  }

  login() {
    this.service.login(this.username, this.password)
      .subscribe(result => {
        console.log(result);
        this.navigate(['/artikel']);
      },
      (error: Error) => {
        this.handleInfo(error);
      });
  }

  focusUsername() {
    this.inputs.toArray().some(input =>
      input.focusIf('username'));
  }

  focusPassword() {
    this.inputs.toArray().some(input =>
      input.focusIf('password'));
  }
}