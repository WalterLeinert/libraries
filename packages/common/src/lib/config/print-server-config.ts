import { ConfigBase } from '../model/config-base';
import { Column } from '../model/decorator/column';
import { ColumnGroup } from '../model/decorator/column-group';
import { Secret } from '../model/decorator/secret';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';


@ColumnGroup(PrintServerConfig.TYPE, [
  'host',
  'port',
  'location',
  'user',
  'password'
], { displayName: 'Printserver' })
@Table()
export class PrintServerConfig extends ConfigBase {
  public static readonly TYPE = 'print-server';

  @Column({ hidden: true, default: PrintServerConfig.TYPE })
  public type: string = PrintServerConfig.TYPE;

  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'Hostname' })
  public host: string;

  @Validation([
    Validators.required,
    // TODO: geht so nicht -- vom Control kommt der Wert vom Typ number und nicht string
    // Validators.positiveInteger
  ])
  @Column({ displayName: 'Port' })
  public port: number;

  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'Location' })
  public location: string;

  @Validation([
    Validators.required
  ])
  @Column({ displayName: 'User' })
  public user: string;

  @Validation([
    Validators.required
  ])
  @Secret()
  @Column({ displayName: 'Password' })
  public password: string;
}