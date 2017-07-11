// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { Injectable, InjectionToken } from 'injection-js';

export const LOGGER = new InjectionToken<ILogger>('core-test-logger');

export interface ILogger {
  log(message: string);
}

@Injectable()
export class Logger implements ILogger {
  public log(message: string) {
    //
  }
}

@Injectable()
export class ConsoleLogger extends Logger {
  public log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(message);
  }
}

@Injectable()
export class DateLogger extends Logger {
  public log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(new Date() + ': ' + message);
  }
}
