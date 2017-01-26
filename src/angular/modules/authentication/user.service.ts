import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Fluxgate
import { User, IUser } from '@fluxgate/common';

import { Service, MetadataService } from '../../services';
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
     * Liefert den aktuell angemeldeten User.
     * 
     * @returns {Observable<User>}
     * 
     * @memberOf UserService
     */
    public getCurrentUser(): Observable<User> {
        throw Observable.throw(new Error(`Not implemented`));
    }
}