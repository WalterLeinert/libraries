import { Injectable } from '@angular/core';

import { RoleServiceFake } from '@fluxgate/common';

import { RoleService } from '../angular/redux/role.service';
import { EntityVersionServiceFakeService } from './entity-version-service-fake.service';


/**
 * Simuliert den Role-Service
 */
@Injectable()
export class RoleServiceFakeService extends RoleServiceFake {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(entityVersionServiceFake: EntityVersionServiceFakeService) {
    super(entityVersionServiceFake);
  }
}

export const ROLE_SERVICE_FAKE_PROVIDER = { provide: RoleService, useClass: RoleServiceFakeService };