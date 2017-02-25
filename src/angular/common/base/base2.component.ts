import { ActivatedRoute, Router } from '@angular/router';

// Fluxgate
import { IServiceBase } from '@fluxgate/common';

import { BaseComponent } from './base.component';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit 2 Services.
 * 
 * @export
 * @class Base2Component
 * @implements {OnInit}
 * @template TService - der konkrete Service
 */
export abstract class Base2Component<TService1 extends IServiceBase, TService2 extends IServiceBase> extends
  BaseComponent<TService1> {

  /**
   * Creates an instance of BaseComponent.
   * 
   * @param {Router} _router - der zugehörige Router
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service2 - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(router: Router, route: ActivatedRoute, service: TService1, private _service2: TService2) {
    super(router, route, service);
  }

  /**
   * Liefert den zugehörigen Service2
   * 
   * @readonly
   * @protected
   * @type {TService}
   * @memberOf BaseComponent
   */
  protected get service2(): TService2 {
    return this._service2;
  }
}