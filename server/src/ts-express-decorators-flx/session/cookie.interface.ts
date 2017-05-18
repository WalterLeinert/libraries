/**
 * Cookie Informationen
 *
 * @export
 * @interface ICookie
 */
export interface ICookie {
  httpOnly: boolean;
  maxAge: number;
  path: string;
  secure: boolean;
}