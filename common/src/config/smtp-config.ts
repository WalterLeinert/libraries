import { ConfigBase } from '../model/config-base';
import { Column } from '../model/decorator/column';
import { Secret } from '../model/decorator/secret';
import { Table } from '../model/decorator/table';

@Table()
export class SmtpConfig extends ConfigBase {
  public static readonly TYPE = 'smtp';

  /**
   * Typ der Konfiguration (z.B. 'smtp')
   *
   * @type {string}@memberof ConfigBase
   */
  @Column({ hidden: true, default: SmtpConfig.TYPE })
  public type: string = SmtpConfig.TYPE;

  @Column({ displayName: 'Hostname' })
  public host: string;

  @Column({ displayName: 'Port' })
  public port: number;

  @Column({ displayName: 'Ssl' })
  public ssl: boolean;

  @Column({ displayName: 'User' })
  public user: string;

  @Secret()
  @Column({ displayName: 'Password' })
  public password: string;

  @Column({ displayName: 'From' })
  public from: string;
}