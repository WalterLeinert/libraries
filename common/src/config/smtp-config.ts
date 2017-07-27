import { ConfigBase } from '../model/config-base';
import { Column } from '../model/decorator/column';
import { ColumnGroup } from '../model/decorator/column-group';
import { Secret } from '../model/decorator/secret';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';


@ColumnGroup(SmtpConfig.TYPE, [
  'host',
  'port',
  'ssl',
  'user',
  'password',
  'from'
], { displayName: 'Smtp' })
@Table()
export class SmtpConfig extends ConfigBase {
  public static readonly TYPE = 'smtp';

  @Column({ hidden: true, default: SmtpConfig.TYPE })
  public type: string = SmtpConfig.TYPE;

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
  @Column({ displayName: 'Ssl', default: true })
  public ssl: boolean;

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

  @Column({ displayName: 'From' })
  public from: string;
}