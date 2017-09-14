import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { BasePage } from './base.po';
import { ChangePasswordComponent } from './change-password.comp';

export class ChangePasswordPage extends BasePage {
  private _changePassword: ChangePasswordComponent;

  constructor(app: IAppComponent, css: string = '') {
    super(app, css);

    this._changePassword = new ChangePasswordComponent(this);
  }

  public getTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss('h1')).getText();
  }

  public get changePassword(): ChangePasswordComponent {
    return this._changePassword;
  }
}