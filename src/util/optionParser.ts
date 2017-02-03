// tslint:disable:max-classes-per-file

import dashdash = require('dashdash');
import { format } from 'util';

export enum OptionType {
    /**
     * Standardtypes
     */
    Bool,
    String,
    Number,
    Integer,
    PositiveInteger,
    // (epoch seconds, e.g. 1396031701, or ISO 8601 format YYYY-MM-DD[THH:MM:SS[.sss][Z]], 
    // e.g. "2014-03-28T18:35:01.489Z")
    Date,
    ArrayOfBool,
    ArrayOfString,
    ArrayOfNumber,
    ArrayOfInteger,
    ArrayOfPositiveInteger,
    ArrayOfDate,

    /**
     * Custom Type
     */
    Custom
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


export class Option<T> implements IOption {

    private static optionType2TypeMap = {
        [OptionType.Bool]: 'bool',
        [OptionType.String]: 'string',
        [OptionType.Number]: 'number',
        [OptionType.Integer]: 'integer',
        [OptionType.PositiveInteger]: 'positiveInteger',
        [OptionType.Date]: 'date',
        [OptionType.ArrayOfBool]: 'arrayOfBool',
        [OptionType.ArrayOfString]: 'arrayOfString',
        [OptionType.ArrayOfNumber]: 'arrayOfNumber',
        [OptionType.ArrayOfInteger]: 'arrayOfInteger',
        [OptionType.ArrayOfPositiveInteger]: 'arrayOfPositiveInteger',
        [OptionType.ArrayOfDate]: 'arrayOfDate',
    };

    public default: T;
    public type: string;


    constructor(
        public names: string[],
        type: OptionType | string,
        public help?: string,
        public env?: string,
        defaultValue?: T) {

        this.type = '';

        if (typeof type === 'number' /*OptionType*/) {
            const stringType = Option.optionType2TypeMap[type as number];
            if (!stringType) {
                throw new Error(format('no dashtash type for optionType "%s"', type));
            }
            this.type = stringType;
        } else if (typeof type === 'string') {
            this.type = type;
        }

        this.default = defaultValue;
    }

    public isCustom(): boolean {
        return false;
    }
}



/**
 * Interface für Funktion zum Parsen von Custom-Types 
 */
// tslint:disable-next-line:callable-types
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


export class CustomTypeInfo<T> implements ICustomTypeInfo {
    public default: T;

    constructor(public name: string, public takesArg: boolean, public helpArg: string,
        public parseArg: IParseFunc, defaultValue: T) {
        this.default = defaultValue;
    }
}

/**
 * Standardimplementierung für Custom-Options
 */
export class CustomOption extends Option<any> {

    constructor(
        public names: string[],
        private _customType: ICustomTypeInfo,
        public help?: string,
        public env?: string,
        defaultValue?: any) {
        super(names, _customType.name, help, env, defaultValue);
    }

    public get customType(): ICustomTypeInfo {
        return this._customType;
    }

    public isCustom(): boolean {
        return true;
    }
}


/**
 * Kapselt den dashdash-Parser
 */
export class OptionParser {
    private parser: any;

    constructor(private options: IOption[]) {
        const customOptionTypes = new Array<ICustomTypeInfo>();

        for (const option of options) {
            if (option.isCustom()) {
                const copt = option as CustomOption;
                customOptionTypes.push(copt.customType);
            }
        }


        if (customOptionTypes && customOptionTypes.length > 0) {
            for (const ot of customOptionTypes) {
                dashdash.addOptionType(ot);
            }
        }
        this.parser = dashdash.createParser({ options: this.options });
    }

    public parse(argv: string[]): any {
        return this.parser.parse({ options: this.options });
    }

    public help(includeEnv = true, includeDefault = true): string {
        return this.parser.help(
            { includeEnv, includeDefault }
        ).trimRight();
    }
}