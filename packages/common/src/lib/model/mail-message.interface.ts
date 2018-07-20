/**
 * Interface für die Message von Emails
 *
 * @export
 * @interface IMailMessage
 */
export interface IMailMessage {
  /**
   * Absender
   */
  from?: string;

  /**
   * Empfänger
   */
  to: string;

  /**
   * CC
   */
  cc?: string;

  /**
   * BCC
   */
  bcc?: string;

  /**
   * Betreff
   */
  subject: string;

  /**
   * Mailinhalt
   */
  text: string;
}
