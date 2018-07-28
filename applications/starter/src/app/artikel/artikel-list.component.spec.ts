/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';


import {
  BaseRequestOptions,
  ConnectionBackend,
  Http
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// PrimeNG
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { MessagesModule } from 'primeng/components/messages/messages';

import { AppConfigService } from '@fluxgate/client';

import { ArtikelListComponent } from '../artikel/artikel-list.component';

import { ArtikelServiceRequestsModule } from '../redux/artikel-service-requests';
import { ARTIKEL_SERVICE_FAKE_PROVIDER } from '../testing/artikel-service-fake';
import { ArtikelFilterPipe } from './artikel-filter.pipe';

class RouterStub {
  public navigateByUrl(url: string) { return url; }
}

describe('ArtikelListComponent', () => {
  const component: ArtikelListComponent = null;
  // let fixture: ComponentFixture<ArtikelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MessagesModule,
        DataTableModule,
        ArtikelServiceRequestsModule
      ],
      declarations: [ArtikelListComponent],
      providers: [
        AppConfigService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (
            backend: ConnectionBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        ArtikelFilterPipe,
        ARTIKEL_SERVICE_FAKE_PROVIDER,
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ArtikelListComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ArtikelListComponent);
    const app: ArtikelListComponent = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Artikelliste');
  }));

  // TODO: echte Tests ...
});
