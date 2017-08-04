import { Column } from '../model/decorator/column';
import { StatusColumn } from '../model/decorator/status-column';
import { Table } from '../model/decorator/table';
import { EntityStatus, EntityStatusHelper } from './entity-status';
import { FlxEntity } from './flx-entity';
import { IStatusEntity } from './status-entity.interface';


/**
 * Abstrakte Basisklasse für alle Entities, die zusätzlich verschiedene Stati haben können
 *
 * @export
 * @abstract
 * @class FlxStatusEntity
 * @extends {FlxEntity<TId>}
 * @implements {IStatusEntity}
 * @template TId
 */
@Table({ isAbstract: true })
export abstract class FlxStatusEntity<TId> extends FlxEntity<TId> implements IStatusEntity {

  @Column({ name: EntityStatusHelper.PROPERTY_NAME_STATUS, hidden: true })
  public __status: number;

  @StatusColumn(EntityStatus.Deleted)
  public get __deleted(): boolean {
    return this.getStatus(EntityStatus.Deleted);
  }

  public set __deleted(value: boolean) {
    this.setStatus(EntityStatus.Deleted, value);
  }


  @StatusColumn(EntityStatus.Archived)
  public get __archived(): boolean {
    return this.getStatus(EntityStatus.Archived);
  }

  public set __archived(value: boolean) {
    this.setStatus(EntityStatus.Archived, value);
  }


  public getStatus(status: EntityStatus): boolean {
    return EntityStatusHelper.hasFlag(this.__status, status);
  }

  public setStatus(status: EntityStatus, value: boolean) {
    this.__status = EntityStatusHelper.setFlag(this.__status, status, value);
  }
}