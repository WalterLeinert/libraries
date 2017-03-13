// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// PrimeNG
import { Confirmation, ConfirmationService } from 'primeng/primeng';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  AppRegistry,
  Assert, InstanceAccessor, InstanceSetter, IService, IServiceBase, NotSupportedException,
  ServiceResult, Utility
} from '@fluxgate/common';

import { IRefreshHelper, IRouterNavigationAction, NavigationAction } from '../../common/routing';
import { IAutoformConfig, IAutoformNavigation } from '../../modules/autoform/autoformConfig.interface';
import { AutoformConstants } from '../../modules/autoform/autoformConstants';
import { MessageService } from '../../services/message.service';
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
  protected static readonly logger = getLogger(BaseComponent);


  /**
   * der PrimeNG Service für Aktionsbestätigungen 
   * 
   * @private
   * @type {ConfirmationService}
   * @memberOf BaseComponent
   */
  private confirmationService: ConfirmationService;


  /**
   * Creates an instance of BaseComponent.
   * 
   * @param {Router} _router - der zugehörige Router
   * @param {ActivatedRoute} _route - die aktivierte Route
   * @param {*} _service - der zugehörige Service
   * 
   * @memberOf BaseComponent
   */
  protected constructor(private _router: Router, private _route: ActivatedRoute, messageService: MessageService,
    private _service: TService) {
    super(messageService);
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
      .do((elem: T) => { idSetter(item, idAccessor(elem)); })   // Id setzen
      .catch(this.handleError);
  }

  protected updateItem<T, TId>(item: T, service?: IService): Observable<T> {
    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }
    return service.update(item)
      .catch(this.handleError);
  }

  protected deleteItem<TId>(id: TId, service?: IService): Observable<TId> {
    if (!service) {
      service = this.service as any as IService;    // TODO: ggf. Laufzeitcheck
    }
    return service.delete(id)
      .map((result: ServiceResult<TId>) => {
        return result.id;
      })
      .catch(this.handleError);
  }


  /**
   * Zeigt einen modalen Bestätigungsdialog mit Hilfe des @see{ConfirmationService} von primeNG.
   * 
   * Wichtig: im zugehörigen Komponentemplate muss ein 'flx-confirmation-dialog' (oder 'p-confirmDialog') existieren.
   * 
   * @param acceptAction - die Aktion, die nach Bestätigung durchgeführt werden soll (z.B. delete)
   * @param rejectAction - die Aktion, die nach Abweisen durchgeführt werden soll
   * @param options - Dialogoptions
   */
  protected confirmAction(options: Confirmation, acceptAction: () => void, rejectAction?: () => void) {
    using(new XLog(BaseComponent.logger, levels.INFO, 'confirm'), (log) => {

      if (this.confirmationService === undefined) {
        this.confirmationService = this.getConfirmationService();
      }

      options.accept = () => {
        log.log('accept');
        acceptAction();
      };

      options.reject = () => {
        log.log('reject');
        if (rejectAction) {
          rejectAction();
        }
      };

      this.confirmationService.confirm(options);
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



  private getConfirmationService(): ConfirmationService {
    const confirmationService = AppRegistry.instance.get<ConfirmationService>('ConfirmationService');
    return confirmationService;
    // const injector: Injector =
    //   ReflectiveInjector.resolveAndCreate([{ provide: ConfirmationService, useClass: ConfirmationService }]);
    // return injector.get(ConfirmationService);
  }

}