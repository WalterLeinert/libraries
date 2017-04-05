import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { IRole } from '@fluxgate/common';

import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { RoleService } from '../authentication/role.service';
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
<div>
  <flx-dropdown-selector [dataService]="service" [textField]="textField" [valueField]="valueField"
    [(ngModel)]="value" name="roleSelector"
    [style]="style" [debug]="debug">
  </flx-dropdown-selector>
</div>
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

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    public service: RoleService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

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
}