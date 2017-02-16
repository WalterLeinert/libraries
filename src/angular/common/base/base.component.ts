import { OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { IAutoformConfig, IAutoformNavigation } from '../../modules/autoform/autoformConfig.interface';
import { AutoformConstants } from '../../modules/autoform/autoformConstants';
import { IServiceBase } from '../../services';
import { CoreComponent } from './core.component';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit Router und einem Service
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
export abstract class BaseComponent<TService extends IServiceBase> extends CoreComponent {

  /**
   * Creates an instance of BaseComponent.
   * 
   * @param {Router} _router - der zugehörige Router
   * @param {*} _service - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(private _router: Router, private _service: TService) {
    super();
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