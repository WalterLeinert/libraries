import { EnumHelper, Funktion } from '@fluxgate/core';

import { AppRegistry } from '../base/appRegistry';
import { Column } from '../model/decorator/column';
import { IdColumn } from '../model/decorator/id-column';
import { Table } from '../model/decorator/table';
import { Validation } from '../model/decorator/validation';
import { FlxStatusEntity } from '../model/flx-status-entity';
import { Validators } from '../model/validation/validators';

// import { Mandant } from './mandant';
import { IRole } from './role.interface';

/**
 * Werte der Role-Ids in der DB (z.Zt.)
 * ACHTUNG: muss auf DB-Scripts abgestimmt sein!
 */
export enum UserRoleId {
  Admin = 1,
  User = 2,
  Guest = 3
}




/**
 * Modelliert User Rollen (Defaultimplemetierung)
 */
@Table({ name: Role.TABLE_NAME })
export class Role extends FlxStatusEntity<number> implements IRole {
  public static readonly TABLE_NAME = 'role';

  /**
   * der Key für den Zugriff über @see{AppRegistry}
   */
  public static readonly ROLE_CONFIG_KEY = 'IRole';

  private static roleIdMap: { [id: number]: boolean } = {};

  // tslint:disable-next-line:no-unused-variable
  // tslint:disable-next-line:variable-name
  private static ___initRole: boolean = (() => {
    EnumHelper.getValues(UserRoleId).map((e) => {
      Role.roleIdMap[e] = true;
    });
    return true;
  })();

  @IdColumn({ name: 'role_id', displayName: 'Id' })
  public id: number;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'role_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'role_description', displayName: 'Description' })
  public description: string;


  /**
   * prüft, ob @param{id} eine gültige Role-Id darstellt.
   */
  public static isValidRole(id: number) {
    if (!id) {
      return false;
    }
    return (id in Role.roleIdMap);
  }

}

/**
 * Role Klasse registrieren
 */
AppRegistry.instance.add<Funktion>(Role.ROLE_CONFIG_KEY, Role);