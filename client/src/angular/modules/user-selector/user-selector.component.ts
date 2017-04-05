import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { IUser } from '@fluxgate/common';

import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { UserService } from '../authentication/user.service';
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
<flx-dropdown-selector [dataService]="service" [textField]="textField" [valueField]="valueField"
  [(ngModel)]="value"
  name="userSelector" [style]="style" [debug]="debug">
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


  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    public service: UserService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

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

}