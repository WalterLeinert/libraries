import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';
import { TableService, User } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{User}.
 */
@Injectable()
@TableService(User)
export class UserService extends Service<User, number> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService) {
    super(User, metadataService, http, configService);
  }
}