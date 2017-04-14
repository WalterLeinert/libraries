import { ILevel } from './level.interface';
export declare class Level implements ILevel {
    private level;
    private levelStr;
    constructor(level: number, levelStr: string);
    isGreaterThanOrEqualTo(other: string | ILevel): boolean;
    isLessThanOrEqualTo(other: string | ILevel): boolean;
    isEqualTo(other: string | ILevel): boolean;
    toString(): string;
    static toLevel(level: string | ILevel, defaultLevel?: ILevel): ILevel;
}
export declare let levels: {
    ALL: Level;
    TRACE: Level;
    DEBUG: Level;
    INFO: Level;
    WARN: Level;
    ERROR: Level;
    FATAL: Level;
    MARK: Level;
    OFF: Level;
};
