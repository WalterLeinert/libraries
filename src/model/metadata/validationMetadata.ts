
/**
 * Metadaten zur Validierung von Attributen
 * 
 * @export
 * @class ValidationMetadata
 */
export class ValidationMetadata {
    constructor(public target: Function, public propertyName: string, public decorator: Function) {

    }
}