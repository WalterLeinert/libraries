/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ConfirmationService } from 'primeng/components/common/api';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';


import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const confirmationServiceStub = {
    confirm(messageInfo) {
      // tslint:disable-next-line:no-console
      console.log('confirm');
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ConfirmDialogModule
      ],
      providers: [
        { provide: ConfirmationService, useValue: confirmationServiceStub }
      ],
      declarations: [HomeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // let confirmationService = TestBed.get(ConfirmationService);
  });

  it('should inject...', inject([ConfirmationService], (service: ConfirmationService) => {
    expect(service).toBeTruthy();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm', () => {
    // TODO: korrektes Testen von confirm über den confirmationServiceStub
    component.confirm();
  });
});
