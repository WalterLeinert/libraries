import { browser, element, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { BasePage } from './base.po';
import { ButtonComponent } from './button.comp';
import { InputComponent } from './input.comp';
import { LabelComponent } from './label.comp';
import { LoginComponent } from './login.comp';
import { ITestUser } from './test-user.interface';


export class LoginPage extends BasePage {
  private _login: LoginComponent;

  constructor(app: IAppComponent, css: string = '', private user: ITestUser = {
    username: 'tester',
    password: 'tester'
  }) {
    super(app, css);

    this._login = new LoginComponent(this);
  }

  public navigateTo(url: string = '/'): promise.Promise<any> {
    return browser.get(url);
  }

  public async expectElements(): promise.Promise<void> {
    return this._login.expectElements();
  }

  public loginTestUser(): promise.Promise<void[]> {
    return this.loginUser(this.user.username, this.user.password);
  }


  public loginUser(username, password): promise.Promise<void[]> {
    this.navigateTo();

    return promise.all([
      this.usernameInput.sendKeys(username),
      this.passwordInput.sendKeys(password),
      this.loginButton.click()
    ]);
  }

  public getTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss('h1')).getText();
  }

  public get usernameLabel(): LabelComponent {
    return this._login.usernameLabel;
  }

  public get usernameInput(): InputComponent {
    return this._login.usernameInput;
  }

  public get passwordLabel(): LabelComponent {
    return this._login.passwordLabel;
  }

  public get passwordInput(): InputComponent {
    return this._login.passwordInput;
  }

  public get loginButton(): ButtonComponent {
    return this._login.loginButton;
  }

}