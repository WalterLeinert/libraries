import { ICtor } from './ctor';

/**
 * Hilfsklasse zum Erzeugen von Instanzen 
 */
export class Activator {

    /**
     * Liefert eine neue Instanz vom Type @param{type}
     * 
     * @param{any[]} [args] - Constructor-Argumente
     */
    public static createInstance<T>(type: ICtor<T>, ...args: any[]): T {
        return new type(...args);
    }
}