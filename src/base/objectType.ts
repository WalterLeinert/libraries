import { ICtor } from './ctor';

/**
 * Object vom Typ T (mit Contructor) oder @see{Function}
 */
export type ObjectType<T> = ICtor<T> | Function;