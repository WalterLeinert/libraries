import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { ResolverBase } from '@fluxgate/client';

// Model
import { Artikel } from '@fluxgate/starter-common';
import { ArtikelServiceRequests } from '../redux/artikel-service-requests';



// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class ArtikelResolver extends ResolverBase<Artikel, number> {

  constructor(serviceRequests: ArtikelServiceRequests, router: Router) {
    super(serviceRequests, router, Number);
  }
}