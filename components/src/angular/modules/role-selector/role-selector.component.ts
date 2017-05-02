import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { MessageService, MetadataService } from '@fluxgate/client';
import { IRole } from '@fluxgate/common';

import { RoleSelectorServiceRequests } from '../../redux/role-selector-service-requests';
import { ServiceRequestsSelectorComponent } from '../common/service-requests-selector.component';


/**
 * Die Komponente erlaubt die Auswahl einer @see{Role} über den Service @see{RoleService}.
 *
 * Standarmäßig ist die Property @see{Role.description} an das "textField" angebunden und
 * die Rolleninstanz selbst ('.') an das "valueField".
 *
 * @export
 * @class RoleSelectorComponent
 * @extends {ServiceRequestsSelectorComponent}
 */
@Component({
  selector: 'flx-role-selector',
  template: `
<flx-dropdown-selector [data]="items" [textField]="textField" [valueField]="valueField"
  [(ngModel)]="value" name="roleSelector"
  [style]="style" [debug]="debug">
</flx-dropdown-selector>
`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RoleSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RoleSelectorComponent,
      multi: true,
    },
    RoleSelectorServiceRequests
  ]
})
export class RoleSelectorComponent extends ServiceRequestsSelectorComponent<IRole, number> {
  protected static readonly logger = getLogger(RoleSelectorComponent);

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    serviceRequests: RoleSelectorServiceRequests,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, serviceRequests, changeDetectorRef);

    this.textField = 'description';
  }
}