// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  Assert, InstanceAccessor, InstanceSetter, IService, IServiceBase, NotSupportedException,
  ServiceResult, Utility
} from '@fluxgate/common';

import { IRefreshHelper, IRouterNavigationAction } from '../../common/routing';
import { IAutoformConfig, IAutoformNavigation } from '../../modules/autoform/autoformConfig.interface';
import { AutoformConstants } from '../../modules/autoform/autoformConstants';
import { MessageService } from '../../services/message.service';
import { ExtendedCoreComponent } from './extended-core.component';
import { FormGroupInfo } from './formGroupInfo';


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
export abstract class BaseComponent<TService extends IServiceBase> extends ExtendedCoreComponent {
  protected static readonly logger = getLogger(BaseComponent);


  /**
   * Creates an instance of BaseComponent.
   *
   * @param {Router} _router - der zugehörige Router
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service - der zugehörige Service
   *
   * @memberOf BaseComponent
   */
  protected constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    private _service: TService) {
    super(router, route, messageService);
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
   * Führt die CRUD-Aktion in @param{routeParam} mit Hilfe des Services @param{service} durch (default:
   * aktueller Service), aktualisiert die an die Komponente angebundene Liste von Items mit Hilfe von @param{refresher}
   *
   * @protected
   * @template T - Typ der Model-Instanz
   * @template TId - Typ der Id-Spalte der Model-Instanz
   * @param {T[]} items - die aktuell angebundene Liste von Items
   * @param {IRouterNavigationAction<T>} routeParams - Info mit action und subject
   * @param {IService<T>} service - (optional) zu verwendender Service
   * @returns Observable<TId> - die Id der Model-Instanz, die nach der Aktionen zu selektieren ist.
   *
   * @memberOf BaseComponent
   */
  protected performAction<T, TId>(items: T[], routeParams: IRouterNavigationAction<T>,
    service?: IService): Observable<TId> {

    Assert.notNull(routeParams);

    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }

    //
    // nur falls eine RouterNavigationAction vorliegt, führen wir die Aktion durch
    // Hinweis: instanceof funktioniert nicht, da offensichtlich der Router nur die Properties übernimmt
    // und nicht die Originalinstanz.
    //
    if (routeParams.subject && !Utility.isNullOrEmpty(routeParams.action)) {
      switch (routeParams.action) {
        case 'select':
          return Observable.of(service.getEntityId(routeParams.subject));

        case 'create':
          return this.createItem(routeParams.subject).map((item: T) => service.getEntityId(item));

        case 'update':
          return this.updateItem(routeParams.subject).map((item: T) => service.getEntityId(routeParams.subject));

        case 'delete':
          return this.deleteItem(service.getEntityId(routeParams.subject)).map((id: TId) => {
            let index = items.findIndex((item) => service.getEntityId(item) === id);

            if (index >= items.length - 1) {
              index--;
            } else {
              index++;
            }

            if (index < 0) {
              index = undefined;
            }

            let idToSelect: TId;
            if (index !== undefined) {
              idToSelect = service.getEntityId(items[index]);
            }

            return idToSelect;
          });

        default:
          throw new NotSupportedException();
      }
    } else {
      return Observable.of(undefined);
    }
  }



  /**
   * Holt alle Model-Items mittels des Services @param{service} bzw. des Komponentenservices
   * und liefert einen IRefreshHelper als Observable
   * mit den Items und einem selectedItem, welches anhand von @param{id} ermittelt wird.
   *
   * @protected
   * @template T
   * @template TId
   * @param {TId} idToSelect - Id des zu selektierenden Items
   * @param {InstanceAccessor<T, TId>} idAccessor - (optional) liefert die zu verwendende Id des items
   * @param {IService<T>} service - (optional) zu verwendender Service
   * @returns {Observable<IRefreshHelper<T>>}
   *
   * @memberOf BaseComponent
   */
  protected refreshItems<T, TId>(idToSelect: TId, idAccessor?: InstanceAccessor<T, TId>,
    service?: IService): Observable<IRefreshHelper<T>> {

    let selectedItem: T;

    if (idAccessor === undefined) {
      idAccessor = ((item: T) => service.getEntityId(item));  // default: über Metadaten
    }

    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }

    return service.find().
      do((items: T[]) => {

        if (idToSelect !== undefined) {
          selectedItem = items.find((item) => {
            return (idAccessor(item) === idToSelect);
          });
        } else {
          if (!Utility.isNullOrEmpty(items)) {
            selectedItem = items[0];
          } else {
            selectedItem = undefined;
          }
        }

      }).
      map((items: T[]) => {
        const result: IRefreshHelper<T> = {
          items: items, selectedItem: selectedItem
        };
        return result;
      });
  }


  protected createItem<T, TId>(
    item: T,
    groupName: string = FormGroupInfo.DEFAULT_NAME,
    idAccessor?: InstanceAccessor<T, TId>,
    idSetter?: InstanceSetter<T, TId>,
    service?: IService): Observable<T> {

    if (idAccessor === undefined) {
      idAccessor = ((elem: T) => service.getEntityId(elem));  // default: über Metadaten
    }

    if (idSetter === undefined) {
      idSetter = ((elem: T, id: TId) => service.setEntityId(elem, id));  // default: über Metadaten
    }


    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }
    return service.create(item)
      .do((elem: T) => {
        idSetter(item, idAccessor(elem));
        this.addSuccessMessage('Record created.');
        this.resetFormGroup(item, groupName);
      })   // Id setzen
      .catch(this.handleError);
  }

  protected updateItem<T, TId>(item: T, groupName: string = FormGroupInfo.DEFAULT_NAME,
    service?: IService): Observable<T> {
    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }
    return service.update(item)
      .do((elem: T) => {
        this.addSuccessMessage('Record updated.');
        this.resetFormGroup(item, groupName);
      })
      .catch(this.handleError);
  }

  protected deleteItem<TId>(id: TId, service?: IService): Observable<TId> {
    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }
    return service.delete(id)
      .do((elemId: TId) => {
        this.addSuccessMessage('Record deleted.');
        this.resetForm();
      })
      .map((result: ServiceResult<TId>) => {
        return result.id;
      })
      .catch(this.handleError);
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