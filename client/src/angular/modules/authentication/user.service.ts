import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// Fluxgate
import { User } from '@fluxgate/common';

import { MetadataService, Service } from '../../services';
import { ConfigService } from '../../services/config.service';


/**
 * Service für REST-Api für Entity @see{User}.
 *
 * @export
 * @class UserService
 * @extends {Service<User>}
 */
@Injectable()
export class UserService extends Service<User, number> {

  constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
    super(User, metadataService, http, configService);
  }


  /**
   * Markiert den User als deleted und führt einen Update in der DB durch.
   *
   * @param user
   */
  public setDeleted(user: User): Observable<User> {
    user.deleted = true;
    return super.update(user);
  }
}