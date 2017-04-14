import { Subject } from 'rxjs/Subject';
/**
 * Modelliert ein typisiertes Subjekt
 *
 * @export
 * @class CustomSubject
 * @extends {Subject<T>}
 * @template T
 */
export declare class CustomSubject<T> extends Subject<T> {
}
/**
 * Implementiert das klassische Publisher-Subscriber Pattern
 *
 * @export
 * @class PublisherSubscriber
 */
export declare class PublisherSubscriber {
    private listeners;
    /**
     * Veröffentlicht die Daten in @param{value} auf den Kanal @param{channel}
     *
     * @param {string} channel
     * @param {*} value
     *
     * @memberOf PublisherSubscriber
     */
    publish<T>(channel: string, value: T): void;
    /**
     * Registriert einen Subscriber für den Kanal @param{channel}
     *
     * @param {string} channel
     * @returns
     *
     * @memberOf PublisherSubscriber
     */
    subscribe<T>(channel: string): CustomSubject<T>;
}
