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
export declare type InstanceAccessor<T, TProperty> = ((object: T) => TProperty);
export declare type InstanceSetter<T, TProperty> = ((object: T, value: TProperty) => void);
export declare type InstanceCreator<T> = ((...args: any[]) => T);
