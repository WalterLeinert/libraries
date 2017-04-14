export declare enum MessageSeverity {
    Success = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    Fatal = 4,
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
