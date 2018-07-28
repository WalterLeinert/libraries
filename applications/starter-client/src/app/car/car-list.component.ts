/* tslint:disable:use-life-cycle-interface -> BaseComponent */
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { MessageService, ServiceRequestsComponent } from '@fluxgate/client';
import {
  CurrentItemSetCommand, IExtendedCrudServiceState, ItemsFoundCommand, ItemsQueriedCommand,
  ServiceCommand
} from '@fluxgate/common';

import { Field, FlxSidebarComponent, Tab } from '@fluxgate/components';

// Model
import { Car } from '@fluxgate/starter-common';
import { CarServiceRequests } from '../redux/car-service-requests';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent extends ServiceRequestsComponent<Car, CarServiceRequests> {
  protected static readonly logger = getLogger(CarListComponent);

  @ViewChild('sidebarmain') public sidebar: FlxSidebarComponent;

  public title: string = 'Carliste';
  public cars: Car[];
  public selectedCar: Car;

  public tabs: Tab[] = [
    {
      header: 'Bauteile',
      route: '.',
      status: 'active'
    },
    {
      header: 'Preise',
      route: '.',
      status: ''
    },
    {
      header: 'Händler',
      route: '.',
      status: ''
    }
  ];


  public fields: Field[] = [
    {
      fieldname: 'name',
      main: true
    },
    {
      fieldname: 'color',
      main: false
    }
  ];


  // Selektion
  // private selectedCar: Car;

  constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    serviceRequests: CarServiceRequests) {
    super(router, route, messageService, serviceRequests);


    this.serviceRequests.find().subscribe((items) => {
      const state = this.getState<IExtendedCrudServiceState<Car, number>>();

      const item = this.selectItem(items, state.currentItem);   // alte Selektion wiederherstellen

      this.onSelectedValueChange(item);
    });

  }


  public onSelectedValueChange(car: Car) {
    using(new XLog(CarListComponent.logger, levels.INFO, 'onSelectedValueChange'), (log) => {
      log.info(`car = ${JSON.stringify(car)}`);
      this.serviceRequests.setCurrent(car).subscribe((item) => {

        this.router.navigate(['/car', {
          outlets: {
            detail: ['car',
              this.selectedCar ? this.selectedCar.id : -1]
          }
        }]);
        // Sidebar wieder schließen (falls sie nicht gepinned war)
        this.sidebar.toggleSidebar();
      });
    });
  }

  public get selectedCarName(): string {
    return this.selectedCar ? this.selectedCar.name : null;
  }

  protected onStoreUpdated(command: ServiceCommand<Car>): void {
    super.onStoreUpdated(command);
    /**
     * ein Kommando für unseren Store?
     */
    if (command.storeId === this.storeId) {
      const state = this.getState<IExtendedCrudServiceState<Car, number>>();

      if (command instanceof ItemsFoundCommand || command instanceof ItemsQueriedCommand) {
        this.cars = [...state.items];
        this.selectedCar = state.currentItem;
      }

      if (command instanceof CurrentItemSetCommand) {
        this.selectedCar = state.currentItem;
      }

    }
  }

}