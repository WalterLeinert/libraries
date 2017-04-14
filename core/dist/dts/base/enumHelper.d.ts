export declare class EnumHelper {
    static getNamesAndValues<T extends number>(e: any): {
        name: string;
        value: T;
    }[];
    static getNames(e: any): string[];
    static getValues<T extends number>(e: any): T[];
    private static getObjValues(e);
}
