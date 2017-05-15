export enum Status {
  Ok,
  Error
}


/**
 * Hilfsklasse für das Ergebnis der Rest-API-Calls
 * Bei jedem Call wird auch der aktuelle Stand der EntityVersion für die Entity geliefert, damit wir in
 * EntityVersionProxy über den letzten Stand der EntityVersion Optimierungen bei den Serice-calls durchführen können.
 *
 * @export
 * @interface IServiceResult
 * @template TId
 */
export abstract class ServiceResultBase {

  /**
   * Creates an instance of ServiceResult.
   *
   * @param {number} _entityVersion - die aktuelle EntityVersion.
   *
   * @memberOf ServiceResultBase
   */
  protected constructor(private _entityVersion: number) {
  }

  public get entityVersion(): number {
    return this._entityVersion;
  }
}