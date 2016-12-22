import { ICtor } from './ctor';

/**
 * Hilfsklasse zum Erzeugen von Instanzen 
 */
export class Activator {

    /**
     * Liefert eine neue Instanz vom Type @param{type}
     */
    public static createInstance<T>(type: ICtor<T>): T {
        return new type();
    }
}