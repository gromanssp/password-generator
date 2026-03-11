import { TestBed } from '@angular/core/testing';

import { ToogleSignalService } from './toogle-signal.service';

describe('ToogleSignalService', () => {
  let service: ToogleSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToogleSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
