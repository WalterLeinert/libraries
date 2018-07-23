// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { Assert, Core } from '@fluxgate/core';

import { ControlDisplayInfo } from './controlDisplayInfo';
import { IControlDisplayInfo } from './controlDisplayInfo.interface';
import { IDisplayInfoConfiguration } from './displayInfoConfiguration.interface';
import { TextAlignments } from './textAlignment';


/**
 * Basisklasse für die Konfiguration der DisplayInfos.
 */
export abstract class DisplayInfoConfiguration implements IDisplayInfoConfiguration {
  protected static readonly logger = getLogger(DisplayInfoConfiguration);

  /**
   * Erzeugt neue DisplayInfos
   *
   * @param [item] - muss angegeben sein, falls die Infos über Reflection erzeugt werden müssen.
   * @returns
   */
  public createConfig(item?: any): IControlDisplayInfo[] {
    return this.setupConfig(undefined, item);
  }

  /**
   * Konfiguriert existierende DisplayInfos
   *
   * @param displayInfos
   * @returns
   */
  public configureConfig(displayInfos: IControlDisplayInfo[]): void {
    this.setupConfig(displayInfos);
  }


  protected abstract createDisplayInfos(item?: any): IControlDisplayInfo[];


  protected onConfigureDisplayInfo(colInfo: IControlDisplayInfo) {
    // ok
  }



  /**
   * setzt die komplette DisplayInfo-Konfiguration auf
   *
   * @param [displayInfos]
   * @param [item]
   * @returns
   */
  private setupConfig(displayInfos?: IControlDisplayInfo[], item?: any): IControlDisplayInfo[] {
    return using(new XLog(DisplayInfoConfiguration.logger, levels.DEBUG, 'setupConfig'), (log) => {
      if (log.isDebugEnabled()) {
        log.log(`item = ${item ? Core.stringify(item) : 'undefined'}`);
      }

      if (displayInfos) {
        //
        // Konfiguration erweitern/anpassen
        //
        for (const colInfo of displayInfos) {
          this.configureDisplayInfo(colInfo);
        }

      } else {
        displayInfos = this.createDisplayInfos(item);
      }

      if (log.isDebugEnabled()) {
        log.log(`displayInfos : ${Core.stringify(displayInfos)}`);
      }

      return displayInfos;
    });
  }


  /**
   * Konfiguriert ein DisplayInfo
   *
   * @param colInfo
   */
  private configureDisplayInfo(displayInfo: IControlDisplayInfo) {
    Assert.notNull(displayInfo);

    //
    // Defaults/RowInfo übernehmen
    //
    if (displayInfo.editable === undefined) {
      displayInfo.editable = ControlDisplayInfo.DEFAULT.editable;
    }

    if (displayInfo.color === undefined) {
      displayInfo.color = ControlDisplayInfo.DEFAULT.color;
    }

    this.onConfigureDisplayInfo(displayInfo);


    if (!displayInfo.textAlignment && ControlDisplayInfo.isRightAligned(displayInfo.dataType)) {
      displayInfo.textAlignment = TextAlignments.RIGHT;
    }

    if (displayInfo.controlType === undefined) {
      displayInfo.controlType = ControlDisplayInfo.DEFAULT.controlType;
    }

  }
}