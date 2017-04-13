import { ActivatedRoute, Router } from '@angular/router';

// Fluxgate
import { IServiceBase } from '@fluxgate/common';

import { MessageService } from '../../services/message.service';
import { Base2Component } from './base2.component';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit 3 Services.
 *
 * @export
 * @class Base3Component
 * @implements {OnInit}
 * @template TService - der konkrete Service
 */
export abstract class Base3Component<
  TService1 extends IServiceBase,
  TService2 extends IServiceBase,
  TService3 extends IServiceBase> extends Base2Component<TService1, TService2> {

  /**
   * Creates an instance of BaseComponent.
   *
   * @param {Router} _router - der zugehörige Router
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service3 - der zugehörige Service
   *
   * @memberOf BaseComponent
   */
  protected constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    service: TService1, service2: TService2, private _service3: TService3) {
    super(router, route, messageService, service, service2);
  }

  /**
   * Liefert den zugehörigen Service3
   *
   * @readonly
   * @protected
   * @type {TService3}
   * @memberOf BaseComponent
   */
  public get service3(): TService3 {
    return this._service3;
  }
}