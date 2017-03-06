import { ICtor } from './ctor';

export class Funktion {
  public readonly name: string;
}

/**
 * Object vom Typ T (mit Constructor) oder @see{Function}
 */
export type ObjectType<T> = ICtor<T> | Funktion;