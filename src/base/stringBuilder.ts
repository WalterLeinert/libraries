import { Constants } from '../constants';

/**
 * Einfache StringBuilder Implentierung
 * 
 * @export
 * @class StringBuilder
 */
export class StringBuilder {
    private strings: string[] = [];

    /**
     * Creates an instance of StringBuilder.
     * 
     * @param {string} [text]
     * 
     * @memberOf StringBuilder
     */
    constructor(text?: string) {
        if (text) {
            this.strings.push(text);
        }
    }

    /**
     * Fügt den angegeben Text hinzu.
     * 
     * @param {string} text
     * 
     * @memberOf StringBuilder
     */
    public append(text: string) {
        this.strings.push(text);
    }


    /**
     * Fügt den angegeben Text hinzu und hängt ein EOL an.
     * 
     * @param {string} [text]
     * 
     * @memberOf StringBuilder
     */
    public appendLine(text?: string) {
        this.append(text + Constants.EOL);
    }

    /**
     * Liefert den kompletten Text als @see{string}
     * 
     * @returns {string}
     * 
     * @memberOf StringBuilder
     */
    public toString(): string {
        return this.strings.join('');
    }
}