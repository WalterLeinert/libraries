// Angular
import { Injector } from '@angular/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { Assert, InvalidOperationException, TableMetadata } from '@fluxgate/common';

import { ControlType } from '../../angular/modules/common';
import { MetadataService } from '../../angular/services';
import { ControlDisplayInfo, DataTypes, IControlDisplayInfo, TextAlignments } from './';
import { DisplayInfoConfiguration } from './displayInfoConfiguration';

/**
 * Konfiguriert die DisplayInfos über die Metadaten.
 * 
 * @export
 * @class MetadataDisplayInfoConfiguration
 * @extends {DisplayInfoConfiguration}
 */
export class MetadataDisplayInfoConfiguration extends DisplayInfoConfiguration {
  protected static readonly logger = getLogger(MetadataDisplayInfoConfiguration);

  constructor(private tableMetadata: TableMetadata, private metadataService: MetadataService,
    private injector: Injector) {

    super();
    Assert.notNull(tableMetadata);

    using(new XLog(DisplayInfoConfiguration.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`tableMetadata = ${this.tableMetadata.className}`);
    });
  }


  protected onConfigureDisplayInfo(displayInfo: IControlDisplayInfo) {
    using(new XLog(MetadataDisplayInfoConfiguration.logger, levels.INFO, 'onConfigureDisplayInfo'), (log) => {
      super.onConfigureDisplayInfo(displayInfo);

      const colMetaData = this.tableMetadata.getColumnMetadataByProperty(displayInfo.valueField);

      if (!colMetaData) {
        // Konfigurationsfehler?
        throw new InvalidOperationException(`Modelclass ${this.tableMetadata.className}:` +
          ` unknown property ${displayInfo.valueField}`);
      }


      if (displayInfo.dataType === undefined) {
        displayInfo.dataType = DataTypes.mapColumnTypeToDataType(colMetaData.propertyType);
      }

      // berechnete Spalten sind nicht editierbar
      if (displayInfo.editable !== undefined && displayInfo.editable && !colMetaData.options.persisted) {
        log.warn(`Spalte ${this.tableMetadata.className}.${colMetaData.propertyName}` +
          ` ist nicht editierbar (berechneter Wert)`);
      }
      displayInfo.editable = colMetaData.options.persisted;

      if (displayInfo.dataType === DataTypes.DATE) {
        displayInfo.controlType = ControlType.Date;
      } else if (displayInfo.dataType === DataTypes.TIME) {
        displayInfo.controlType = ControlType.Time;
      }

      if (colMetaData.enumMetadata) {
        if (!displayInfo.enumInfo) {

          const enumTableMetadata = this.metadataService.findTableMetadata(colMetaData.enumMetadata.dataSource);
          displayInfo.enumInfo = {
            selectorDataService: enumTableMetadata.getServiceInstance(this.injector),
            textField: colMetaData.enumMetadata.textField,
            valueField: colMetaData.enumMetadata.valueField
          };

          displayInfo.controlType = ControlType.DropdownSelector;
        }
      }

    });
  }

  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  protected createDisplayInfos(): IControlDisplayInfo[] {
    const columnInfos: IControlDisplayInfo[] = [];

    for (const metaData of this.tableMetadata.columnMetadata) {
      if (metaData.options.displayName) {
        const dataType = DataTypes.mapColumnTypeToDataType(metaData.propertyType);
        columnInfos.push(
          new ControlDisplayInfo(
            {
              textField: metaData.options.displayName,
              valueField: metaData.propertyName,
              dataType: dataType,
              style: undefined,
              textAlignment: (ControlDisplayInfo.isRightAligned(dataType)) ? TextAlignments.RIGHT : TextAlignments.LEFT,
              controlType: ControlType.Input
            }
          )
        );
      }
    }

    return columnInfos;
  }
}