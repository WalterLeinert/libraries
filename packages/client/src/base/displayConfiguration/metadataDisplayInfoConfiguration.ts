// Angular
import { Injector } from '@angular/core';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { ColumnMetadata, Store, TableMetadata } from '@fluxgate/common';
import { Assert, InvalidOperationException, Types } from '@fluxgate/core';

import { ControlType } from '../../angular/common/base/controlType';
import { APP_STORE } from '../../angular/redux/app-store';
import { MetadataService } from '../../angular/services/metadata.service';
import { ControlDisplayInfo } from './controlDisplayInfo';
import { IControlDisplayInfo } from './controlDisplayInfo.interface';
import { DataTypes } from './dataType';
import { DisplayInfoConfiguration } from './displayInfoConfiguration';
import { TextAlignments } from './textAlignment';

/**
 * Konfiguriert die DisplayInfos über die Metadaten.
 *
 * @export
 * @class MetadataDisplayInfoConfiguration
 * @extends {DisplayInfoConfiguration}
 */
export class MetadataDisplayInfoConfiguration extends DisplayInfoConfiguration {
  protected static readonly logger = getLogger(MetadataDisplayInfoConfiguration);

  constructor(protected tableMetadata: TableMetadata, private metadataService: MetadataService,
    private injector: Injector, private propertyNames?: string[]) {

    super();

    using(new XLog(DisplayInfoConfiguration.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`tableMetadata = ${this.tableMetadata ? this.tableMetadata.className : 'undefined'}`);
    });
  }


  protected onConfigureDisplayInfo(displayInfo: IControlDisplayInfo) {
    using(new XLog(MetadataDisplayInfoConfiguration.logger, levels.INFO, 'onConfigureDisplayInfo'), (log) => {
      super.onConfigureDisplayInfo(displayInfo);

      Assert.notNull(this.tableMetadata);

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

      displayInfo.required = !colMetaData.options.nullable;

      // ist die Spalte mit @Secret annotiert?
      displayInfo.isSecret = this.isSecretColumn(colMetaData);

      displayInfo.controlType = DataTypes.mapDataTypeToControlType(displayInfo.dataType);

      if (colMetaData.enumMetadata) {
        if (!displayInfo.enumInfo) {

          const enumTableMetadata = this.metadataService.findTableMetadata(colMetaData.enumMetadata.dataSource);
          const store = this.injector.get(APP_STORE) as Store;

          displayInfo.enumInfo = {
            selectorDataServiceRequests: enumTableMetadata.getServiceRequestsInstance(this.injector, store),
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

    const propertyNames = new Set<string>(this.propertyNames);

    for (const metaData of this.tableMetadata.columnMetadata) {

      //
      // falls propertyNames angegeben sind, dürfen wir nur die entsprechenden Metadaten verwenden
      //
      if (propertyNames.size > 0 && !propertyNames.has(metaData.propertyName)) {
        continue;
      }

      //
      // nur DisplayInfo generieren, falls hidden nicht gesetzt ist
      //
      if (!metaData.options.hidden) {
        let dataType = DataTypes.mapColumnTypeToDataType(metaData.propertyType);
        let enumInfo;

        if (metaData.enumMetadata) {
          dataType = DataTypes.ENUM;

          const enumTableMetadata = this.metadataService.findTableMetadata(metaData.enumMetadata.dataSource);
          const store = this.injector.get(APP_STORE) as Store;

          enumInfo = {
            selectorDataServiceRequests: enumTableMetadata.getServiceRequestsInstance(this.injector, store),
            textField: metaData.enumMetadata.textField,
            valueField: metaData.enumMetadata.valueField
          };
        }

        columnInfos.push(
          new ControlDisplayInfo(
            {
              textField: metaData.options.displayName,
              valueField: metaData.propertyName,
              editable: metaData.options.persisted,
              required: !metaData.options.nullable,
              dataType: dataType,
              style: undefined,
              textAlignment: (ControlDisplayInfo.isRightAligned(dataType)) ? TextAlignments.RIGHT : TextAlignments.LEFT,
              isSecret: this.isSecretColumn(metaData),
              controlType: DataTypes.mapDataTypeToControlType(dataType),
              enumInfo: enumInfo
            }
          )
        );
      }
    }

    return columnInfos;
  }

  private isSecretColumn(colMetadata: ColumnMetadata): boolean {
    const secretColumn = this.tableMetadata.getSecretColumn(colMetadata.propertyName);
    return Types.isPresent(secretColumn);
  }
}