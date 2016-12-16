import { Assert } from '../util/assert';

/**
 * Globale Registry für anwendungsweite Daten
 */
export class AppRegistry {
    private static _instance = new AppRegistry();

    private dataDict: { [name: string]: any } = {};

    /**
     * fügt unter dem Key @param{key} eine neue Dateninstanz @param{data} hinzu.
     * 
     * @param {string} key
     * @param {T} data
     * 
     * @memberOf AppRegistry
     */
    public add<T>(key: string, data: T) {
        Assert.notNullOrEmpty(key);
        Assert.notNull(data);

        this.dataDict[key] = data;
    }

    /**
     * liefert für den Key @param{key} die entsprechende Dateninstanz.
     * 
     * @param {string} key
     * @returns {T} Dateninstanz
     * 
     * @memberOf AppRegistry
     */
    public get<T>(key: string): T {
        Assert.notNullOrEmpty(key);
        return this.dataDict[key];
    }

    /**
     * entfernt für den Key @param{key} die entsprechende Dateninstanz.
     * 
     * @param {string} key
     * 
     * @memberOf AppRegistry
     */
    public remove<T>(key: string) {
        Assert.notNullOrEmpty(key);
        this.dataDict[key] = undefined;
    }

    /**
     * liefert true, falls unter dem Key @param{key} eine Dateninstanz registriert ist.
     * 
     * @param {string} key
     * @returns {T} Dateninstanz
     * 
     * @memberOf AppRegistry
     */
    public exists(key: string): boolean {
        Assert.notNullOrEmpty(key);
        return this.dataDict[key] !== undefined;
    }

     /**
     * Liefert die Singleton-Instanz.
     * 
     * @readonly
     * @static
     * @type {AppRegistry}
     * @memberOf AppRegistry
     */
    public static get instance(): AppRegistry {
        return AppRegistry._instance;
    }    
}