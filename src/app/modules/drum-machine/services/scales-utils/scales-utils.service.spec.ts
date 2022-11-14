import { TestBed } from '@angular/core/testing';

import { ScalesUtilsService } from './scales-utils.service';

describe('ScalesUtilsService', () => {
  let service: ScalesUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScalesUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
