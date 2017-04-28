import { DebugElement, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { ConfirmationService } from 'primeng/components/common/api';

import { APP_STORE_PROVIDER, AppInjector } from '@fluxgate/client';
import { ShortTime } from '@fluxgate/core';

import { MessageService } from '../../services/message.service';
import { TimeSelectorComponent } from './time-selector.component';


describe('TimeSelectorComponent', () => {
  let comp: TimeSelectorComponent;
  let fixture: ComponentFixture<TimeSelectorComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        CalendarModule
      ],
      declarations: [
        TimeSelectorComponent
      ],
      providers: [
        ConfirmationService,
        APP_STORE_PROVIDER,
        AppInjector,
        MessageService
      ]
    }).compileComponents();

    AppInjector.instance.setInjector(TestBed.get(Injector, Injector));

    fixture = TestBed.createComponent(TimeSelectorComponent);
    comp = fixture.debugElement.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));


  it('should render the shorttime', async(() => {
    comp.value = new ShortTime(10, 15);

    fixture.detectChanges();

    expect(comp.date).toBeTruthy();
    expect(comp.date.getHours()).toEqual(10);
    expect(comp.date.getMinutes()).toEqual(15);

    // const input = el.querySelector('p-calendar > span > input');

    // expect(input.textContent).toContain('app works!');
  }));
});
