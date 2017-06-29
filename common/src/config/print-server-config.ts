import { ConfigBase } from '../model/config-base';
import { Column } from '../model/decorator/column';
import { Secret } from '../model/decorator/secret';
import { Table } from '../model/decorator/table';

@Table()
export class PrintServerConfig extends ConfigBase {
  public static readonly TYPE = 'print-server';

  @Column({ hidden: true, default: PrintServerConfig.TYPE })
  public type: string = PrintServerConfig.TYPE;

  @Column({ displayName: 'Hostname' })
  public host: string;

  @Column({ displayName: 'Port' })
  public port: number;

  @Column({ displayName: 'Location' })
  public location: string;

  @Column({ displayName: 'User' })
  public user: string;

  @Secret()
  @Column({ displayName: 'Password' })
  public password: string;
}