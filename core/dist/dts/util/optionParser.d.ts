export declare enum OptionType {
    /**
     * Standardtypes
     */
    Bool = 0,
    String = 1,
    Number = 2,
    Integer = 3,
    PositiveInteger = 4,
    Date = 5,
    ArrayOfBool = 6,
    ArrayOfString = 7,
    ArrayOfNumber = 8,
    ArrayOfInteger = 9,
    ArrayOfPositiveInteger = 10,
    ArrayOfDate = 11,
    /**
     * Custom Type
     */
    Custom = 12,
}
/**
 * Interface für reguläre Options
 */
export interface IOption {
    names: string[];
    type: OptionType | string;
    help?: string;
    env?: string;
    default?: any;
    isCustom(): boolean;
}
export declare class Option<T> implements IOption {
    names: string[];
    help: string;
    env: string;
    private static optionType2TypeMap;
    default: T;
    type: string;
    constructor(names: string[], type: OptionType | string, help?: string, env?: string, defaultValue?: T);
    isCustom(): boolean;
}
/**
 * Interface für Funktion zum Parsen von Custom-Types
 */
export interface IParseFunc {
    (option: any, optstr: string, arg: string): any;
}
/**
 * Interface für Custom-Options
 */
export interface ICustomTypeInfo {
    name: string;
    takesArg: boolean;
    helpArg: string;
    parseArg: IParseFunc;
    default: any;
}
export declare class CustomTypeInfo<T> implements ICustomTypeInfo {
    name: string;
    takesArg: boolean;
    helpArg: string;
    parseArg: IParseFunc;
    default: T;
    constructor(name: string, takesArg: boolean, helpArg: string, parseArg: IParseFunc, defaultValue: T);
}
/**
 * Standardimplementierung für Custom-Options
 */
export declare class CustomOption extends Option<any> {
    names: string[];
    private _customType;
    help: string;
    env: string;
    constructor(names: string[], _customType: ICustomTypeInfo, help?: string, env?: string, defaultValue?: any);
    readonly customType: ICustomTypeInfo;
    isCustom(): boolean;
}
/**
 * Kapselt den dashdash-Parser
 */
export declare class OptionParser {
    private options;
    private parser;
    constructor(options: IOption[]);
    parse(argv: string[]): any;
    help(includeEnv?: boolean, includeDefault?: boolean): string;
}
