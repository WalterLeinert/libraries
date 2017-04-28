import { Types } from '@fluxgate/core';

import { ValidationMessage } from './validationMessage';

export class ValidationResult {
  public static Ok = new ValidationResult(true);

  private _messages: ValidationMessage[] = [];

  public static create(ok: boolean, text: string);
  // tslint:disable-next-line:unified-signatures
  public static create(ok: boolean, texts: string[]);
  // tslint:disable-next-line:unified-signatures
  public static create(ok: boolean, messages: ValidationMessage[]);


  public static create(ok: boolean, text: string | Array<ValidationMessage | string>): ValidationResult {
    if (Types.isString(text)) {
      return new ValidationResult(ok, [new ValidationMessage(text as string)]);
    }
    if (Array.isArray(text)) {
      if (text.length > 0) {
        if (Types.isString(text[0])) {
          const messages: ValidationMessage[] = [];
          for (const txt of text) {
            const message = txt as any as string;
            messages.push(new ValidationMessage(message));
          }
          return new ValidationResult(ok, messages);
        } else {
          return new ValidationResult(ok, text as any as ValidationMessage[]);
        }
      }
    }
    return new ValidationResult(ok);
  }


  private constructor(private _ok: boolean, messages?: ValidationMessage[]) {
    if (messages) {
      for (const message of messages) {
        this._messages.push(message);
      }
    }
  }

  public get ok(): boolean {
    return this._ok;
  }

  public get messages(): ValidationMessage[] {
    return this._messages;
  }
}