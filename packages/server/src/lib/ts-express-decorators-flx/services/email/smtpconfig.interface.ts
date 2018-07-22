/**
 * Interface für SMTP-Versende-Zugangsdaten
 *
 * @export
 * @interface ISMTPConfig
 */
export interface ISMTPConfig {
  host: string;
  port: number;
  ssl: boolean;
  user: string;
  password: string;
  from: string;
}