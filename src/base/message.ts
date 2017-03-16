
export enum MessageSeverity {
  Success,
  Info,
  Warn,
  Error,
  Fatal
}


/**
 * Interface für allgemeine Messages
 * 
 * @export
 * @interface IMessage
 */
export interface IMessage {

  /**
   * Severity
   * 
   * @type {MessageSeverity}
   * @memberOf IMessage
   */
  severity: MessageSeverity;

  /**
   * Summary der Message
   * 
   * @type {string}
   * @memberOf IMessage
   */
  summary: string;


  /**
   * Messagedetails
   * 
   * @type {string}
   * @memberOf IMessage
   */
  detail?: string;
}