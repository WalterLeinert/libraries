// Angular
import { Injector } from '@angular/core';

// Fluxgate
import { TableMetadata } from '@fluxgate/common';

import {
  IControlDisplayInfo, ReflectionDisplayInfoConfiguration
} from '../../../base/displayConfiguration';
import { MetadataService } from '../../services/metadata.service';
import { IDataTableSelectorConfig } from './datatable-selectorConfig.interface';
import { DataTableSelectorDisplayInfoConfiguration } from './dataTableSelectorDisplayInfoConfiguration';


export class DataTableSelectorConfiguration {
  private dataTableConfigurator: DataTableSelectorDisplayInfoConfiguration;
  private reflectionConfigurator: ReflectionDisplayInfoConfiguration;

  constructor(tableMetadata: TableMetadata, metadataService: MetadataService, injector: Injector) {
    this.dataTableConfigurator = new DataTableSelectorDisplayInfoConfiguration(
      tableMetadata, metadataService, injector);
    this.reflectionConfigurator = new ReflectionDisplayInfoConfiguration();
  }

  public createConfig(item?: any): IDataTableSelectorConfig {
    let displayInfos: IControlDisplayInfo[];

    if (item === undefined) {
      displayInfos = this.dataTableConfigurator.createConfig(item);
    } else {
      displayInfos = this.reflectionConfigurator.createConfig(item);
    }

    return {
      columnInfos: displayInfos
    };
  }


  public configureConfig(config: IDataTableSelectorConfig): void {
    this.dataTableConfigurator.setRowInfo(config.rowInfo);
    this.dataTableConfigurator.configureConfig(config.columnInfos);
  }

}