import { Suspendable } from './suspendable';

/// <summary>
/// Suspendable, welches mit einem Zähler arbeitet. Dieser kann verschachtelt aufgerufen werden.
/// <see cref="ISuspendable.Suspend"/> inkrementiert und <see cref="ISuspendable.Resume"/> dekrementiert den Zähler.
/// Falls <see cref="ISuspendable.CanBeResumed"/> <c>true</c> ist, kann erfolgt das eigentliche Resume einer Aktion.
/// </summary>

export class CountingSuspendable extends Suspendable {
  private m_counter: number = 0;

  public constructor(private increment: number = 1) {
    super();
  }

  public suspend(): void {
    this.m_counter += this.increment;
  }

  public resume(): void {
    this.m_counter -= this.increment;
  }

  public get isSuspended(): boolean {
    return this.m_counter > 0;
  }

  public get canBeResumed(): boolean {
    return this.m_counter <= 0;
  }

  public get Counter(): number {
    return this.m_counter;
  }
}
