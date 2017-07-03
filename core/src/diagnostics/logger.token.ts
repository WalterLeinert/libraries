import { InjectionToken } from 'injection-js';

import { ILogger } from './logger.interface';


/**
 * Token für dependency injection von Loggern
 */
export const LOGGER = new InjectionToken<ILogger>('logger');


/**
 * Token für die default logger Kategorie
 */
export const DEFAULT_CATEGORY = new InjectionToken<ILogger>('default-category');


/**
 * Token zur Steuerung, ob Exceptions gelogged werden sollen
 */
export const LOG_EXCEPTIONS = new InjectionToken<boolean>('log-exceptions');