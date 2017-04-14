import { IException } from './exception.interface';
export declare function unimplemented(): void;
/**
 * Assertion, die nicht auf der Exception-Basisklasse basiert (sonst: Rekursion!)
 *
 * @export
 * @param {boolean} condition
 * @param {string} [message]
 */
export declare function assert(condition: boolean, message?: string): void;
/**
 * Exception-Basisklasse
 * (analog zu https://github.com/Romakita/ts-httpexceptions/blob/master/src/exception.ts)
 *
 * @export
 * @class Exception
 * @extends {Error}
 */
export declare abstract class Exception implements IException {
    private _kind;
    static readonly EXC_PREFIX: string;
    static readonly EXC_POSTFIX: string;
    static readonly EXC_SEPARATOR: string;
    private _nativeError;
    private _message;
    private _innerException;
    protected constructor(_kind: string, message: string, innerException?: IException | Error);
    toString(): string;
    encodeException(): string;
    protected setKind(kind: string): void;
    readonly kind: string;
    readonly name: string;
    readonly stack: string;
    readonly message: string;
    readonly innerException: IException;
    /**
     * Liefert true, falls die Meldung mit dem Präfix für kodierte Exceptions beginnt.
     *
     * @static
     * @param {string} message
     * @returns
     *
     * @memberOf Exception
     */
    static isEncodedException(message: string): boolean;
    /**
     * Liefert für die Fehlermeldung @param{message} eine @see{IException}
     *
     * Ist in der Meldung eine spezielle Exception (mit ggf. inner exceptions) kodiert,
     * wird diese konkrete Exception erzeugt.
     *
     * Beispiel: {exc:ServerBusinessException::unknown user::{exc:AssertionException::property username is missing::}}
     *
     * -> ServerBusinessException (inner: AssertionException)
     *
     * @static
     * @param {string} message
     * @returns {IException}
     *
     * @memberOf Exception
     */
    static decodeException(message: string): IException;
}
