export class ValidationMessage {

    constructor(private _text: string) {
    }

    public get text(): string {
        return this._text;
    }
}