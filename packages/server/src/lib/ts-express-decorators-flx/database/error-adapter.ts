import { Assert, Funktion, IException, ServerSystemException } from '@fluxgate/core';


/**
 * Default Adapter: erzeugt immer eine @see{ServerSystemException}
 */
export class ErrorAdapter {

  public createException(err: Error, message?: string): IException {
    return new ServerSystemException(message, err);
  }
}