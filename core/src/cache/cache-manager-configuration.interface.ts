import { Funktion } from '../base/objectType';
import { CacheType } from './cache-type';


/**
 * Basiskonfiguration
 */
export interface ICacheConfigurationBase {

  /**
   * Der Typ des Caches (z.Zt. nur LRU)
   */
  cacheType?: CacheType;

  /**
   * Cache-Implementierungsabhängige Optionen
   */
  options?: any;
}


/**
 * Konfigurationsabschnitt für eine Entity (model)
 */
export interface ICacheConfigurationEntry extends ICacheConfigurationBase {
  /**
   * Der Name der zu cachenden Entity
   */
  model: string | Funktion;
}


/**
 * Die CacheManager Konfiguration
 */
export interface ICacheManagerConfiguration {
  /**
   * Defaults für alle Caches
   */
  default?: ICacheConfigurationBase;

  /**
   * Konfiguration der einzelnen Caches.
   */
  configurations: ICacheConfigurationEntry[];
}