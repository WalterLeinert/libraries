import { Disposable } from '../base/disposable';
import { Assert } from '../util/assert';
import { ISuspendable } from './suspendable.interface';

/// <summary>
/// Hilfsklasse für Suspend/Resume einer <see cref="ISuspendable"/>-Instanz mit Hilfe des Using-Patterns.
/// </summary>
export class Suspender extends Disposable {
  private readonly _suspendables: ISuspendable[];

  /// <summary>
  /// Initialisiert eine neue Instanz und suspendiert alle <paramref name="suspendables"/>
  /// </summary>
  /// <param name="suspendables">Die zu suspendierenden Instanzen.</param>
  public constructor(suspendables: ISuspendable[]) {
    super();
    Assert.notNullOrEmpty(suspendables, 'suspendables');

    this._suspendables = [...suspendables];

    this._suspendables.forEach((susp) => {
      susp.suspend();
    });
  }


  protected onDispose(): void {
    try {
      const rev = this._suspendables.reverse();
      rev.forEach((susp) => {
        susp.resume();
      });
    } finally {
      super.onDispose();
    }
  }
}