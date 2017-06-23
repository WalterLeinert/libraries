import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';
import { TableService, User } from '@fluxgate/common';


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

  constructor(metadataService: MetadataService, http: Http, configService: AppConfigService) {
    super(User, metadataService, http, configService);
  }
}