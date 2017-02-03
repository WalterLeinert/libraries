import { IToString } from '../base/toString.interface';

export enum Status {
    Ok,
    Error
}


/**
 * Hilfsklasse für das Ergebnis einiger Rest-API-Calls (z.Zt. für Delete)
 * 
 * @export
 * @interface IServiceResult
 * @template TId
 */
export class ServiceResult<TId extends IToString> {

    /**
     * Creates an instance of ServiceResult.
     * 
     * @param {TId} id - Die Id der betroffenen Entity.
     * @param {Status} [status=Status.Ok] - Der Status (immer Ok, da sonst keine Instanz des Typs @see{IServiceResult} 
     * zurückgegeben wird)
     * 
     * @memberOf ServiceResult
     */
    constructor(public id: TId, public status: Status = Status.Ok) {
    }
}