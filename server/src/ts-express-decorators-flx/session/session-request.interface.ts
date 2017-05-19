import * as Express from 'express';

import { IUser } from '@fluxgate/common';

/**
 * Wrapperinterface für fluxgate-Requests, die über passport den aktuellen user enthalten
 *
 * @export
 * @interface ISessionRequest
 * @extends {Express.Request}
 */
export interface ISessionRequest extends Express.Request {
  user: IUser;
}