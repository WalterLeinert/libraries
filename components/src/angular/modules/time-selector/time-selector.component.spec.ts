import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG
import { CalendarModule } from 'primeng/components/calendar/calendar';

import { AppInjector } from '@fluxgate/client';
import { ShortTime } from '@fluxgate/core';

import { MessageServiceModule } from '../../services/message.service';
import { TimeSelectorComponent } from './time-selector.component';

// ACHTUNG: Store muss als letztes eingezogen werden!
import { Store } from '@fluxgate/common';

const store = new Store();
AppInjector.instance.setTestStore(store);


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
        CalendarModule,
        MessageServiceModule
      ],
      declarations: [
        TimeSelectorComponent
      ],
      providers: [
        AppInjector
      ]
    }).compileComponents();

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
