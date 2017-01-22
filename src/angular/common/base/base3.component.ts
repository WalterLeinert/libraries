import { Router } from '@angular/router';
import { Base2Component } from './base2.component';
import { IServiceBase } from '../../services';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit 3 Services.
 * 
 * @export
 * @class Base3Component
 * @implements {OnInit}
 * @template TService - der konkrete Service
 */
export abstract class Base3Component<TService1 extends IServiceBase, TService2 extends IServiceBase, TService3 extends IServiceBase> extends Base2Component<TService1, TService2> {
    /**
   * Creates an instance of BaseComponent.
   * 
   * @param {Router} _router - der zugehörige Router
   * @param {*} _service - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(router: Router, service: TService1, service2: TService2, private _service3: TService3) {
      super(router, service, service2);
  }

   /**
   * Liefert den zugehörigen Service3
   * 
   * @readonly
   * @protected
   * @type {TService}
   * @memberOf BaseComponent
   */
  protected get service3(): TService3 {
    return this._service3;
  }
}