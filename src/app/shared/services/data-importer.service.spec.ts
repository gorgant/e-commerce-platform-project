import { TestBed } from '@angular/core/testing';

import { DataImporterService } from './data-importer.service';

describe('DataImporterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataImporterService = TestBed.get(DataImporterService);
    expect(service).toBeTruthy();
  });
});
