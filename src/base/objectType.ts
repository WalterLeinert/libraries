import { ICtor } from './ctor';

/**
 * Object vom Typ T (mit Constructor) oder @see{Function}
 */
export type ObjectType<T> = ICtor<T> | Function;