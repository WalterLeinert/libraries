
/**
 * Helperinterface um generisch eine Instanz vom Typ {T} zu erzeugen.
 * 
 * @export
 * @interface ICtor
 * @template T
 */
export interface ICtor<T>  { 
    new (): T 
};