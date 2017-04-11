import { async, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';

import { Store } from '@fluxgate/common';
import { AppInjector } from '../../services/appInjector.service';
import { MessageServiceModule } from '../../services/message.service';

import { TimeSelectorComponent } from './time-selector.component';

AppInjector.instance.setTestStore(new Store());


describe('TimeSelectorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CalendarModule,
        MessageServiceModule
      ],
      declarations: [
        TimeSelectorComponent
      ],
      providers: [
        // {
        //   provide: AppStore, useFactory: createCommandStore
        // },
        AppInjector
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(TimeSelectorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(TimeSelectorComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   app.value = new ShortTime(10, 15);
  //   expect(app.title).toEqual('app works!');
  // }));


  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
