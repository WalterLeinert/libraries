// Fluxgate
import { Dictionary, IService, NotSupportedException } from '@fluxgate/common';

import { ProxyService } from './proxy.service';


/**
 * Cache für die find-Methode der REST-Api Services.
 */
export class CacheService extends ProxyService {

  private static modelCache: Dictionary<string, any[]> = new Dictionary<string, any[]>();

  constructor(service: IService) {
    super();
    this.proxyService(service);
  }

  public create(item: any): any {
    throw new NotSupportedException();
  }

  public find(): any {
    let items: any[];
    if (!CacheService.modelCache.containsKey(this.getModelClassName())) {
      items = super.find();
      CacheService.modelCache.set(this.getModelClassName(), items);
    }
    return items;
  }

  public findById(id: any): any {
    throw new NotSupportedException();
  }

  // readonly
  public delete(id: any): any {
    throw new NotSupportedException();
  }

  public update(item: any): any {
    throw new NotSupportedException();
  }

  // durchreichen an Proxy-Basisklasse
  public getUrl(): string {
    return super.getUrl();
  }

  public getTopic(): string {
    return super.getTopic();
  }

  public getTopicPath(): string {
    return super.getTopicPath();
  }

  public getEntityId(item: any): any {
    return super.getEntityId(item);
  }

  public setEntityId(item: any, id: any) {
    return super.setEntityId(item, id);
  }

  public getModelClassName(): string {
    return super.getModelClassName();
  }
}