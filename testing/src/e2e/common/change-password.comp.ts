import { browser, element, by, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { ButtonComponent } from './button.comp';
import { E2eComponent, IE2eComponent } from './e2e-component';
import { InputComponent } from './input.comp';
import { LabelComponent } from './label.comp';

export class ChangePasswordComponent extends E2eComponent {
  protected static LOCATOR = 'flx-change-password';

  private _passwordLabel: LabelComponent;
  private _passwordInput: InputComponent;
  private _passwordNewLabel: LabelComponent;
  private _passwordNewInput: InputComponent;
  private _passwordNewRepeatedLabel: LabelComponent;
  private _passwordNewRepeatedInput: InputComponent;
  private _changePasswordButton: ButtonComponent;
  private _cancelButton: ButtonComponent;

  constructor(parent: IE2eComponent) {
    super(parent, ChangePasswordComponent.LOCATOR);

    this._passwordLabel = new LabelComponent(this, 'label[for="password"]');
    this._passwordInput = new InputComponent(this, '#password');
    this._passwordNewLabel = new LabelComponent(this, 'label[for="passwordNew"]');
    this._passwordNewInput = new InputComponent(this, '#passwordNew');
    this._passwordNewRepeatedLabel = new LabelComponent(this, 'label[for="passwordNewRepeated"]');
    this._passwordNewRepeatedInput = new InputComponent(this, '#passwordNewRepeated');

    this._changePasswordButton = new ButtonComponent(this, '#changePassword');
    this._cancelButton = new ButtonComponent(this, '#cancel');
  }

  public async expectElements() {
    expect(await this.passwordLabel.getElement()).not.toBeNull;
    expect(await this.passwordInput.getElement()).not.toBeNull;

    expect(await this.passwordNewLabel.getElement()).not.toBeNull;
    expect(await this.passwordNewInput.getElement()).not.toBeNull;

    expect(await this.passwordNewRepeatedLabel.getElement()).not.toBeNull;
    expect(await this.passwordNewRepeatedInput.getElement()).not.toBeNull;

    expect(await this.changePasswordButton.getElement()).not.toBeNull;
    expect(await this.cancelButton.getElement()).not.toBeNull;
  }

  public get passwordLabel(): LabelComponent {
    return this._passwordLabel;
  }

  public get passwordInput(): InputComponent {
    return this._passwordInput;
  }

  public get passwordNewLabel(): LabelComponent {
    return this._passwordNewLabel;
  }

  public get passwordNewInput(): InputComponent {
    return this._passwordNewInput;
  }

  public get passwordNewRepeatedLabel(): LabelComponent {
    return this._passwordNewRepeatedLabel;
  }

  public get passwordNewRepeatedInput(): InputComponent {
    return this._passwordNewRepeatedInput;
  }

  public get changePasswordButton(): ButtonComponent {
    return this._changePasswordButton;
  }

  public get cancelButton(): ButtonComponent {
    return this._cancelButton;
  }
}