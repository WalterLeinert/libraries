// tslint:disable:max-classes-per-file

import { Service } from 'ts-express-decorators';

import { BaseService, KnexService, MetadataService } from '@fluxgate/server';

import { Artikel, Car } from '@fluxgate/starter-common';


@Service()
export class ArtikelService extends BaseService<Artikel, number> {
  constructor(knexService: KnexService, metadataService: MetadataService) {
    super(Artikel, knexService, metadataService);
  }
}


@Service()
export class CarService extends BaseService<Car, number> {
  constructor(knexService: KnexService, metadataService: MetadataService) {
    super(Car, knexService, metadataService);
  }
}
