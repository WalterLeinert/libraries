import { StringBuilder } from '../base/stringBuilder';
import { Types } from '../types';
import { Core } from './core';
import { XLogInternal } from './xlog-internal';


/**
 * Logger for method entry, exit and arbitrary logs based on
 * the disposable pattern.
 *
 *
 */
export class XLog extends XLogInternal {

  protected extractErrorMessage(message: string | Error): string {
    const sb = new StringBuilder();

    if (!Types.isString(message)) {
      const err = message as Error;

      sb.append(Core.stringify(err));
      sb.append(err.stack);

      message = sb.toString();
    } else {
      sb.append(message.toString());
    }

    return sb.toString();
  }

}