import { IRole, Table, Column } from '.';

/**
 * Modelliert User Rollen
 */
@Table({ name: 'role' })
export class Role implements IRole {

  @Column({ name: 'role_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'role_name' })
  public name: string;

  @Column({ name: 'role_description' })
  public description: string;
}