import { Disposable } from '../base/disposable';
import { ISuspendable } from './suspendable.interface';

/// <summary>
/// Abstrakte Basisklasse für suspendierbare Aktionen.
/// </summary>
export abstract class Suspendable extends Disposable implements ISuspendable {
  protected constructor() {
    super();
  }

  public suspend(): void {
    // ok
  }

  public resume() {
    // ok
  }

  public get isSuspended(): boolean {
    return false;
  }

  public get canBeResumed(): boolean {
    return true;
  }
}