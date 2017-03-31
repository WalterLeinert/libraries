// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { CustomSubject, PublisherSubscriber } from '@fluxgate/common';

import { ICommand } from './command.interface';


export class CommandStore<T> {
  protected static readonly logger = getLogger(CommandStore);



  private _channel: string;
  private pubSub: PublisherSubscriber = new PublisherSubscriber();
  private state: T;

  constructor(private _name: string, initialState: T) {
    using(new XLog(CommandStore.logger, levels.INFO, 'ctor'), (log) => {
      this.state = initialState;
      this._channel = '$$' + _name + '$$';
      log.log(`name = ${this._name}, initialState = ${JSON.stringify(initialState)}`);
    });
  }

  public get name(): string {
    return this._name;
  }

  public getState(): T {
    return this.state;
  }


  public dispatch(command: ICommand<any>) {
    using(new XLog(CommandStore.logger, levels.INFO, 'dispatch'), (log) => {
      this.state = command.execute(this.state);
      this.pubSub.publish(this._channel, command);
    });
  }


  public subject(): CustomSubject<any> {
    return this.pubSub.subscribe(this._channel);
  }
}