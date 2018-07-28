/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ArtikelService } from './';

describe('ArtikelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtikelService]
    });
  });

  it('should ...', inject([ArtikelService], (service: ArtikelService) => {
    expect(service).toBeTruthy();
  }));
});
