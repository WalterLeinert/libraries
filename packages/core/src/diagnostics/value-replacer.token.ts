import { InjectionToken } from 'injection-js';

import { IValueReplacer } from './value-replacer.interface';


/**
 * Token für dependency injection von value replacern
 */
export const VALUE_REPLACER = new InjectionToken<IValueReplacer>('value-replacer');