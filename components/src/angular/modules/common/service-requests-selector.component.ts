import { Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { DisplayInfo, MessageService, MetadataService } from '@fluxgate/client';
import { IEntity } from '@fluxgate/common';
import {
  CurrentItemSetCommand, IExtendedCrudServiceRequests, IExtendedCrudServiceState, ItemsFoundCommand, ServiceCommand
} from '@fluxgate/common';
import { Assert, IToString, Types, Utility } from '@fluxgate/core';


import { SelectorBaseComponent } from '../common/selectorBase.component';


/**
 * abstrakte Basisklasse für Selektoren, die mit ServiceRequests arbeiten
 *
 * @export
 * @abstract
 * @class ServiceRequestsSelectorComponent
 * @extends {SelectorBaseComponent<T>}
 * @template T
 */
export abstract class ServiceRequestsSelectorComponent<T extends IEntity<TId>, TId extends IToString>
  extends SelectorBaseComponent<any> {
  protected static readonly logger = getLogger(ServiceRequestsSelectorComponent);

  @ViewChild(NgModel) public model: NgModel;
  @Input() public textField: string = '-missing-';
  @Input() public valueField: string = '.';

  public items: T[];

  protected constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    private serviceRequests: IExtendedCrudServiceRequests<T, TId>,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);

    using(new XLog(ServiceRequestsSelectorComponent.logger, levels.DEBUG, 'ctor'), (log) => {

      this.subscribeToStore(this.serviceRequests.storeId);
      this.serviceRequests.find().subscribe((items) => {
        // ok: subscribe muss aufgerufen werden, damit der Call ausgeführt wird und die Items geholt werden!

        // default: erste Rolle selektiert
        const itemToSelect = Utility.isNullOrEmpty(items) ? null : items[0];

        this.serviceRequests.setCurrent(itemToSelect).subscribe((item) => {
          if (log.isDebugEnabled()) {
            log.log(`class: ${this.constructor.name}: item = ${JSON.stringify(item)}`);
          }
        });
      });
    });
  }

  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      selectorError: {
        valid: false,
      },
    };
  }

  protected onValueWritten(value: T) {
    this.changeDetectorRef.markForCheck();
  }

  protected onStoreUpdated<T extends IEntity<TId>, TId>(command: ServiceCommand<T>): void {
    super.onStoreUpdated(command);

    const state = this.getStoreState<IExtendedCrudServiceState<T, TId>>(this.serviceRequests.storeId);

    if (command.storeId === this.serviceRequests.storeId) {
      if (command instanceof CurrentItemSetCommand) {
        const x = state.currentItem;

        this.value = this.getValueForItem(x);
      }

      if (command instanceof ItemsFoundCommand) {
        this.items = state.items as any[];
      }
    }
  }


  protected onValueChange(value: T) {
    using(new XLog(ServiceRequestsSelectorComponent.logger, levels.DEBUG, 'onValueChange'), (log) => {
      super.onValueChange(value);

      if (this.items) {
        this.serviceRequests.setCurrent(this.getItemForValue(value)).subscribe((item) => {
          if (log.isDebugEnabled()) {
            log.log(`class: ${this.constructor.name}: item = ${JSON.stringify(item)}`);
          }
        });
      }

    });
  }


  /**
   *
   * @param item TODO: in Basisklasse (ggf. abstrakt) verschieben
   */
  protected getValueForItem<T extends IEntity<TId>, TId>(item: T): any {
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

  protected getItemForValue(value: any): T {
    let rval: any;

    if (!Types.isPresent(value)) {
      return value;
    }

    if (this.valueField === DisplayInfo.CURRENT_ITEM) {
      rval = value;
    } else {
      Assert.notNullOrEmpty(this.items);
      rval = this.items.find((elem) => elem[this.valueField] === value);
      Assert.notNull(rval);
    }

    return rval;
  }
}