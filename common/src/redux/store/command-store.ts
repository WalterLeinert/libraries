// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, CustomSubject, Dictionary, PublisherSubscriber } from '@fluxgate/core';

import { ICommand } from '../command/command.interface';
import { IServiceState } from '../state/service-state.interface';


/**
 * Realisiert einen CommandStore, der
 * - einen speziellen Status hält
 * - Kommandos dispatched
 * - eine Subscription für Statusupdates ermöglicht.
 *
 * @export
 * @class CommandStore
 * @template T
 */
export class CommandStore<TState extends IServiceState> {
  protected static readonly logger = getLogger(CommandStore);

  private _channel: string;
  private pubSub: PublisherSubscriber = new PublisherSubscriber();
  private state: TState;
  private _children: Dictionary<string, CommandStore<any>> = new Dictionary<string, CommandStore<any>>();

  constructor(private _name: string, initialState: TState, private _parent?: CommandStore<TState>) {
    using(new XLog(CommandStore.logger, levels.INFO, 'ctor'), (log) => {
      this.state = initialState;
      this._channel = '$$' + _name + '$$';
      log.log(`name = ${this._name}, initialState = ${JSON.stringify(initialState)}`);
    });
  }

  /**
   * Liefert den Storenamen
   *
   * @readonly
   * @type {string}
   * @memberOf CommandStore
   */
  public get name(): string {
    return this._name;
  }

  public get parent(): CommandStore<TState> {
    return this._parent;
  }

  public get children(): Array<CommandStore<TState>> {
    return this._children.values;
  }

  public addChild(child: CommandStore<TState>) {
    Assert.notNull(child);
    this._children.set(child.name, child);
  }

  public containsChild(storeId: string): boolean {
    Assert.notNullOrEmpty(storeId);
    return this._children.containsKey(storeId);
  }

  public getChild(storeId: string): CommandStore<TState> {
    Assert.notNullOrEmpty(storeId);
    return this._children.get(storeId);
  }


  /**
   * Liefert den Status
   *
   * @returns {T}
   *
   * @memberOf CommandStore
   */
  public getState(): TState {
    return this.state;
  }

  /**
   * Für ein Dispatch des Kommandos @param{command} aus -> Kommandoausführung, Statusupdate
   *
   * @param {ICommand<any>} command
   *
   * @memberOf CommandStore
   */
  public dispatch(command: ICommand<TState>) {
    using(new XLog(CommandStore.logger, levels.INFO, 'dispatch'), (log) => {
      log.log(`command = ${command.constructor.name}: ${JSON.stringify(command)}`);


      this.state = command.execute(this.state);

      // rekursiv an alle Children dispatchen
      for (const child of this.children) {
        child.dispatch(command);
      }

      this.pubSub.publish(this._channel, command);
    });
  }

  /**
   * Liefert ein Subject für eine folgende Subscription.
   *
   * @returns {CustomSubject<any>}
   *
   * @memberOf CommandStore
   */
  public subject(): CustomSubject<any> {
    return this.pubSub.subscribe(this._channel);
  }
}