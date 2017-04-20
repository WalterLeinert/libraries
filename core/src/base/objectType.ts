import { ICtor } from './ctor';

export abstract class Funktion {
  public readonly name: string;
  public abstract call(...args: any[]): any;
}

/**
 * Object vom Typ T (mit Constructor) oder @see{Function}
 */
export type ObjectType<T> = ICtor<T> | Funktion;