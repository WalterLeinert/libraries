import { ICtor } from './ctor';
export declare abstract class Funktion {
    readonly name: string;
    abstract call(...args: any[]): any;
}
/**
 * Object vom Typ T (mit Constructor) oder @see{Function}
 */
export declare type ObjectType<T> = ICtor<T> | Funktion;
