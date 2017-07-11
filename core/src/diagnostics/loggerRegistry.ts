import { Assertion } from '../base/assertion';
import { Dictionary } from '../types/dictionary';

import { IConfig } from './config.interface';
import { levels } from './level';
import { Level } from './level';
import { ILevel } from './level.interface';
import { ILogger } from './logger.interface';


export class LoggerRegistry {
  private static loggerDict: Dictionary<string, ILogger> = new Dictionary<string, ILogger>();

  private static _config: IConfig;
  private static defaultLevel: ILevel = levels.WARN;


  /**
   * Konfiguriert das Logging
   *
   * @static
   * @param {IConfig} config
   * @param {*} [options]
   *
   * @memberOf LoggerRegistry
   */
  public static configure(config: IConfig, options?: any): void {
    LoggerRegistry.registerConfiguration(config);
  }


  private static registerConfiguration(config: IConfig) {
    Assertion.notNull(config);
    LoggerRegistry._config = config;

    const level = LoggerRegistry._config.levels['[all]'];
    if (level) {
      LoggerRegistry.defaultLevel = Level.toLevel(level);
    }

    LoggerRegistry.applyConfiguration(config);
  }

  public static registerLogger(categoryName: string, logger: ILogger) {
    if (LoggerRegistry._config) {
      LoggerRegistry.applyConfigurationToLogger(LoggerRegistry._config, logger);
    } else {
      logger.setLevel(LoggerRegistry.defaultLevel);
    }

    LoggerRegistry.loggerDict.set(categoryName, logger);
  }

  public static getLogger(categoryName: string): ILogger {
    Assertion.notNullOrEmpty(categoryName);
    Assertion.that(LoggerRegistry.hasLogger(categoryName));

    const logger = LoggerRegistry.loggerDict.get(categoryName);
    logger.setLevel(LoggerRegistry.defaultLevel);

    if (LoggerRegistry._config) {
      const level = LoggerRegistry._config.levels[categoryName];
      if (level) {
        logger.setLevel(level);
      }
    }

    return logger;
  }

  public static getLoggerCount(): number {
    return LoggerRegistry.loggerDict.count;
  }

  public static hasLogger(categoryName: string): boolean {
    return LoggerRegistry.loggerDict.containsKey(categoryName);
  }

  public static dump() {
    // tslint:disable-next-line:no-console
    console.log(`LoggerRegistry.dump: ${LoggerRegistry.getLoggerCount()} loggers:`);
    LoggerRegistry.loggerDict.keys.forEach((key) => {
      // tslint:disable-next-line:no-console
      console.log(`  ${key}`);
    });
  }

  public static forEachLogger(callbackfn: (value: ILogger, index: number, array: ILogger[]) => void, thisArg?: any):
    void {
    const loggers = LoggerRegistry.loggerDict.values;

    for (let i = 0; i < loggers.length; i++) {
      callbackfn(loggers[i], i, loggers);
    }
  }

  private static applyConfiguration(config: IConfig) {
    LoggerRegistry.forEachLogger((logger) => {
      LoggerRegistry.applyConfigurationToLogger(config, logger);
    });
  }


  private static applyConfigurationToLogger(config: IConfig, logger: ILogger) {
    const catLevel = LoggerRegistry._config.levels[logger.category];
    if (catLevel) {
      logger.setLevel(Level.toLevel(catLevel));
    } else {
      logger.setLevel(LoggerRegistry.defaultLevel);
    }
  }
}