import { TestBed } from '@angular/core/testing';

import { MyLib2Service } from './my-lib2.service';

describe('MyLib2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyLib2Service = TestBed.get(MyLib2Service);
    expect(service).toBeTruthy();
  });
});
