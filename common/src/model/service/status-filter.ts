import { Serializable } from '@fluxgate/core';

import { EntityStatus } from '../entity-status';

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

  constructor(private _behaviour: FilterBehaviour, private _status: EntityStatus) {
  }

  public get behaviour(): FilterBehaviour {
    return this._behaviour;
  }

  public get status(): EntityStatus {
    return this._status;
  }
}