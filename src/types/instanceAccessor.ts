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