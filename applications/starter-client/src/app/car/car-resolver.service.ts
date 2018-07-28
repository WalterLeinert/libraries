import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { ResolverBase } from '@fluxgate/client';

// Model
import { Car } from '@fluxgate/starter-common';
import { CarServiceRequests } from '../redux//car-service-requests';



// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class CarResolver extends ResolverBase<Car, number> {

  constructor(serviceRequests: CarServiceRequests, router: Router) {
    super(serviceRequests, router, Number);
  }
}