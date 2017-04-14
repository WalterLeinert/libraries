/**
 *
 * @export
 * @interface IException
 */
export interface IException {
    name: string;
    message: string;
    stack: string;
    kind: string;
    innerException: IException;
    encodeException(): string;
}
