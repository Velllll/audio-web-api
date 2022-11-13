import { TestBed } from '@angular/core/testing';

import { ScreenControlService } from './screen-control.service';

describe('ScreenControlService', () => {
  let service: ScreenControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
