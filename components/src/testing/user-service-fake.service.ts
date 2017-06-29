import { Injectable } from '@angular/core';


import { UserServiceFake } from '@fluxgate/common';

import { UserService } from '../angular/redux/user.service';
import { EntityVersionServiceFakeService } from './entity-version-service-fake.service';


/**
 * Simuliert den User-Service
 *
 * @export
 * @class UserServiceFake
 * extends {ServiceFake<IUser, number>}
 */
@Injectable()
export class UserServiceFakeService extends UserServiceFake {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(entityVersionServiceFake: EntityVersionServiceFakeService) {
    super(entityVersionServiceFake);
  }
}

export const USER_SERVICE_FAKE_PROVIDER = { provide: UserService, useClass: UserServiceFakeService };