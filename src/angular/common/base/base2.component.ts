import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

export abstract class Base2Component<TService, TService2> extends BaseComponent<TService> {

  protected constructor(router: Router, service: TService, private _service2: TService2) {
    super(router, service);
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