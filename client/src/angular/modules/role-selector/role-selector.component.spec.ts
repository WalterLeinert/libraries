import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { RoleServiceFake } from '../../../../test/services/role-service-fake';
import { AppStore } from '../../redux/app-store';
import { RoleSelectorServiceRequestsModule } from '../../redux/role-selector-service-requests';
import { AppInjector } from '../../services/appInjector.service';
import { ConfigService } from '../../services/config.service';
import { MessageServiceModule } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
import { RoleService } from '../authentication/role.service';
import { DropdownSelectorModule } from '../dropdown-selector';
import { RoleSelectorComponent } from './role-selector.component';


// ACHTUNG: Store muss als letztes eingezogen werden!
import { Store } from '@fluxgate/common';

export function createCommandStore(): Store {
  return new Store();
}


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
        {
          provide: AppStore, useFactory: createCommandStore
        },
        AppInjector,
        ConfigService,
        MetadataService,
        { provide: RoleService, useClass: RoleServiceFake }
      ]
    }).compileComponents();

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
