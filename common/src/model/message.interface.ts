/**
 * Interface für eigentliche Email
 *
 * @export
 * @interface IMessage
 */
export interface IMessage {
  from?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  text: string;
}