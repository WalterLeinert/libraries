import { OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { IAutoformConfig, IAutoformNavigation } from '../../modules/autoform/autoformConfig.interface';
import { AutoformConstants } from '../../modules/autoform/autoformConstants';
import { IServiceBase } from '../../services';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten
 * 
 * @export
 * @class BaseComponent
 * @implements {OnInit}
 * @template TService - der konkrete Service
 */

/*@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})*/
export abstract class BaseComponent<TService extends IServiceBase> implements OnInit, OnDestroy {
  private _messages: Message[] = [];


  /**
   * Creates an instance of BaseComponent.
   * 
   * @param {Router} _router - der zugehörige Router
   * @param {*} _service - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(private _router: Router, private _service: TService) {
  }


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
    // ok
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
   * Navigiert über den zugehörigen Router
   * 
   * @protected
   * @param {any[]} commands
   * @param {NavigationExtras} [extras]
   * @returns {Promise<boolean>}
   * 
   * @memberOf BaseComponent
   */
  protected navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this._router.navigate(commands, extras);
  }


  /**
   * Navigiert auf die Detailseite für die Entity-Instanz @para{item}.
   * Die Details werden über ein generisch aufgebautes Formular Autoform (@see {AutoformComponent}) angezeigt
   */
  protected navigateToDetailGeneric<T>(item: T, config: IAutoformConfig): Promise<boolean> {

    const navigationConfig: IAutoformNavigation = {
      entityId: this.service.getEntityId(item),
      entity: this.service.getModelClassName(),
      autoformConfig: JSON.stringify(config)
    };

    return this.navigate([AutoformConstants.GENERIC_TOPIC, navigationConfig]);
  }

  /**
   * Liefert den zugehörigen Service
   * 
   * @readonly
   * @protected
   * @type {TService}
   * @memberOf BaseComponent
   */
  protected get service(): TService {
    return this._service;
  }


  /**
   * Liefert die Entity-Id für den Navigationspfad.
   * Format: <Entity-Classname>-<Item-Id>
   */
  protected formatGenericId(item: any): string {
    return `${this.service.getModelClassName() + '-' + this.service.getEntityId(item)}`;
  }

}