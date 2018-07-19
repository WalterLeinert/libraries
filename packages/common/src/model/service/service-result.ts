import { Serializable } from '@fluxgate/core';

/**
 * Hilfsklasse für das Ergebnis der Rest-API-Calls
 * Bei jedem Call wird auch der aktuelle Stand der EntityVersion für die Entity geliefert, damit wir in
 * EntityVersionProxy über den letzten Stand der EntityVersion Optimierungen bei den Serice-calls durchführen können.
 *
 * @export
 * @class ServiceResult
 * @template TId
 */

@Serializable()
export abstract class ServiceResult {
  private _fromCache: boolean = false;

  /**
   * Creates an instance of ServiceResult.
   *
   * @param {number} _entityVersion - die aktuelle EntityVersion.
   *
   * @memberOf ServiceResult
   */
  protected constructor(private _entityVersion: number) {
  }

  public get entityVersion(): number {
    return this._entityVersion;
  }


  /**
   * Liefert true, falls das Result aus dem Cache kam (nur für Unittests)
   */
  public get __fromCache(): boolean {
    return this._fromCache;
  }

  /**
   * Setzt das Flag fromCache auf den Wert @param{value} (nur für Unittests)
   */
  public __setFromCache(value: boolean = true) {
    this._fromCache = value;
  }

  public toString(): string {
    return `entityVersion: ${this._entityVersion}`;
  }
}