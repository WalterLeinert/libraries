import { EnumHelper, Serializable } from '@fluxgate/core';

import { EntityStatus, EntityStatusHelper } from '../entity-status';

export enum FilterBehaviour {

  None,

  /**
   * alle Items hinzufügen, die den angegeben Status aufweisen
   * (z.B. alle + deleted Items)
   */
  Add,


  /**
   * nur Items liefern, die den angegeben Status aufweisen
   *  (z.B. nur archived Items)
   */
  Only,


  /**
   * alle Items hinzufügen, bis auf die, die den angegeben Status aufweisen
   * (z.B. alle Items bis auf deleted)
   */
  Exclude
}


/**
 * Filter für find- und query-Methoden, die den Entity-Status berücksichtigen
 *
 * @export
 * @class StatusFilter
 */
@Serializable()
export class StatusFilter {
  private static filterBehaviourMap = EnumHelper.getBidirectionalMap<FilterBehaviour>(FilterBehaviour);
  private static entityStatusMap = EnumHelper.getBidirectionalMap<EntityStatus>(EntityStatus);


  constructor(private _behaviour: FilterBehaviour, private _status: EntityStatus) {
  }

  public get behaviour(): FilterBehaviour {
    return this._behaviour;
  }

  public get status(): EntityStatus {
    return this._status;
  }


  /**
   * Liefert einen String bestehend aus den Enumnamen von behaviour und status.
   */
  public toString() {
    return `${StatusFilter.filterBehaviourMap.map2To1(this._behaviour)}-` +
      `${StatusFilter.entityStatusMap.map2To1(this._status)}`;
  }
}