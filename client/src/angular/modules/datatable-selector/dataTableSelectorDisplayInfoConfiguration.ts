// Angular
import { Injector } from '@angular/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { TableMetadata } from '@fluxgate/common';

import {
  IControlDisplayInfo, IRowDisplayInfo, MetadataDisplayInfoConfiguration
} from '../../../base/displayConfiguration';
import { MetadataService } from '../../services';


/**
 * * Konfiguriert die DisplayInfos für @see{DataTableSelectorComponent}
 * 
 * @export
 * @class DataTableSelectorDisplayInfoConfiguration
 * @extends {MetadataDisplayInfoConfiguration}
 */
export class DataTableSelectorDisplayInfoConfiguration extends MetadataDisplayInfoConfiguration {
  protected static readonly logger = getLogger(DataTableSelectorDisplayInfoConfiguration);

  private rowInfo?: IRowDisplayInfo;

  constructor(tableMetadata: TableMetadata, metadataService: MetadataService, injector: Injector) {
    super(tableMetadata, metadataService, injector);
  }

  public setRowInfo(rowInfo?: IRowDisplayInfo) {
    this.rowInfo = rowInfo;
  }

  protected onConfigureDisplayInfo(colInfo: IControlDisplayInfo) {
    using(new XLog(MetadataDisplayInfoConfiguration.logger, levels.INFO, 'onConfigureDisplayInfo'), (log) => {
      if (!this.tableMetadata) {
        return;
      }

      super.onConfigureDisplayInfo(colInfo);

      //
      // Defaults/RowInfo übernehmen
      //
      if (colInfo.editable === undefined) {
        // Row-Konfiguration übernehmen
        if (this.rowInfo !== undefined && this.rowInfo.editable !== undefined) {
          colInfo.editable = this.rowInfo.editable;
        }
      }

      if (colInfo.color === undefined) {
        // Row-Konfiguration übernehmen
        if (this.rowInfo !== undefined && this.rowInfo.color !== undefined) {
          colInfo.color = this.rowInfo.color;
        }
      }

    });
  }

}