import { CommonModule } from '@angular/common';
import { DebugElement, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_STORE_PROVIDER, AppInjector, ConfigService, MetadataService } from '@fluxgate/client';

import { UserServiceFake } from '../../../testing/user-service-fake';
import { UserSelectorServiceRequestsModule } from '../../redux/user-selector-service-requests';
import { MessageService } from '../../services/message.service';
import { UserService } from '../authentication/user.service';
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
        DropdownSelectorModule,
        UserSelectorServiceRequestsModule
      ],
      declarations: [
        UserSelectorComponent
      ],
      providers: [
        APP_STORE_PROVIDER,
        AppInjector,
        ConfigService,
        MessageService,
        MetadataService,
        { provide: UserService, useClass: UserServiceFake }
      ]
    }).compileComponents();

    AppInjector.instance.setInjector(TestBed.get(Injector, Injector));

    fixture = TestBed.createComponent(UserSelectorComponent);
    comp = fixture.debugElement.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));

});
