// Angular
import { Injector } from '@angular/core';

// Fluxgate
import { TableMetadata } from '@fluxgate/common';

import {
  IControlDisplayInfo, MetadataDisplayInfoConfiguration, ReflectionDisplayInfoConfiguration
} from '../../../base/displayConfiguration';
import { MetadataService } from '../../services/metadata.service';
import { IAutoformConfig } from './autoformConfig.interface';


export class AutoformConfiguration {
  private dataTableConfigurator: MetadataDisplayInfoConfiguration;
  private reflectionConfigurator: ReflectionDisplayInfoConfiguration;

  constructor(tableMetadata: TableMetadata, metadataService: MetadataService, injector: Injector) {
    this.dataTableConfigurator = new MetadataDisplayInfoConfiguration(
      tableMetadata, metadataService, injector);
    this.reflectionConfigurator = new ReflectionDisplayInfoConfiguration();
  }

  public createConfig(item?: any): IAutoformConfig {
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


  public configureConfig(config: IAutoformConfig): void {
    this.dataTableConfigurator.configureConfig(config.columnInfos);
  }

}