import { AppRegistry, EnumHelper } from '../base';

import { Column, IRole, Table } from '.';


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
@Table({ name: 'role' })
export class Role implements IRole {

  /**
   * der Key für den Zugriff über @see{AppRegistry}
   */
  public static readonly ROLE_CONFIG_KEY = 'IRole';

  private static roleIdMap: { [id: number]: boolean } = {};
  // tslint:disable-next-line:no-unused-variable
  private static ___initRole: boolean = Role.initialize();


  @Column({ name: 'role_id', primary: true, generated: true, displayName: 'Id' })
  public id: number;

  @Column({ name: 'role_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'role_description', displayName: 'Description' })
  public description: string;

  private static initialize(): boolean {
    EnumHelper.getValues(UserRoleId).map((e) => {
      Role.roleIdMap[e] = true;
    });
    return true;
  }

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
AppRegistry.instance.add<Function>(Role.ROLE_CONFIG_KEY, Role);