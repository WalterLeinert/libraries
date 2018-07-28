/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { MessageService, MetadataService, ServiceRequestsComponent } from '@fluxgate/client';
import { IExtendedCrudServiceState, ItemCreatedCommand, ItemUpdatedCommand, ServiceCommand } from '@fluxgate/common';

import { Car } from '@fluxgate/starter-common';
import { CarServiceRequests } from '../redux/car-service-requests';


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html'

})
export class CarDetailComponent extends ServiceRequestsComponent<Car, CarServiceRequests> {
  protected static readonly logger = getLogger(CarDetailComponent);

  public static CAR_DETAIL = 'Car Detail';
  public pageTitle: string = CarDetailComponent.CAR_DETAIL;
  public car: Car;

  constructor(private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService,
    private metadataService: MetadataService, serviceRequests: CarServiceRequests) {
    super(router, route, messageService, serviceRequests);

    this.car = this.buildFormFromModel<Car>(this.fb, Car, this.metadataService);
  }


  public ngOnInit(): void {
    using(new XLog(CarDetailComponent.logger, levels.INFO, 'ngOnInit'), (log) => {
      super.ngOnInit();

      this.registerSubscription(this.route.data
        .subscribe((data: { car: Car }) => {
          log.log(`department = ${JSON.stringify(data.car)}`);

          this.car = data.car;
        }));
    });
  }


  public submit() {
    if (this.car.id > 0) {
      this.serviceRequests.update(this.car).subscribe((item) => {
        // OK
      });
    } else {
      this.serviceRequests.create(this.car).subscribe((item) => {
        // OK
      });
    }
  }

  public confirmDelete() {
    super.confirmDelete('Car löschen', `Soll der Car wirklich gelöscht werden: ${this.car.name}?`,
      () => {
        this.serviceRequests.delete(this.car).subscribe((id) => {
          this.resetForm();
          this.navigateBack();
        });
      });
  }


  public cancel(): void {
    // this.navigateBack();
  }


  protected onStoreUpdated(command: ServiceCommand<Car>): void {
    super.onStoreUpdated(command);

    if (command.storeId === this.storeId) {
      const state = this.getState<IExtendedCrudServiceState<Car, number>>();

      if (command instanceof ItemUpdatedCommand || command instanceof ItemCreatedCommand) {
        this.serviceRequests.setCurrent(state.item);
      }
    }
  }

  private navigateBack() {
    this.navigate(['/car']);
  }
}