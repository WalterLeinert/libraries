export class Platform {

    public static isBrowser(): boolean {
        return new Function('try {return this === window;}catch(e){return false;}')();
    }

    public static isNode(): boolean {
        return new Function('try {return this === global;}catch(e){return false;}')();
    }
}