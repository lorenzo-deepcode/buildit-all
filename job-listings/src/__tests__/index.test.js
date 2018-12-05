import * as JobListings from '../index';
import { getBuilditJobPostings } from '../buildit';

describe('fetch-job-listings public API', () => {
  test('contains getBuilditJobPostings() function', () => {
    expect(JobListings.getBuilditJobPostings).toBe(getBuilditJobPostings);
  });
});
