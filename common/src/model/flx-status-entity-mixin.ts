import { Column } from '../model/decorator/column';
import { IdColumn } from '../model/decorator/id-column';
import { StatusColumn } from '../model/decorator/status-column';
import { Table } from '../model/decorator/table';
import { EntityStatus, EntityStatusHelper } from './entity-status';
import { FlxEntity } from './flx-entity';
import { IFlxEntity } from './flx-entity.interface';
import { IStatusEntity } from './status-entity.interface';


export abstract class Status {
  @Column({ name: '__status', hidden: true })
  // tslint:disable-next-line:variable-name
  public __status: number;


  protected getStatus(status: EntityStatus): boolean {
    return EntityStatusHelper.hasFlag(this.__status, status);
  }

  protected setStatus(status: EntityStatus, value: boolean) {
    this.__status = EntityStatusHelper.setFlag(this.__status, status, value);
  }
}


// tslint:disable-next-line:max-classes-per-file
export class Archived extends Status {

  @StatusColumn(EntityStatus.Archived)
  public get __archived(): boolean {
    return this.getStatus(EntityStatus.Archived);
  }

  public set __archived(value: boolean) {
    this.setStatus(EntityStatus.Archived, value);
  }
}


// tslint:disable-next-line:max-classes-per-file
export class Deleted extends Status {

  @StatusColumn(EntityStatus.Deleted)
  public get __deleted(): boolean {
    return this.getStatus(EntityStatus.Deleted);
  }

  public set __deleted(value: boolean) {
    this.setStatus(EntityStatus.Deleted, value);
  }

}

interface IStatusTest extends IFlxEntity<number>, Deleted, Archived {
  //
}


/**
 * Abstrakte Basisklasse für alle versionierten Entities, die mandantenfähig sind.
 *
 * @export
 * @abstract
 * @class FlxEntity
 * @extends {VersionedEntity<TId>}
 * @implements {IClientEntity}
 * @template TId
 */
// tslint:disable-next-line:max-classes-per-file
@Table()
export class FlxStatusEntity<TId> extends FlxEntity<number> implements IStatusEntity {
  @IdColumn({ name: 'user_id', displayName: 'Id' })
  public id: number;

  @Column({ name: '__status', hidden: true })
  // tslint:disable-next-line:variable-name
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

  protected getStatus(status: EntityStatus): boolean {
    return EntityStatusHelper.hasFlag(this.__status, status);
  }

  protected setStatus(status: EntityStatus, value: boolean) {
    this.__status = EntityStatusHelper.setFlag(this.__status, status, value);
  }
}

