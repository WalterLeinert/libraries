// tslint:disable:unified-signatures
import { StringBuilder, Types } from '@fluxgate/core';

import { ColumnMetadata } from '../metadata/columnMetadata';
import { ValidationMessage } from './validationMessage';
import { Validator } from './validator';

export class ValidationResult {
  public static Ok = new ValidationResult(true);

  private _messages: ValidationMessage[] = [];

  public static create(validator: Validator, property: string | ColumnMetadata, ok: boolean, text: string);
  public static create(validator: Validator, property: string | ColumnMetadata, ok: boolean, texts: string[]);
  public static create(validator: Validator, property: string | ColumnMetadata, ok: boolean,
    messages: ValidationMessage[]);


  public static create(validator: Validator, property: string | ColumnMetadata, ok: boolean,
    text: string | Array<ValidationMessage | string>): ValidationResult {

    let propertyName: string;

    if (Types.isPresent(property)) {
      if (typeof property === 'string') {
        propertyName = property;
      } else {
        propertyName = property.propertyName;
      }
    }

    if (!ok) {
      const sb = new StringBuilder();

      //
      // liegt ein einfach Meldungstext vor, wird dieser nur übernommen, falls keine spezielle Info vorliegt.
      //
      if (typeof text === 'string') {
        if (validator.info) {
          sb.append(validator.info);
        } else {
          sb.append(text);
        }
        return new ValidationResult(ok, propertyName, [new ValidationMessage(sb.toString())]);
      }

      if (Array.isArray(text)) {
        if (text.length > 0) {
          if (Types.isString(text[0])) {
            const messages: ValidationMessage[] = [];
            for (const txt of text) {
              const message = txt as any as string;
              messages.push(new ValidationMessage(message));
            }
            return new ValidationResult(ok, propertyName, messages);
          } else {
            return new ValidationResult(ok, propertyName, text as any as ValidationMessage[]);
          }
        }
      }
    }
    return new ValidationResult(ok);
  }


  private constructor(private _ok: boolean, private _propertyName?: string, messages?: ValidationMessage[]) {
    if (messages) {
      for (const message of messages) {
        this._messages.push(message);
      }
    }
  }

  public get ok(): boolean {
    return this._ok;
  }

  public get propertyName(): string {
    return this._propertyName;
  }

  public get messages(): ValidationMessage[] {
    return this._messages;
  }
}