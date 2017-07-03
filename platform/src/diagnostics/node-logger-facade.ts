import { Funktion } from '@fluxgate/core';
import { IConfig, ILogger, Logger, LoggerRegistry, Types } from '@fluxgate/core';

import { JsonReader } from '../util/jsonReader';
import { LoggerFacade } from './logger-facade';


// removeIf(browser)

// tslint:disable-next-line:no-var-requires
const log4js = require('log4js');

export class NodeLoggerFacade extends LoggerFacade {

  public getLogger(category: string | Funktion): ILogger {
    const categoryName = this.getCategoryName(category);

    let logger: ILogger;
    if (!this.isRegisteredLogger(categoryName)) {
      logger = new Logger(log4js.getLogger(categoryName));
      this.registerLogger(categoryName, logger);
    } else {
      logger = this.getRegisteredLogger(categoryName);
    }

    return logger;
  }

  public configure(config: string | IConfig, options?: any): void {

    log4js.configure(config, options);

    if (Types.isString(config)) {
      const conf = JsonReader.readJsonSync<IConfig>(config as string);
      LoggerRegistry.configure(conf as IConfig, options);
    } else {
      LoggerRegistry.configure(config as IConfig, options);
    }
  }

  protected registerLogger(categoryName: string, logger: ILogger) {
    LoggerRegistry.registerLogger(categoryName, logger);
  }
}
// endRemoveIf(browser)