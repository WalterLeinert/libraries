import { ICtor } from './ctor';
/**
 * Hilfsklasse zum Erzeugen von Instanzen
 */
export declare class Activator {
    /**
     * Liefert eine neue Instanz vom Type @param{type}
     *
     * @param{any[]} [args] - Constructor-Argumente
     */
    static createInstance<T>(type: ICtor<T>, ...args: any[]): T;
}
