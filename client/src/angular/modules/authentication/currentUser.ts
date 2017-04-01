import { EventEmitter, Output } from '@angular/core';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------


import { CoreComponent } from '../../common/base';


/**
 * TODO: obsolete wegen CoreComponent.getCurrentUser etc.
 * abstrakte Basisklasse mit user-Property und change-detection
 * 
 * @export
 * @class CurrentUserBaseService
 */
export abstract class CurrentUser extends CoreComponent {

}