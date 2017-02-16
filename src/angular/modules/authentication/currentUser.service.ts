import { EventEmitter, Injectable, NgModule, Output } from '@angular/core';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { IUser } from '@fluxgate/common';

import { CurrentUserBaseService } from './currentUserBaseService';
import { PassportService } from './passport.service';


/**
 * Service, der mittels @see {PassportService} Benutzeran- und abmeldungen überwacht und den 
 * aktuellen User über die Property @see{user} liefert. 
 * Mit Hilfe des Events @see{userChange} kann man sich auf entsprechende Änderungen registrieren. 
 * 
 * @export
 * @class CurrentUserService
 * @extends {CurrentUserBaseService}
 */
@Injectable()
export class CurrentUserService extends CurrentUserBaseService {
 
    constructor(passportService: PassportService) {
        super(passportService);
    }
}