import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

// fluxgate
import { CoreComponent, MessageService } from '@fluxgate/client';

/**
 * Guard-Service, der sicher stellt, dass ein aktueller User existiert.
 */
@Injectable()
export class CurrentUserGuardService extends CoreComponent implements CanActivate {

  constructor(messageService: MessageService) {
    super(messageService);
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.currentStoreUser) {
      return true;
    }
    return false;
  }

}