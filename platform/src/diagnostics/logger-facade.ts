import { Funktion } from '@fluxgate/core';
import { IConfig, ILogger, LoggerRegistry, Types } from '@fluxgate/core';


// tslint:disable-next-line:max-classes-per-file
export abstract class LoggerFacade {
  public abstract getLogger(category: string | Funktion): ILogger;
  public abstract configure(config: string | IConfig, options?: any): void;

  protected getCategoryName(category: string | Funktion) {
    let categoryName: string;
    if (Types.isString(category)) {
      categoryName = category as string;
    } else {
      categoryName = (category as Funktion).name;
    }

    return categoryName;
  }

  protected isRegisteredLogger(categoryName: string): boolean {
    return LoggerRegistry.hasLogger(categoryName);
  }

  protected registerLogger(categoryName: string, logger: ILogger) {
    // ok
  }

  protected getRegisteredLogger(categoryName: string): ILogger {
    return LoggerRegistry.getLogger(categoryName);
  }
}
