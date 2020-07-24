import { TestBed } from '@angular/core/testing';

import { LocationTrackerService } from './location-tracker.service';

describe('LocationTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationTrackerService = TestBed.get(LocationTrackerService);
    expect(service).toBeTruthy();
  });
});
