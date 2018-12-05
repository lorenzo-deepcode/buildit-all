import { URL } from 'url';
import * as srApi from '../sr-api';
import {
  wiproDigitalId as companyId,
  builditTrId as trId,
  builditCustomFieldId as customFieldId,
  builditCustomFieldValue as customFieldValueId,
} from '../constants';

const jobUuid = '22d904e8-27cd-41d6-b850-f03528167654';

describe('getJobAdUrl()', () => {
  test('Returns string', () => {
    const returnVal = srApi.getJobAdUrl(companyId, jobUuid);
    expect(typeof returnVal).toBe('string');
  });

  test('URL path contains companyId', () => {
    const url = new URL(srApi.getJobAdUrl(companyId, jobUuid));
    const path = url.pathname;
    expect(path).toEqual(expect.stringContaining(companyId));
  });

  test('URL path contains jobUuid', () => {
    const url = new URL(srApi.getJobAdUrl(companyId, jobUuid));
    const path = url.pathname;
    expect(path).toEqual(expect.stringContaining(jobUuid));
  });

  test('URL has no query string when no trId is set', () => {
    const returnVal = srApi.getJobAdUrl(companyId, jobUuid);
    const url = new URL(returnVal);
    expect(returnVal).not.toEqual(expect.stringContaining('?'));
    expect(url.search).toBe('');
  });

  test('URL has correct query string when trId is set', () => {
    const url = new URL(srApi.getJobAdUrl(companyId, jobUuid, trId));
    expect(url.searchParams.get('trid')).toBe(trId);
  });
});

describe('getJobPostingsData()', () => {
  test('returns promise that resolves to an array', async () => {
    const returnVal = await srApi.getJobPostingsData(companyId);
    expect(Array.isArray(returnVal)).toBe(true);
  });

  test('returns only jobs matching the customField ID & value, when set', async () => {
    const jobs = await srApi.getJobPostingsData(companyId, customFieldId, customFieldValueId);

    // Try to find a job that does NOT contain the custom field
    let nonMatchingJobFound = false;
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      // eslint-disable-next-line arrow-body-style
      const filteredFields = job.customField.filter((field) => {
        return field.fieldId === customFieldId && field.valueId === customFieldValueId;
      });
      if (filteredFields.length === 0) {
        nonMatchingJobFound = true;
        break;
      }
    }
    expect(nonMatchingJobFound).toBe(false);
  });
});
