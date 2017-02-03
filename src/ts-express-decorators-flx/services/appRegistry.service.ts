import { Service } from 'ts-express-decorators';

// fluxgate
import { AppRegistry } from '@fluxgate/common';

/**
 * Service für den Zugriff auf die @see{AppRegistry}
 */
@Service()
export class AppRegistryService {

  /**
   * Liefertfür den angegebenen Key @param{key} die Dateninstanz vom Typ {T}
   * 
   * @param {string} key
   * @returns {T}
   * 
   * @memberOf MetadataService
   */
  public get<T>(key: string): T {
    return AppRegistry.instance.get<T>(key);
  }
}