import { ConfigBase } from '../model/config-base';
import { Column } from '../model/decorator/column';
import { Table } from '../model/decorator/table';

@Table()
export class SmtpConfig extends ConfigBase {
  @Column({ displayName: 'Hostname' })
  public host: string;

  @Column({ displayName: 'Port' })
  public port: number;

  @Column({ displayName: 'Ssl' })
  public ssl: boolean;

  @Column({ displayName: 'User' })
  public user: string;

  @Column({ displayName: 'Password' })
  public password: string;

  @Column({ displayName: 'From' })
  public from: string;
}