import { Component, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

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
<div>
  <flx-dropdown-selector [dataService]="service" [textField]="textField" [valueField]="valueField"
    [(selectedValue)]="selectedValue" name="userSelector"
    [style]="style" [debug]="debug">
  </flx-dropdown-selector>
</div>
`,
  styles: []
})
export class UserSelectorComponent extends SelectorBaseComponent {

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
}