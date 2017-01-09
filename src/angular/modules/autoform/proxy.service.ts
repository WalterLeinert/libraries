import { Injectable } from '@angular/core';

// Fluxgate
import { Service, IServiceBase, IServiceCrud } from '../../services';


/**
 * Proxy für REST-Api Services.
 * Delegiert service calls an den eigentlichen Service.
 */
@Injectable()
export class ProxyService implements IServiceCrud, IServiceBase {

    /**
     * der eigentliche Service
     */
    private service: Service<any, any>;

    /**
     * Setzt den eigentlichen Service
     */
    public proxyService(service: any) {
        this.service = service;
    }
    
    public create(item: any): any {
        return this.service.create(item);
    }

    public find(): any {
        return this.service.find();
    }

    public findById(id: any): any {
        return this.service.findById(id);
    }

    public delete(id: any): any {
        return this.service.delete(id);
    }

    public update(item: any): any {
        return this.service.update(item);
    }

    public getUrl(): string {
        return this.service.getUrl();
    }

    public getTopic(): string {
        return this.service.getTopic();
    }

    public getTopicPath(): string {
        return this.service.getTopicPath();
    }

     public getEntityId(item: any): any {
         return this.service.getEntityId(item);
     }

     public getModelClassName(): string {
         return this.service.getModelClassName();
     }
}