import { ActivatedRoute, Router } from '@angular/router';

// Fluxgate
import { IServiceBase } from '@fluxgate/common';

import { MessageService } from '../../services/message.service';
import { BaseComponent } from './base.component';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit 2 Services.
 */
export abstract class Base2Component<TService1 extends IServiceBase<any, any>,
  TService2 extends IServiceBase<any, any>> extends BaseComponent<TService1> {

  /**
   * Creates an instance of BaseComponent.
   *
   * @param _router - der zugehörige Router
   * @param _route - die aktivierte Route
   * @param _service2 - der zugehörige Service
   */
  protected constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    service: TService1, private _service2: TService2) {
    super(router, route, messageService, service);
  }

  /**
   * Liefert den zugehörigen Service2
   */
  public get service2(): TService2 {
    return this._service2;
  }
}