// tslint:disable:max-classes-per-file

import { Subject } from 'rxjs';


/**
 * Modelliert ein typisiertes Subjekt
 *
 * @export
 * @class CustomSubject
 * @extends {Subject<T>}
 * @template T
 */
export class CustomSubject<T> extends Subject<T> {
}


/**
 * Implementiert das klassische Publisher-Subscriber Pattern
 *
 * @export
 * @class PublisherSubscriber
 */
export class PublisherSubscriber {
  private listeners: { [key: string]: CustomSubject<any> } = {};

  /**
   * Veröffentlicht die Daten in @param{value} auf den Kanal @param{channel}
   *
   * @param {string} channel
   * @param {*} value
   *
   * @memberOf PublisherSubscriber
   */
  public publish<T>(channel: string, value: T) {
    const listener = this.listeners[channel];
    if (listener != null) {
      listener.next(value);
    }
  }

  /**
   * Registriert einen Subscriber für den Kanal @param{channel}
   *
   * @param {string} channel
   * @returns
   *
   * @memberOf PublisherSubscriber
   */
  public subscribe<T>(channel: string): CustomSubject<T> {
    let listener = this.listeners[channel];
    if (listener == null) {
      listener = new CustomSubject();
      this.listeners[channel] = listener;
    }
    return listener;
  }
}
