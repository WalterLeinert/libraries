import { IControlDisplayInfo } from './';

export interface IDisplayInfoConfiguration {
  createConfig(item?: any): IControlDisplayInfo[];

  configureConfig(displayInfos: IControlDisplayInfo[]): void;
}