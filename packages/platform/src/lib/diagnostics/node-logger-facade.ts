// removeIf(browser)
import { getLogger } from 'log4js';

import { Funktion } from '@fluxgate/core';
import { IConfig, ILogger, LoggerRegistry, Types } from '@fluxgate/core';

import * as fs from 'fs';
import { LoggerFacade } from './logger-facade';
import { NodeLogger } from './node-logger';



export class NodeLoggerFacade extends LoggerFacade {

  public getLogger(category: string | Funktion): ILogger {
    const categoryName = this.getCategoryName(category);

    let logger: ILogger;
    if (!this.isRegisteredLogger(categoryName)) {
      logger = new NodeLogger(getLogger(categoryName), categoryName);
      this.registerLogger(categoryName, logger);
    } else {
      logger = this.getRegisteredLogger(categoryName);
    }

    return logger;
  }

  public configure(config: string | IConfig): void {

    // configure(config, options);

    if (Types.isString(config)) {
      const confContents = fs.readFileSync(config as string, 'utf8');
      const conf = JSON.parse(confContents);
      LoggerRegistry.configure(conf as IConfig);
    } else {
      LoggerRegistry.configure(config as IConfig);
    }
  }

  protected registerLogger(categoryName: string, logger: ILogger) {
    LoggerRegistry.registerLogger(categoryName, logger);
  }
}
// endRemoveIf(browser)