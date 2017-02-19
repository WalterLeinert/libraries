import { ICtor } from '../base/ctor';

/**
 * Typdeklaration, die den Zugriff auf Objektproperties über eine Lambdaexpression erlaubt.
 * 
 * Beispiel:
 * 
 * class Test {
 *  name: string
 * }
 * 
 * let accessor: PropertyAccessor<Test, string> = (test) => test.name;
 */
export type InstanceAccessor<T, TProperty> = ((object: T) => TProperty);
export type InstanceSetter<T, TProperty> = ((object: T, value: TProperty) => void);
export type InstanceCreator<T> = ((...args: any[]) => T);