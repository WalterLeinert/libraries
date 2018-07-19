import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { MessageService, MetadataService } from '@fluxgate/client';
import { IUser } from '@fluxgate/common';

import { UserSelectorServiceRequests } from '../../redux/user-selector-service-requests';
import { ServiceRequestsSelectorComponent } from '../common/service-requests-selector.component';


/**
 * Die Komponente erlaubt die Auswahl eines @see{User} über @see{UserSelectorServiceRequests}.
 *
 * Standarmäßig ist die Property @see{User.fullName} an das "textField" angebunden und
 * die Userinstanz selbst ('.') an das "valueField".
 *
 * @export
 * @class UserSelectorComponent
 * @extends {ServiceRequestsSelectorComponent}
 */
@Component({
  selector: 'flx-user-selector',
  template: `
<flx-dropdown-selector [data]="items" [textField]="textField" [valueField]="valueField"
  [(ngModel)]="value" name="userSelector"
  [style]="style" [debug]="debug">
</flx-dropdown-selector>
`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: UserSelectorComponent,
      multi: true,
    },
    UserSelectorServiceRequests
  ]
})
export class UserSelectorComponent extends ServiceRequestsSelectorComponent<IUser, number> {
  protected static readonly logger = getLogger(UserSelectorComponent);

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    serviceRequests: UserSelectorServiceRequests,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, serviceRequests, changeDetectorRef);

    this.textField = 'fullName';
  }
}