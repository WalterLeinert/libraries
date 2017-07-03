import { InjectionToken } from 'injection-js';

import { ILogger } from './logger.interface';


/**
 * Token für dependency injection von Loggern
 */
export const LOGGER = new InjectionToken<ILogger>('logger');

export const DEFAULT_CATEGORY = new InjectionToken<ILogger>('default-category');