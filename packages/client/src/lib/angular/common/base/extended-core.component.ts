// import { Injector, ReflectiveInjector } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';






// PrimeNG
import { Confirmation } from 'primeng/components/common/api';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { IUser } from '@fluxgate/common';

import { IRouterNavigationAction, NavigationAction } from '../../common/routing';
import { MessageService } from '../../services/message.service';
import { CoreComponent } from './core.component';


/**
 * Erweiterung zu @see{CoreComponent}: alle Funktionen ohne Verwendung von Service(s) aus @see{BaseService}
 * hierher verschoben
 */
export abstract class ExtendedCoreComponent extends CoreComponent {

  /**
   * Liefer den aktuell angemeldeten User
   */
  public currentUser: IUser;

  /**
   * Creates an instance of BaseComponent.
   *
   * @param _router - der zugehörige Router
   * @param _route - die aktivierte Route
   * @param _service - der zugehörige Service
   */
  protected constructor(private _router: Router, private _route: ActivatedRoute, messageService: MessageService) {
    super(messageService);

    this.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
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
   * @param action
   * @param subject
   */
  protected navigateToParent<T>(action: NavigationAction, subject: T) {
    this.navigate(['../', this.createNavigationRouterAction(action, subject)]);
  }


  /**
   * Navigiert über den zugehörigen Router
   *
   * @param commands
   * @param [extras]
   * @returns
   */
  protected navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this._router.navigate(commands, extras);
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
    using(new XLog(ExtendedCoreComponent.logger, levels.INFO, 'confirm'), (log) => {

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
   * Zeigt einen modalen Bestätigungsdialog zum Löschen an.
   *
   * @param header - Headertext
   * @param message - Meldung
   * @param acceptAction - die Aktion, die nach Bestätigung durchgeführt werden soll (delete)
   * @param rejectAction - die Aktion, die nach Abweisen durchgeführt werden soll (cancel)
   */
  protected confirmDelete(header: string = 'Delete', message: string,
    acceptAction: () => void, rejectAction?: () => void) {
    using(new XLog(ExtendedCoreComponent.logger, levels.INFO, 'confirmDelete'), (log) => {
      this.confirmAction({
        header: header,
        message: message
      }, acceptAction, rejectAction);
    });
  }



  /**
   * Liefert den zugehörigen Router
   */
  protected get router(): Router {
    return this._router;
  }

  /**
   * Liefert die zugehörige Route
   */
  protected get route(): ActivatedRoute {
    return this._route;
  }

  // TODO: diese Methode umbenennen in findItems (ohne 'ByServiceRequest'), die Methoden aus BaseComponent
  // TODO obsolete?
  // protected findItemsByServiceRequest<T extends IEntity<TId>, TId, TService extends Service<T, TId>>(item: T,
  //   groupName: string = FormGroupInfo.DEFAULT_NAME,
  //   serviceRequests: ServiceRequests<T, TId, TService>): void {
  //   serviceRequests.find();
  // }

  // protected findItemByIdServiceRequest<T extends IEntity<TId>, TId, TService extends Service<T, TId>>(id: TId,
  //   groupName: string = FormGroupInfo.DEFAULT_NAME,
  //   serviceRequests: ServiceRequests<T, TId, TService>): void {
  //   serviceRequests.findById(id);
  // }


  // protected createItemByServiceRequest<T extends IEntity<TId>, TId, TService extends Service<T, TId>>(item: T,
  //   groupName: string = FormGroupInfo.DEFAULT_NAME,
  //   serviceRequests: ServiceRequests<T, TId, TService>): void {
  //   serviceRequests.create(item);
  // }


  // protected updateItemByServiceRequest<T extends IEntity<TId>, TId, TService extends Service<T, TId>>(item: T,
  //   groupName: string = FormGroupInfo.DEFAULT_NAME,
  //   serviceRequests: ServiceRequests<T, TId, TService>): void {
  //   serviceRequests.update(item);
  // }

  // protected deleteItemByServiceRequest<T extends IEntity<TId>, TId, TService extends Service<T, TId>>(id: TId,
  //   groupName: string = FormGroupInfo.DEFAULT_NAME,
  //   serviceRequests: ServiceRequests<T, TId, TService>): void {
  //   serviceRequests.delete(id);
  // }
}