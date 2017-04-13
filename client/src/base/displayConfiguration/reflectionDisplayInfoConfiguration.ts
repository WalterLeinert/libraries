// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { Assert } from '@fluxgate/common';

import { ControlDisplayInfo } from './controlDisplayInfo';
import { IControlDisplayInfo } from './controlDisplayInfo.interface';
import { DisplayInfoConfiguration } from './displayInfoConfiguration';


/**
 * Konfiguriert die DisplayInfos über Reflection.
 *
 * @export
 * @class ReflectionDisplayInfoConfiguration
 * @extends {DisplayInfoConfiguration}
 */
export class ReflectionDisplayInfoConfiguration extends DisplayInfoConfiguration {
  protected static readonly logger = getLogger(ReflectionDisplayInfoConfiguration);


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über Reflection erzeugt
   *
   * @private
   *
   * @memberOf DataTableSelectorComponent
   */
  protected createDisplayInfos(item: any): IControlDisplayInfo[] {
    return using(new XLog(ReflectionDisplayInfoConfiguration.logger, levels.INFO, 'createDisplayInfos'), (log) => {
      Assert.notNull(item);

      const columnInfos: IControlDisplayInfo[] = [];

      // alle Properties des ersten Items über Reflection ermitteln
      const props = Reflect.ownKeys(item);

      // ... und dann entsprechende ColumnInfos erzeugen
      for (const propName of props) {
        columnInfos.push(
          new ControlDisplayInfo(
            {
              textField: propName.toString(),
              valueField: propName.toString()
            }
          )
        );
      }

      return columnInfos;
    });
  }

}