import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent as FlxTabComponent } from './tab.component';
import { TabModule } from './tab.module';

describe('TabComponent', () => {
  let component: FlxTabComponent;
  let fixture: ComponentFixture<FlxTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TabModule
      ],
      declarations: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlxTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
