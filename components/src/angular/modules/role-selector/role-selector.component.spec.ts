import { CommonModule } from '@angular/common';
import { DebugElement, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmationService } from 'primeng/components/common/api';

import { APP_STORE_PROVIDER, AppInjector, ClientModule, CurrentUserService } from '@fluxgate/client';
import { ModuleMetadataStorage } from '@fluxgate/core';

import {
  ENTITY_VERSION_SERVICE_FAKE_PROVIDER, EntityVersionServiceFakeService
} from '../../../testing/entity-version-service-fake.service';
import { ROLE_SERVICE_FAKE_PROVIDER } from '../../../testing/role-service-fake.service';
import { TestHelperModule } from '../../../testing/unit-test';
import { RoleSelectorServiceRequestsModule } from '../../redux/role-selector-service-requests';
import { DropdownSelectorModule } from '../dropdown-selector';
import { RoleSelectorComponent } from './role-selector.component';


describe('RoleSelectorComponent', () => {
  let comp: RoleSelectorComponent;
  let fixture: ComponentFixture<RoleSelectorComponent>;
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
        RoleSelectorServiceRequestsModule
      ],
      declarations: [
        RoleSelectorComponent
      ],
      providers: [
        APP_STORE_PROVIDER,
        AppInjector,
        CurrentUserService,
        ConfirmationService,
        EntityVersionServiceFakeService,
        ROLE_SERVICE_FAKE_PROVIDER,
        ENTITY_VERSION_SERVICE_FAKE_PROVIDER
      ]
    }).compileComponents().then((reason) => {

      TestHelperModule.initialize();

      fixture = TestBed.createComponent(RoleSelectorComponent);
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
