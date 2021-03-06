// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  CreateResult, DeleteResult, IEntity, IService,
  IServiceBase, UpdateResult
} from '@fluxgate/common';
import {
  Assert, Core, Deprecated, InstanceAccessor, InstanceSetter,
  NotSupportedException, Utility
} from '@fluxgate/core';


import { IRefreshHelper, IRouterNavigationAction } from '../../common/routing';
import { MessageService } from '../../services/message.service';
import { IAutoformConfig, IAutoformNavigation } from './autoformConfig.interface';
import { AutoformConstants } from './autoformConstants';
import { ExtendedCoreComponent } from './extended-core.component';
import { FormGroupInfo } from './formGroupInfo';


/**
 * Basisklasse (Komponente) für alle GUI-Komponenten mit Router und einem Service
 */

/*@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})*/
@Deprecated('durch ServiceRequestsComponent ersetzen')
export abstract class BaseComponent<TService extends IServiceBase<any, any>> extends ExtendedCoreComponent {
  protected static readonly logger = getLogger(BaseComponent);


  /**
   * Creates an instance of BaseComponent.
   *
   * @param _router - der zugehörige Router
   * @param _route - die aktivierte Route
   * @param _service - der zugehörige Service
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
      autoformConfig: Core.stringify(config)
    };

    return this.navigate([AutoformConstants.GENERIC_TOPIC, navigationConfig]);
  }




  /**
   * Führt die CRUD-Aktion in @param{routeParam} mit Hilfe des Services @param{service} durch (default:
   * aktueller Service), aktualisiert die an die Komponente angebundene Liste von Items mit Hilfe von @param{refresher}
   *
   * @param items - die aktuell angebundene Liste von Items
   * @param routeParams - Info mit action und subject
   * @param service - (optional) zu verwendender Service
   * @returns - die Id der Model-Instanz, die nach der Aktionen zu selektieren ist.
   */
  protected performAction<T extends IEntity<TId>, TId>(items: T[], routeParams: IRouterNavigationAction<T>,
    service?: IService<T, TId>): Observable<TId> {

    Assert.notNull(routeParams);

    if (!service) {
      service = this.service as any as IService<T, TId>;    // TODO: ggf. Laufzeitcheck
    }

    //
    // nur falls eine RouterNavigationAction vorliegt, führen wir die Aktion durch
    // Hinweis: instanceof funktioniert nicht, da offensichtlich der Router nur die Properties übernimmt
    // und nicht die Originalinstanz.
    //
    if (routeParams.subject && !Utility.isNullOrEmpty(routeParams.action)) {
      switch (routeParams.action) {
        case 'select':
          return of(service.getEntityId(routeParams.subject));

        case 'create':
          return this.createItem(routeParams.subject)
            .pipe(map((item: T) => service.getEntityId(item)));

        case 'update':
          return this.updateItem(routeParams.subject)
            .pipe(map((item: T) => service.getEntityId(routeParams.subject)));

        case 'delete':
          return this.deleteItem(service.getEntityId(routeParams.subject))
            .pipe(
              map((id: TId) => {
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
              })
            );

        default:
          throw new NotSupportedException();
      }
    } else {
      return of(undefined);
    }
  }



  /**
   * Holt alle Model-Items mittels des Services @param{service} bzw. des Komponentenservices
   * und liefert einen IRefreshHelper als Observable
   * mit den Items und einem selectedItem, welches anhand von @param{id} ermittelt wird.
   *
   * @param idToSelect - Id des zu selektierenden Items
   * @param idAccessor - (optional) liefert die zu verwendende Id des items
   * @param service - (optional) zu verwendender Service
   * @returns
   */
  protected refreshItems<T extends IEntity<TId>, TId>(idToSelect: TId, idAccessor?: InstanceAccessor<T, TId>,
    service?: IService<T, TId>): Observable<IRefreshHelper<T>> {

    let selectedItem: T;

    if (idAccessor === undefined) {
      idAccessor = ((item: T) => service.getEntityId(item));  // default: über Metadaten
    }

    if (!service) {
      service = this.service as any as IService<T, TId>;    // TODO: ggf. Laufzeitcheck
    }

    return service.find()
      .pipe(
        tap((findResult) => {
          if (idToSelect !== undefined) {
            selectedItem = findResult.items.find((item) => {
              return (idAccessor(item) === idToSelect);
            });
          } else {
            if (!Utility.isNullOrEmpty(findResult.items)) {
              selectedItem = findResult.items[0];
            } else {
              selectedItem = undefined;
            }
          }
        }),
        map((res) => {
          const result: IRefreshHelper<T> = {
            items: res.items, selectedItem: selectedItem
          };
          return result;
        })
      );
  }


  protected createItem<T extends IEntity<TId>, TId>(
    item: T,
    groupName: string = FormGroupInfo.DEFAULT_NAME,
    idAccessor?: InstanceAccessor<T, TId>,
    idSetter?: InstanceSetter<T, TId>,
    service?: IService<T, TId>): Observable<T> {

    if (idAccessor === undefined) {
      idAccessor = ((elem: T) => service.getEntityId(elem));  // default: über Metadaten
    }

    if (idSetter === undefined) {
      idSetter = ((elem: T, id: TId) => service.setEntityId(elem, id));  // default: über Metadaten
    }


    if (!service) {
      service = this.service as any as IService<T, TId>;    // TODO: ggf. Laufzeitcheck
    }
    return service.create(item)
      .pipe(
        tap((result: CreateResult<T, TId>) => {
          idSetter(result.item, idAccessor(result.item));
          this.addSuccessMessage('Record created.');
          this.resetFormGroup(result.item, groupName);
        }),
        map((result: CreateResult<T, TId>) => {
          return result.item;
        }),
        catchError<T, T>((err: any, caught: Observable<T>) => {
          this.handleError(err);
          throw err;
        })
      );
  }

  protected updateItem<T extends IEntity<TId>, TId>(item: T, groupName: string = FormGroupInfo.DEFAULT_NAME,
    service?: IService<T, TId>): Observable<T> {
    if (!service) {
      service = this.service as any as IService<T, TId>;    // TODO: ggf. Laufzeitcheck
    }
    return service.update(item)
      .pipe(
        tap((result: UpdateResult<T, TId>) => {
          this.addSuccessMessage('Record updated.');
          this.resetFormGroup(result.item, groupName);
        }),
        map((result: UpdateResult<T, TId>) => {
          return result.item;
        }),
        catchError<T, T>((err: any, caught: Observable<T>) => {
          this.handleError(err);
          throw err;
        })
      );
  }

  protected deleteItem<TId>(id: TId, service?: IService<any, TId>): Observable<TId> {
    if (!service) {
      service = this.service as any as IService<any, TId>;    // TODO: ggf. Laufzeitcheck
    }
    return service.delete(id)
      .pipe(
        tap((result: DeleteResult<TId>) => {
          this.addSuccessMessage('Record deleted.');
          this.resetForm();
        }),
        map((result: DeleteResult<TId>) => {
          return result.id;
        }),
        catchError<TId, TId>((err: any, caught: Observable<TId>) => {
          this.handleError(err);
          throw err;
        })
      );
  }


  /**
   * Liefert den zugehörigen Service
   */

  protected get service(): TService {
    return this._service;
  }


  /**
   * Setzt den Service (wird aktuell nur für AutoformComponent benötigt)
   *
   * @param service
   * @returns
   */
  protected setService(service: TService) {
    return this._service = service;
  }


  /**
   * Liefert die Entity-Id für den Navigationspfad.
   * Format: <Entity-Classname>-<Item-Id>
   */
  protected formatGenericId(item: any): string {
    return `${this.service.getModelClassName() + '-' + this.service.getEntityId(item)}`;
  }

}