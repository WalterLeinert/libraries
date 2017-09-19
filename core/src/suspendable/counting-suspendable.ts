import { Suspendable } from './suspendable';

/// <summary>
/// Suspendable, welches mit einem Zähler arbeitet. Dieser kann verschachtelt aufgerufen werden.
/// <see cref="ISuspendable.Suspend"/> inkrementiert und <see cref="ISuspendable.Resume"/> dekrementiert den Zähler.
/// Falls <see cref="ISuspendable.CanBeResumed"/> <c>true</c> ist, kann erfolgt das eigentliche Resume einer Aktion.
/// </summary>

export class CountingSuspendable extends Suspendable {
  private _counter: number = 0;

  public constructor(private increment: number = 1) {
    super();
  }

  public suspend(): void {
    this._counter += this.increment;
  }

  public resume(): void {
    this._counter -= this.increment;
  }

  public get isSuspended(): boolean {
    return this._counter > 0;
  }

  public get canBeResumed(): boolean {
    return this._counter <= 0;
  }

  public get counter(): number {
    return this._counter;
  }
}
