import { IServiceCrud } from '@fluxgate/common';

import { IServiceBase } from './serviceBase.interface';

/**
 * Interface für alle Services
 */
// tslint:disable-next-line:no-empty-interface
export interface IService extends IServiceCrud, IServiceBase {
}