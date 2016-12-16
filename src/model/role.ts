import { AppRegistry } from '../base';
import { IRole, Table, Column } from '.';

/**
 * Modelliert User Rollen (Defaultimplemetierung)
 */
@Table({ name: 'role' })
export class Role implements IRole {

  /**
  * der Key für den Zugriff über @see{AppRegistry}
  */
  public static readonly ROLE_CONFIG_KEY = 'IRole';

  @Column({ name: 'role_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'role_name' })
  public name: string;

  @Column({ name: 'role_description' })
  public description: string;
}

/**
 * Role Klasse registrieren
 */
AppRegistry.instance.add<Function>(Role.ROLE_CONFIG_KEY, Role);