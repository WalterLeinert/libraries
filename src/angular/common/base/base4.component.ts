import { ActivatedRoute, Router } from '@angular/router';

// Fluxgate
import { IServiceBase } from '@fluxgate/common';

import { Base3Component } from './base3.component';

/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit 3 Services.
 * 
 * @export
 * @class Base3Component
 * @implements {OnInit}
 * @template TService - der konkrete Service
 */
export abstract class Base4Component<
  TService1 extends IServiceBase,
  TService2 extends IServiceBase,
  TService3 extends IServiceBase,
  TService4 extends IServiceBase> extends Base3Component<TService1, TService2, TService3> {

  /**
   * Creates an instance of BaseComponent.
   * 
   * @param {Router} _router - der zugehörige Router
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service4 - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(router: Router, route: ActivatedRoute,
    service: TService1, service2: TService2, service3: TService3,
    private _service4: TService4) {
    super(router, route, service, service2, service3);
  }

  /**
   * Liefert den zugehörigen Service4
   * 
   * @readonly
   * @protected
   * @type {TService4}
   * @memberOf BaseComponent
   */
  public get service4(): TService4 {
    return this._service4;
  }
}