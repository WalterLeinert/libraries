import { Types } from '../types/types';
import { ILevel } from './level.interface';

/**
 * Level-Implementierung kompatibel zu log4js
 *
 * @export
 * @class Level
 * @implements {ILevel}
 */
export class Level implements ILevel {

  public constructor(private level: number, private levelStr: string) {
  }


  public isGreaterThanOrEqualTo(other: string | ILevel): boolean {
    if (Types.isString(other)) {
      other = Level.toLevel(other as string);
    }
    return this.level >= (other as Level).level;
  }

  public isLessThanOrEqualTo(other: string | ILevel): boolean {
    if (Types.isString(other)) {
      other = Level.toLevel(other as string);
    }
    return this.level <= (other as Level).level;
  }

  public isEqualTo(other: string | ILevel): boolean {
    if (Types.isString(other)) {
      other = Level.toLevel(other as string);
    }
    return this.level === (other as Level).level;
  }

  public toString(): string {
    return this.levelStr;
  }

  public static toLevel(level: string | ILevel, defaultLevel?: ILevel): ILevel {
    if (Types.isUndefined(level)) {
      return defaultLevel;
    }

    if (level instanceof Level) {
      return level;
    }

    if (Types.isString(level)) {
      return levels[(level as string).toUpperCase()] || defaultLevel;
    }

    return Level.toLevel(level.toString());
  }
}

export let levels = {
  ALL: new Level(Number.MIN_VALUE, 'ALL'),
  TRACE: new Level(5000, 'TRACE'),
  DEBUG: new Level(10000, 'DEBUG'),
  INFO: new Level(20000, 'INFO'),
  WARN: new Level(30000, 'WARN'),
  ERROR: new Level(40000, 'ERROR'),
  FATAL: new Level(50000, 'FATAL'),
  MARK: new Level(9007199254740992, 'MARK'), // 2^53
  OFF: new Level(Number.MAX_VALUE, 'OFF')
};
