import { InjectionToken } from 'injection-js';

import { IStringifyer } from './stringifyer.interface';

/**
 * Token für dependency injection von Stringifyern
 */
export const STRINGIFYER = new InjectionToken<IStringifyer>('stringifyer');