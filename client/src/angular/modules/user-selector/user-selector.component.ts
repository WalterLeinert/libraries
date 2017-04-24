import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { IEntity, IUser, UserStore } from '@fluxgate/common';
import { ItemsFoundCommand, IExtendedCrudServiceState, ServiceCommand } from '@fluxgate/common';
import { Utility } from '@fluxgate/core';

import { UserServiceRequests } from '../../redux/user-service-requests';
import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { SelectorBaseComponent } from '../common/selectorBase.component';

/**
 * Die Komponente erlaubt die Auswahl eines @see{User} über den Service @see{UserService}.
 *
 * Standarmäßig ist die Property @see{User.fullName} an das "textField" angebunden und
 * die Userinstanz selbst ('.') an das "valueField".
 *
 * @export
 * @class UserSelectorComponent
 * @extends {SelectorBaseComponent}
 */
@Component({
  selector: 'flx-user-selector',
  template: `
<flx-dropdown-selector [data]="users" [textField]="textField" [valueField]="valueField"
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
    }
  ]
})
export class UserSelectorComponent extends SelectorBaseComponent<IUser> {

  @ViewChild(NgModel) public model: NgModel;
  @Input() public textField: string = 'fullName';
  @Input() public valueField: string = '.';

  public users: IUser[];

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    private serviceRequests: UserServiceRequests,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

    this.subscribeToStore(UserStore.ID);
    this.serviceRequests.find();

    this.style = {
      width: '200px'
    };
  }

  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      userError: {
        valid: false
      },
    };
  }

  protected onValueWritten(value: IUser) {
    // this.changeDetectorRef.markForCheck();
  }

  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T, TId>): void {
    super.onStoreUpdated(command);

    const state = this.getStoreState<IExtendedCrudServiceState<IUser, number>>(UserStore.ID);

    if (command.storeId === UserStore.ID) {

      if (command instanceof ItemsFoundCommand) {
        this.value = Utility.isNullOrEmpty(state.items) ? null : state.items[0];
        this.users = state.items;
      }
    }
  }
}