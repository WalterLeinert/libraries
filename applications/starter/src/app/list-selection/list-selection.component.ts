/* tslint:disable:use-life-cycle-interface -> BaseComponent */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { MessageService, ServiceRequestsComponent } from '@fluxgate/client';
import {
  CurrentItemSetCommand, ExtendedCrudServiceRequests, IEntity, IExtendedCrudServiceState,
  ItemsFoundCommand, ItemsQueriedCommand, ServiceCommand
} from '@fluxgate/common';


@Component({
  selector: 'app-list-selection',
  template: `
<div class="ui-widget-header" style="padding:4px 10px;border-top: 0 none;border-bottom: 0 none">
  <i class="fa fa-search" style="margin:4px 4px 0 0"></i>
  <input #gb type="text" pInputText size="20" placeholder="Filter">
</div>

<p-dataTable [value]="car" selectionMode="single" sortMode="single" [paginator]="true" [rows]="15
  name="car" [selection]="selectedCar"
  (selectionChange)="onSelectedValueChange($event)" [globalFilter]="gb">
  <p-column field="name" header="Name" sortable="true"></p-column>
  <p-column field="color" header="Farbe" sortable="true"></p-column>
</p-dataTable>
`,
  styles: [`
.shadow {
    box-shadow: 0 0 1.5em rgba(85,85,85,.5);
}

.verlaufliste {
    background: #eeeeee;
    background: -webkit-linear-gradient(#ffffff, #eeeeee 5%); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#ffffff, #eeeeee 5%); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#ffffff, #eeeeee 5%); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#ffffff, #eeeeee 5%); /* Standard syntax (must be last) */
}

.aside {
  box-shadow: 0 0 1.5em rgba(85,85,85,.5);
}
`]
})
export class ListSelectionComponent extends ServiceRequestsComponent<IEntity<any>,
ExtendedCrudServiceRequests<IEntity<any>, any>> {
  protected static readonly logger = getLogger(ListSelectionComponent);

  public title: string = 'Carliste';
  public items: any[];
  public selectedItem: any;
  // public config: IAutoformConfig;


  // Selektion
  // private selectedCar: Car;

  constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    serviceRequests: ExtendedCrudServiceRequests<any, any>) {
    super(router, route, messageService, serviceRequests);

    this.serviceRequests.find().subscribe((items) => {
      // ok
    });
  }


  public onSelectedValueChange(car: IEntity<any>) {
    using(new XLog(ListSelectionComponent.logger, levels.INFO, 'onSelectedValueChange'), (log) => {
      log.info(`car = ${JSON.stringify(car)}`);
      this.serviceRequests.setCurrent(car).subscribe((item) => {

        // Ändern über CarDetailComponent
        if (item) {
          this.router.navigate([item.id], { relativeTo: this.route });
        }
      });
    });
  }

  protected onStoreUpdated(command: ServiceCommand<IEntity<any>>): void {
    super.onStoreUpdated(command);

    /**
     * ein Kommando für unseren Store?
     */
    if (command.storeId === this.storeId) {
      const state = this.getState<IExtendedCrudServiceState<IEntity<any>, number>>();

      if (command instanceof ItemsFoundCommand || command instanceof ItemsQueriedCommand) {
        this.items = [...state.items];
        this.selectedItem = state.currentItem;
      }

      if (command instanceof CurrentItemSetCommand) {
        this.selectedItem = state.currentItem;
      }
    }
  }

}