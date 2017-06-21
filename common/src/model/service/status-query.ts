import { IQuery, Query, Serializable } from '@fluxgate/core';

import { StatusFilter } from './status-filter';

export interface IStatusQuery extends IQuery {
  filter?: StatusFilter;
}

/**
 * Erweitert eine Query umd einen optionalen Statusfilter
 *
 * @export
 * @class StatusFilter
 */
@Serializable()
export class StatusQuery extends Query implements IStatusQuery {
  public status: StatusFilter;
}