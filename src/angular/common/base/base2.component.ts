import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

export abstract class Base2Component<TService1, TService2> extends BaseComponent<TService1> {

  protected constructor(router: Router, service1: TService1, private _service2, TService2) {
    super(router, service1);
  }

  /**
   * Liefert den zugehörigen Service
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