import { ICtor } from './ctor';

export abstract class Funktion {
  public readonly name: string;
  public abstract call(...args: any[]): any;
}

/**
 * Object vom Typ T (mit Constructor) oder @see{Function}
 */
export type ObjectType<T> = ICtor<T> | Funktion;

/**
 * Signatur eines Promise-Executors mit resolve und reject.
 */
export type PromiseExecutor<T> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;