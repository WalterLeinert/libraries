
import { ValidationMessage } from './validationMessage';

export class ValidationResult {
    public static Ok = new ValidationResult(true);

    private _messages: ValidationMessage[] = [];

    public static create(ok: boolean, text: string);
    public static create(ok: boolean, texts: string[]);
    public static create(ok: boolean, messages: ValidationMessage[]);

    public static create(ok: boolean, text: string | string[] | ValidationMessage[]): ValidationResult {
        if (typeof text === 'string') {
            return new ValidationResult(ok, [new ValidationMessage(text as string)]);
        }
        if (Array.isArray(text)) {
            if (text.length > 0) {
                if (typeof text[0] === 'string') {
                    let messages = [];
                    for (let message of text) {
                        messages.push(new ValidationMessage(message as string));
                    }
                    return new ValidationResult(ok, messages);
                }
            }
        }
        return new ValidationResult(ok);
    }


    private constructor(private _ok: boolean, messages?: ValidationMessage[]) {
        if (messages) {
            for (let message of messages) {
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