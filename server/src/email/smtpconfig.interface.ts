/**
 * Interface für eigentliche Email
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