export class Reflection {

    /**
     * Copies all properties of a source instance to a new instance of type T.
     * 
     * @static
     * @template T - destination type
     * @param {*} source - source instance
     * @param {{ new (): T }} dest - destination instance type
     * @returns {T} - new destination instance with properties copied from source.
     * 
     * @memberOf Reflection
     */
    static copyProperties<T>(source: any, dest: { new (): T }): T {
        let instance = new dest();

        // alle Properties der Row über Reflection ermitteln        
        let refl = Reflect.ownKeys(source);

        // ... und dann die Werte der Zielentity zuweisen
        for (let propName of refl) {
            instance[propName] = source[propName];
        }

        return instance;
    }

}