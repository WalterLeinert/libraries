import { ISessionRequest } from './session-request.interface';

/**
 * Wrapperinterface für fluxgate-Requests, die zusätzlich zu SessionRequests
 * eine typisierte body-Property haben.
 *
 * @export
 * @interface IBodyRequest
 * @extends {Express.Request}
 */
export interface IBodyRequest<T> extends ISessionRequest {
  body: T;
}