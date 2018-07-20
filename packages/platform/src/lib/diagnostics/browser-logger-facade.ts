import { Funktion, NotSupportedException } from '@fluxgate/core';
import { getLogger as getConsoleLogger, IConfig, ILogger, LoggerRegistry, Types } from '@fluxgate/core';

import { LoggerFacade } from './logger-facade';


// removeIf(node)
export class BrowserLoggerFacade extends LoggerFacade {

  public getLogger(category: string | Funktion): ILogger {
    const categoryName = this.getCategoryName(category);

    let logger: ILogger;
    if (!this.isRegisteredLogger(categoryName)) {
      logger = getConsoleLogger(category);
    } else {
      logger = this.getRegisteredLogger(categoryName);
    }

    return logger;
  }


  public configure(config: string | IConfig): void {
    if (Types.isString(config)) {
      throw new NotSupportedException('only supported on node platforms');
    }
    LoggerRegistry.configure(config as IConfig);
  }
}
// endRemoveIf(node)