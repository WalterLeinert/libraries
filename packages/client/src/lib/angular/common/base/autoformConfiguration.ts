// Angular
import { Injector } from '@angular/core';

// Fluxgate
import { TableMetadata } from '@fluxgate/common';

import {
  IControlDisplayInfo, MetadataDisplayInfoConfiguration, ReflectionDisplayInfoConfiguration
} from '../../../base/displayConfiguration';
import { MetadataService } from '../../services/metadata.service';


export class AutoformConfiguration {
  private dataTableConfigurator: MetadataDisplayInfoConfiguration;
  private reflectionConfigurator: ReflectionDisplayInfoConfiguration;

  constructor(tableMetadata: TableMetadata, metadataService: MetadataService, injector: Injector) {
    this.dataTableConfigurator = new MetadataDisplayInfoConfiguration(
      tableMetadata, metadataService, injector);
    this.reflectionConfigurator = new ReflectionDisplayInfoConfiguration();
  }

  public createConfig(item?: any): IControlDisplayInfo[] {
    let displayInfos: IControlDisplayInfo[];

    if (item === undefined) {
      displayInfos = this.dataTableConfigurator.createConfig(item);
    } else {
      displayInfos = this.reflectionConfigurator.createConfig(item);
    }

    return displayInfos;
  }


  public configureConfig(displayInfos: IControlDisplayInfo[]): void {
    this.dataTableConfigurator.configureConfig(displayInfos);
  }

}