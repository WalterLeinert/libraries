import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


// Fluxgate
import { Role } from '@fluxgate/common';

import { Service, MetadataService } from '../../services';
import { ConfigService } from '../../services/config.service';


/**
 * Service für REST-Api für Entity @see{Role}.
 * 
 * @export
 * @class RoleService
 * @extends {Service<Artikel>}
 */
@Injectable()
export class RoleService extends Service<Role> {

    constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
        super(Role, metadataService, http, configService);
    }
}