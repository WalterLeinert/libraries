import { ConfigBase } from '../model/config-base';
import { Column } from '../model/decorator/column';
import { Secret } from '../model/decorator/secret';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { Validators } from '../model/validation/validators';

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
    Validators.positiveInteger
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