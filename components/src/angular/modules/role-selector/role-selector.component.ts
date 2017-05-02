import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { DisplayInfo, MessageService, MetadataService } from '@fluxgate/client';
import { IEntity, IRole } from '@fluxgate/common';
import { CurrentItemSetCommand, IExtendedCrudServiceState, ItemsFoundCommand, ServiceCommand } from '@fluxgate/common';
import { Assert, Utility, Types } from '@fluxgate/core';

import { RoleSelectorServiceRequests } from '../../redux/role-selector-service-requests';
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
    },
    RoleSelectorServiceRequests
  ]
})
export class RoleSelectorComponent extends SelectorBaseComponent<IRole> {
  protected static readonly logger = getLogger(RoleSelectorComponent);

  @ViewChild(NgModel) public model: NgModel;
  @Input() public textField: string = 'description';
  @Input() public valueField: string = '.';

  public roles: IRole[];

  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    private serviceRequests: RoleSelectorServiceRequests,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

    using(new XLog(RoleSelectorComponent.logger, levels.DEBUG, 'ctor'), (log) => {

      this.subscribeToStore(this.serviceRequests.storeId);
      this.serviceRequests.find().subscribe((roles) => {
        // ok: subscribe muss aufgerufen werden, damit der Call ausgeführt wird und die Roles geholt werden!

        // default: erste Rolle selektiert
        const role = Utility.isNullOrEmpty(roles) ? null : roles[0];

        this.serviceRequests.setCurrent(role).subscribe((r) => {
          if (log.isDebugEnabled()) {
            log.log(`class: ${this.constructor.name}: role = ${JSON.stringify(r)}`);
          }
        });
      });

      this.style = {
        width: '200px'
      };
    });
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

    const state = this.getStoreState<IExtendedCrudServiceState<IRole, number>>(this.serviceRequests.storeId);

    if (command.storeId === this.serviceRequests.storeId) {
      if (command instanceof CurrentItemSetCommand) {
        this.value = this.getValueForItem(state.currentItem);
      }

      if (command instanceof ItemsFoundCommand) {
        this.roles = state.items;
      }
    }
  }

  protected onValueChange(value: IRole) {
    using(new XLog(RoleSelectorComponent.logger, levels.DEBUG, 'onValueChange'), (log) => {
      super.onValueChange(value);

      this.serviceRequests.setCurrent(this.getItemForValue(value)).subscribe((item) => {
        if (log.isDebugEnabled()) {
          log.log(`class: ${this.constructor.name}: item = ${JSON.stringify(item)}`);
        }
      });
    });
  }


  /**
   *
   * @param item TODO: in Basisklasse (ggf. abstrakt) verschieben
   */
  protected getValueForItem(item: IRole): any {
    let rval: any;

    if (!Types.isPresent(item)) {
      return item;
    }

    if (this.valueField === DisplayInfo.CURRENT_ITEM) {
      rval = item;
    } else {
      rval = item[this.valueField];
    }

    return rval;
  }

  protected getItemForValue(value: any): IRole {
    let rval: any;

    if (!Types.isPresent(value)) {
      return value;
    }

    if (this.valueField === DisplayInfo.CURRENT_ITEM) {
      rval = value;
    } else {
      rval = this.roles.find((elem) => elem[this.valueField] === value);
      Assert.notNull(rval);
    }

    return rval;
  }
}