import { OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Message } from 'primeng/primeng';


// Fluxgate
import { Assert } from '@fluxgate/common';


/**
 * Basisklasse (Komponente) ohne Router, Service für alle GUI-Komponenten
 * 
 * @export
 * @class CoreComponent
 * @implements {OnInit, OnDestroy}
 */
export abstract class CoreComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private _messages: Message[] = [];


  /**
   * Init-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   * 
   * @memberOf BaseComponent
   */
  public ngOnInit() {
    this.clearMessages();
  }


  /**
   * Destroy-Methode der Komponente: kann in konkreter Komponente überschrieben werden
   * 
   * @memberOf BaseComponent
   */
  public ngOnDestroy() {
    // rxjs Subscriptions freigeben
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * Liefert die aktuellen Meldungen
   */
  public get messages(): Message[] {
    return this._messages;
  }

  /**
   * löscht alle Messages
   * 
   * @protected
   * 
   * @memberOf BaseComponent
   */
  protected clearMessages() {
    this._messages = [];
  }

  /**
   * fügt eine neue Info-Meldungung hinzu
   * 
   * @protected
   * @param {string} text
   * @param {string} [summary='Hinweis']
   * 
   * @memberOf BaseComponent
   */
  protected addInfoMessage(text: string, summary = 'Hinweis') {
    this.addMessage({ severity: 'info', summary: summary, detail: text });
  }

  /**
   * fügt eine neue Fehlermeldungung hinzu
   * 
   * @protected
   * @param {string} text
   * @param {string} [summary='Fehlermeldung']
   * 
   * @memberOf BaseComponent
   */
  protected addErrorMessage(text: string, summary = 'Fehlermeldung') {
    this.addMessage({ severity: 'error', summary: summary, detail: text });
  }

  /**
   * fügt eine neue Meldung hinzu
   * 
   * @protected
   * @param {Message} message
   * 
   * @memberOf BaseComponent
   */
  protected addMessage(message: Message) {
    let doAddMessage = true;
    this._messages.forEach((msg) => {
      if (msg.detail === message.detail && msg.severity === message.severity && msg.summary === message.summary) {
        doAddMessage = false;
        return;
      }
    });

    if (doAddMessage) {
      this._messages.push(message);
    }
  }

  /**
   * Behandelt eine Fehlermeldung
   * 
   * @protected
   * @param {Error} error
   * @param {string} [summary='Fehlermeldung']
   * 
   * @memberOf BaseComponent
   */
  protected handleError(error: Error, summary = 'Fehlermeldung') {
    this.addErrorMessage(error.message, summary);
  }

  /**
   * Behandelt einen Hinweis
   * 
   * @protected
   * @param {Error} info
   * @param {string} [summary='Hinweis']
   * 
   * @memberOf BaseComponent
   */
  protected handleInfo(info: Error, summary = 'Hinweis') {
    this.addInfoMessage(info.message, summary);
  }

  /**
   * Die rxjs Subscription @param{subscription} für spätere Freigabe registrieren.
   * 
   * @protected
   * @param {Subscription} subscription 
   * 
   * @memberOf CoreComponent
   */
  protected registerSubscription(subscription: Subscription) {
    Assert.notNull(subscription);

    this.subscriptions.push(subscription);
  }

}