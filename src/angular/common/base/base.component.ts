import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { Assert, InstanceAccessor, IService, IServiceBase, ServiceResult, Utility } from '@fluxgate/common';

import { IRefreshHelper, IRouterNavigationAction, NavigationAction } from '../../common/routing';
import { IAutoformConfig, IAutoformNavigation } from '../../modules/autoform/autoformConfig.interface';
import { AutoformConstants } from '../../modules/autoform/autoformConstants';
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
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(private _router: Router, private _route: ActivatedRoute, private _service: TService) {
    super();
  }

  /**
   * Liefert true, falls der Status der Komponente geändert wurde und zu sichernde Daten existieren.
   * Muss in konkreten Komponentenklassen überschrieben werden.
   */
  public hasChanges(): boolean {
    return false;
  }

  /**
   * Erzeugt ein @see{IRouterNavigationAction}-Objekt für CRUD-Aktionen auf einer Model-Instanz vom Typ @see{T}
   * 
   * @param action - die geforderte CRUD-Aktion
   * @param subject - die Model-Instanz
   */
  protected createNavigationRouterAction<T>(action: NavigationAction, subject: T): IRouterNavigationAction<T> {
    return {
      action: action, subject: subject
    };
  }

  /**
   * Navigiert zur Parent-Komponente mit einem Routing-Command @see{IRouterNavigationAction}. 
   * 
   * @protected
   * @template T 
   * @param {NavigationAction} action 
   * @param {T} subject 
   * 
   * @memberOf BaseComponent
   */
  protected navigateToParent<T>(action: NavigationAction, subject: T) {
    this.navigate(['../', this.createNavigationRouterAction(action, subject)]);
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
   * Führt die CRUD-Aktion in @param{routeParam} mit Hilfe des Services @param{service} durch (default:
   * aktueller Service), aktualisiert die an die Komponente angebundene Liste von Items mit Hilfe von @param{refresher}
   * 
   * @protected
   * @template T - Typ der Model-Instanz
   * @template TId - Typ der Id-Spalte der Model-Instanz
   * @param {T[]} items - die aktuell angebundene Liste von Items
   * @param {IRouterNavigationAction<T>} routeParams
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
        case 'create':
          return service.create(routeParams.subject).map((item: T) => service.getEntityId(item));

        case 'update':
          return service.update(routeParams.subject).map((item: T) => service.getEntityId(routeParams.subject));

        case 'delete':
          return service.delete(service.getEntityId(routeParams.subject)).map((result: ServiceResult<T>) => {
            let index = items.findIndex((item) => service.getEntityId(item) === result.id);

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
          throw new Error('not supported');
      }
    } else {
      return Observable.of(undefined);
    }
  }



  /**
   * Holt alle Model-Items mittels des Services und liefert einen IRefreshHelper als Observable
   * mit den Items und einem selectedItem, welches anhand von @param{id} ermittelt wird.
   * 
   * @protected
   * @template T 
   * @template TId 
   * @param {TId} id 
   * @param {InstanceAccessor<T, TId>} idAccessor 
   * @returns {Observable<IRefreshHelper<T>>} 
   * 
   * @memberOf BaseComponent
   */
  protected refreshItems<T, TId>(id: TId, idAccessor: InstanceAccessor<T, TId>): Observable<IRefreshHelper<T>> {
    let selectedItem: T;

    const service: IService = this.service as any as IService;    // TODO: ggf. Laufzeitcheck

    return service.find().
      do((items: T[]) => {

        if (id !== undefined) {
          selectedItem = items.find((item) => {
            return (idAccessor(item) === id);
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
   * Liefert den zugehörigen Router
   * 
   * @readonly
   * @protected
   * @type {Router}
   * @memberOf BaseComponent
   */
  protected get router(): Router {
    return this._router;
  }

  /**
   * Liefert die zugehörige Route
   * 
   * @readonly
   * @protected
   * @type {ActivatedRoute}
   * @memberOf BaseComponent
   */
  protected get route(): ActivatedRoute {
    return this._route;
  }


  /**
   * Liefert die Entity-Id für den Navigationspfad.
   * Format: <Entity-Classname>-<Item-Id>
   */
  protected formatGenericId(item: any): string {
    return `${this.service.getModelClassName() + '-' + this.service.getEntityId(item)}`;
  }

}