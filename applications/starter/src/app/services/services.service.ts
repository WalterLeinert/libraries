// tslint:disable:max-classes-per-file

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';

// DB-Model
import { Artikel, Car } from '@fluxgate/starter-common';

/**
 * Service für REST-Api für Entity @see{Artikel}.
 *
 * @export
 * @class ArtikelService
 * @extends {Service<Artikel>}
 */
@Injectable()
export class ArtikelService extends Service<Artikel, number> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService) {
    super(Artikel, metadataService, http, configService);
  }
}


/**
 * Service für REST-Api für Entity @see{Car}.
 *
 * @export
 * @class CarService
 * @extends {Service<Car>}
 */
@Injectable()
export class CarService extends Service<Car, number> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService) {
    super(Car, metadataService, http, configService);
  }
}