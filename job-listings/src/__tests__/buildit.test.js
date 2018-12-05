import * as builditApi from '../buildit';
import { builditTrId } from '../constants';

describe('getBuilditJobPostings()', () => {
  test('all returned JobPosting objects have the correct tracking ID', async () => {
    const jobs = await builditApi.getBuilditJobPostings();

    // Try to find a job that does NOT contain the custom field
    // Try to find a job that does NOT have the trId set
    let nonMatchingTrIdFound = false;
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      if (job.trId !== builditTrId) {
        nonMatchingTrIdFound = true;
        break;
      }
    }
    expect(nonMatchingTrIdFound).toBe(false);
  });
});
