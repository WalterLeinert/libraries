import { browser, element, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { BasePage } from './base.po';
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

  public async expectElements() {
    return this._login.expectElements();
  }

  public loginTestUser(): promise.Promise<void[]> {
    return this.loginUser(this.user.username, this.user.password);
  }


  public loginUser(username, password): promise.Promise<void[]> {
    this.navigateTo();

    return promise.all([
      this.login.usernameInput.sendKeys(username),
      this.login.passwordInput.sendKeys(password),
      this.login.loginButton.click()
    ]);
  }

  public getTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss('h1')).getText();
  }

  public get login(): LoginComponent {
    return this._login;
  }

}