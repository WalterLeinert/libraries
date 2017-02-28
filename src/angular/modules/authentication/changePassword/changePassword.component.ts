/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// import 'reflect-metadata';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


// PrimeNG
import { ConfirmationService } from 'primeng/primeng';

import { IUser } from '@fluxgate/common';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { BaseComponent } from '../../../common/base/base.component';

import { NavigationService } from '../navigation.service';
import { PassportService } from '../passport.service';

@Component({
  selector: 'flx-change-password',
  template: `
<div class="container">
  <h1>Login</h1>

  <p-messages [value]="messages"></p-messages>

  <form>
    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="password">Aktuelles Kennwort</label>
      <div class="col-sm-5">
        <input flxAutofocus type="text" class="form-control" id="password" required 
          [(ngModel)]="password" name="password" placeholder="Aktuelles Kennwort">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="passwordNew">Neues Kennwort</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" id="passwordNew" required
          [(ngModel)]="passwordNew" name="passwordNew" placeholder="Neues Kennwort">
      </div>    
    </div> 

    <div class="form-group row">
      <label class="col-form-label col-sm-2" for="passwordNewRepeated">Kennwort erneut eingeben</label>
      <div class="col-sm-5">
        <input type="password" class="form-control" id="passwordNewRepeated" required
          [(ngModel)]="passwordNewRepeated" name="passwordNewRepeated" placeholder="Kennwort erneut eingeben">
      </div>    
    </div> 

    <div class="form-group row">
      <div class="btn-group">
        <button type="submit" class="btn btn-primary" (click)='changePassword()'>Ändern</button>
        <button type="submit" class="btn" (click)='cancel()'>Abbrechen</button>
      </div>
    </div>
  </form>

  <p-confirmDialog icon="fa fa-question-circle-o fa5x" width="450" #cd>
    <footer>
      <button type="button" pButton label="Cancel" (click)="cd.reject()"></button>
      <button type="button" pButton icon="fa-trash-o" label="Delete" (click)="cd.accept()"></button>
    </footer>
  </p-confirmDialog>
</div>
  `,
  styles: [],
  providers: [ConfirmationService]
})

export class ChangePasswordComponent extends BaseComponent<PassportService> {
  protected static logger = getLogger(ChangePasswordComponent);

  public username: string;
  public password: string;
  public passwordNew: string;
  public passwordNewRepeated: string;
  private currentUser: IUser;

  constructor(router: Router, route: ActivatedRoute, private navigationService: NavigationService,
    service: PassportService, private confirmationService: ConfirmationService) {
    super(router, route, service);
  }

  public ngOnInit() {
    super.ngOnInit();

    this.registerSubscription(this.service.getCurrentUser().subscribe(
      (user) => this.currentUser = user
    ));
  }

  public changePassword() {
    if (this.passwordNew !== this.passwordNewRepeated) {
      super.addInfoMessage(`Die neuen Kennworte stimmen nicht überein.`);
      return;
    }

    this.registerSubscription(this.service.changePassword(this.currentUser.username, this.password, this.passwordNew)
      .subscribe((user) => {
        ChangePasswordComponent.logger.info(`ChangePasswordComponent.changePassword: user = ${user}`);

        this.navigate([
          this.navigationService.navigationPath
        ]);
      },
      (error: Error) => {
        this.handleInfo(error);
      }));
  }


  public cancel() {
    this.navigate([
      this.navigationService.navigationPath
    ]);
  }

  public confirm() {
    this.confirmationService.confirm({
      header: 'Delete',
      message: 'Are you sure you want to delete the selected department?',
      accept: () => {
        ChangePasswordComponent.logger.info('delete');
        // this.delete(true);
      },
      reject: () => {
        ChangePasswordComponent.logger.info('cancel');
      }
    });
  }

}