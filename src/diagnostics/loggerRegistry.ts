import { Dictionary } from '../types/dictionary';
import { Assert } from '../util/assert';
import { ILogger } from './logger.interface';


export class LoggerRegistry {
    private static loggerDict: Dictionary<string, ILogger> = new Dictionary<string, ILogger>();

    public static registerLogger(categoryName: string, logger: ILogger) {
        LoggerRegistry.loggerDict.set(categoryName, logger);
    }

    public static getLogger(categoryName: string): ILogger {
        Assert.notNullOrEmpty(categoryName);
        Assert.that(LoggerRegistry.hasLogger(categoryName));

        return LoggerRegistry.loggerDict.get(categoryName);
    }

    public static getLoggerCount(): number {
        return LoggerRegistry.loggerDict.count;
    }

    public static hasLogger(categoryName: string): boolean {
        return LoggerRegistry.loggerDict.containsKey(categoryName);
    }

    public static dump() {
        console.log(`LoggerRegistry.dump: ${LoggerRegistry.getLoggerCount()} loggers:`);
        LoggerRegistry.loggerDict.keys.forEach((key) => {
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
}