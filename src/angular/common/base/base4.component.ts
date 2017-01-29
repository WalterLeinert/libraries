import { Router } from '@angular/router';
import { Base3Component } from '.';
import { IServiceBase } from '../../services';


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
   * @param {*} _service4 - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(router: Router, service: TService1, service2: TService2, service3: TService3, private _service4: TService4) {
      super(router, service, service2, service3);
  }

   /**
   * Liefert den zugehörigen Service4
   * 
   * @readonly
   * @protected
   * @type {TService4}
   * @memberOf BaseComponent
   */
  protected get service4(): TService4 {
    return this._service4;
  }
}