import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { IEntity, IRole } from '@fluxgate/common';
import { ItemsFoundCommand, ServiceCommand } from '@fluxgate/common';
import { Utility } from '@fluxgate/core';

import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { RoleServiceRequests } from '../authentication/redux/role-service-requests';
import { RoleStore } from '../authentication/redux/role-store';
import { SelectorBaseComponent } from '../common/selectorBase.component';

/**
 * Die Komponente erlaubt die Auswahl einer @see{Role} über den Service @see{RoleService}.
 *
 * Standarmäßig ist die Property @see{Role.description} an das "textField" angebunden und
 * die Rolleninstanz selbst ('.') an das "valueField".
 *
 * @export
 * @class RoleSelectorComponent
 * @extends {SelectorBaseComponent}
 */
@Component({
  selector: 'flx-role-selector',
  template: `
<flx-dropdown-selector [data]="roles" [textField]="textField" [valueField]="valueField"
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
    }
  ]
})
export class RoleSelectorComponent extends SelectorBaseComponent<IRole> {

  @ViewChild(NgModel) public model: NgModel;
  @Input() public textField: string = 'description';
  @Input() public valueField: string = '.';

  public roles: IRole[];

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    private serviceRequests: RoleServiceRequests,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

    this.subscribeToStore(RoleStore.ID);
    this.serviceRequests.find();

    this.style = {
      width: '200px'
    };
  }

  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      roleError: {
        valid: false,
      },
    };
  }

  protected onValueWritten(value: IRole) {
    this.changeDetectorRef.markForCheck();
  }

  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T, TId>): void {
    super.onStoreUpdated(command);

    const state = this.getStoreState<IRole, number>(RoleStore.ID);

    if (command.storeId === RoleStore.ID) {

      if (command instanceof ItemsFoundCommand) {
        this.value = Utility.isNullOrEmpty(state.items) ? null : state.items[0];
        this.roles = state.items;
      }
    }
  }
}