import { AppRegistry } from '../base/appRegistry';
import { EnumHelper } from '../base/enumHelper';
import { Funktion } from '../base/objectType';
import { Column } from '../model/decorator/model/column';
import { Table } from '../model/decorator/model/table';
import { Validation } from '../model/decorator/model/validation';
import { Validators } from '../model/validation/validators';

// import { Mandant } from './mandant';
import { IRole } from './role.interface';
import { IVersionedEntity } from './versioned-entity.interface';

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
export class Role implements IRole, IVersionedEntity {
  public static readonly TABLE_NAME = 'role';

  /**
   * der Key für den Zugriff über @see{AppRegistry}
   */
  public static readonly ROLE_CONFIG_KEY = 'IRole';

  private static roleIdMap: { [id: number]: boolean } = {};

  // tslint:disable-next-line:no-unused-variable
  private static ___initRole: boolean = (() => {
    EnumHelper.getValues(UserRoleId).map((e) => {
      Role.roleIdMap[e] = true;
    });
    return true;
  })();

  @Column({ name: 'role_id', primary: true, generated: true, displayName: 'Id' })
  public id: number;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'role_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'role_description', displayName: 'Description' })
  public description: string;

  @Column({ name: 'deleted' })
  public deleted?: boolean;

  @Validation([
    Validators.required
  ])
  @Column({ name: 'id_mandant' })
  public id_mandant?: number;   // = Mandant.FIRST_ID;

  @Column({ name: 'role_version', displayName: 'Version' })
  public __version: number;


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