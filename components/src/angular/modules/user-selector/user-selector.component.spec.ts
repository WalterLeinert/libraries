import { CommonModule } from '@angular/common';
import { DebugElement, Injectable, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmationService } from 'primeng/components/common/api';

import {
  APP_STORE_PROVIDER, AppConfigService, AppInjector, ClientModule, CurrentUserService, MessageService,
  MetadataService
} from '@fluxgate/client';
import { ModuleMetadataStorage } from '@fluxgate/core';

import {
  ENTITY_VERSION_SERVICE_FAKE_PROVIDER, EntityVersionServiceFakeService
} from '../../../testing/entity-version-service-fake.service';
import { TestHelperModule } from '../../../testing/unit-test';
import { USER_SERVICE_FAKE_PROVIDER } from '../../../testing/user-service-fake.service';
import { UserSelectorServiceRequestsModule } from '../../redux/user-selector-service-requests';
import { DropdownSelectorModule } from '../dropdown-selector';
import { UserSelectorComponent } from './user-selector.component';


// ACHTUNG: Store muss als letztes eingezogen werden!
import { Store } from '@fluxgate/common';

export function createCommandStore(): Store {
  return new Store();
}


describe('UserSelectorComponent', () => {
  let comp: UserSelectorComponent;
  let fixture: ComponentFixture<UserSelectorComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        TestHelperModule,
        DropdownSelectorModule,
        UserSelectorServiceRequestsModule
      ],
      declarations: [
        UserSelectorComponent
      ],
      providers: [
        ConfirmationService,
        APP_STORE_PROVIDER,
        AppInjector,
        CurrentUserService,
        AppConfigService,
        MessageService,
        MetadataService,
        EntityVersionServiceFakeService,
        USER_SERVICE_FAKE_PROVIDER,
        ENTITY_VERSION_SERVICE_FAKE_PROVIDER
      ]
    }).compileComponents().then((reason) => {

      TestHelperModule.initialize();

      fixture = TestBed.createComponent(UserSelectorComponent);

      // helper = TestBed.get(Injector);
      //  console.log(helper.injector.displayName);

      comp = fixture.debugElement.componentInstance;
      de = fixture.debugElement;
      el = de.nativeElement;
      //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
    });

  }));

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));

});
