// tslint:disable:no-unused-expression

import { browser, element, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { ButtonComponent } from './button.comp';
import { InputComponent } from './input.comp';
import { LabelComponent } from './label.comp';
import { StartPage } from './start.po';
import { ITestUser } from './test-user.interface';
import { log } from './util';



export class LoginPage extends StartPage {
  protected static LOCATOR = 'flx-login';

  private _usernameLabel: LabelComponent;
  private _usernameInput: InputComponent;
  private _passwordLabel: LabelComponent;
  private _passwordInput: InputComponent;
  private _loginButton: ButtonComponent;

  constructor(app: IAppComponent, private user: ITestUser = {
    username: 'tester',
    password: 'tester'
  }) {
    super(app, LoginPage.LOCATOR);

    this._usernameLabel = new LabelComponent(this, 'label[for="username"]');
    this._usernameInput = new InputComponent(this, '#username');
    this._passwordLabel = new LabelComponent(this, 'label[for="password"]');
    this._passwordInput = new InputComponent(this, '#password');
    this._loginButton = new ButtonComponent(this, '#login');
  }

  public async expectElements() {

    expect(await this.usernameLabel.getElement()).not.toBeNull;
    expect(await this.usernameInput.getElement()).not.toBeNull;
    expect(await this.passwordLabel.getElement()).not.toBeNull;
    expect(await this.passwordInput.getElement()).not.toBeNull;
    expect(await this.loginButton.getElement()).not.toBeNull;
  }

  public navigateTo() {
    browser.get('/');
  }


  public loginTestUser() {
    this._usernameLabel = new LabelComponent(this, 'label[for="username"]');
    this._usernameInput = new InputComponent(this, '#username');
    this._passwordLabel = new LabelComponent(this, 'label[for="password"]');
    this._passwordInput = new InputComponent(this, '#password');
    this.loginUser(this.user.username, this.user.password);
  }


  public loginUser(username, password) {
    this.navigateTo();

    this.usernameInput.sendKeys(username);
    this.passwordInput.sendKeys(password);

    this.loginButton.click().then(() => {
      // log(`logged in user ${username}`);
    });
  }

  public getTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss('h1')).getText();
  }

  public get usernameLabel(): LabelComponent {
    return this._usernameLabel;
  }

  public get usernameInput(): InputComponent {
    return this._usernameInput;
  }

  public get passwordLabel(): LabelComponent {
    return this._passwordLabel;
  }

  public get passwordInput(): InputComponent {
    return this._passwordInput;
  }

  public get loginButton(): ButtonComponent {
    return this._loginButton;
  }
}