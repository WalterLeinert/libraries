import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { ConfigService, MetadataService, Service } from '@fluxgate/client';
import { TableService, UpdateResult, User } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{User}.
 *
 * @export
 * @class UserService
 * @extends {Service<User>}
 */
@Injectable()
@TableService(User)
export class UserService extends Service<User, number> {

  constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
    super(User, metadataService, http, configService);
  }
}