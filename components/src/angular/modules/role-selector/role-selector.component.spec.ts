import { CommonModule } from '@angular/common';
import { DebugElement, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_STORE_PROVIDER, AppInjector, ConfigService, MetadataService } from '@fluxgate/client';

import { RoleServiceFake } from '../../../../test/services/role-service-fake';
import { RoleSelectorServiceRequestsModule } from '../../redux/role-selector-service-requests';
import { MessageServiceModule } from '../../services/message.service';

import { RoleService } from '../authentication/role.service';
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
        MessageServiceModule,
        DropdownSelectorModule,
        RoleSelectorServiceRequestsModule
      ],
      declarations: [
        RoleSelectorComponent
      ],
      providers: [
        APP_STORE_PROVIDER,
        AppInjector,
        ConfigService,
        MetadataService,
        { provide: RoleService, useClass: RoleServiceFake }
      ]
    }).compileComponents();

    AppInjector.instance.setInjector(TestBed.get(Injector, Injector));

    fixture = TestBed.createComponent(RoleSelectorComponent);
    comp = fixture.debugElement.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));

});
