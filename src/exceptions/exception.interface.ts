/**
 * 
 * @export
 * @interface IException
 */
export declare interface IException {
  name: string;
  message: string;
  stack: string;
  type: string;

  encodeException(): string;
}