import JobPosting, { getJobPostings } from '../job-posting';
import { getJobAdUrl } from '../sr-api';
import {
  builditTrId as trId,
  countryCodes,
  wiproDigitalId as companyId,
} from '../constants';

const srPostingData = {
  id: '743999665860002',
  name: 'Software Engineer',
  uuid: 'ed5de06d-de5f-4643-a167-1f493ed5f982',
  refNumber: 'REF19T',
  company: {
    identifier: 'WiproDigital',
    name: 'Wipro Digital',
  },
  releasedDate: '2018-02-09T12:12:31.000Z',
  location: {
    city: 'Dublin',
    region: 'County Dublin',
    country: 'ie',
  },
  industry: {
    id: 'it_and_services',
    label: 'Information Technology And Services',
  },
  department: {
    id: '921900',
    label: 'Buildit Platform Engineering',
  },
  function: {
    id: 'information_technology',
    label: 'Information Technology',
  },
  typeOfEmployment: {
    label: 'Full-time',
  },
  experienceLevel: {
    id: 'mid_senior_level',
    label: 'Mid-Senior Level',
  },
  customField: [
    {
      fieldId: '5880c55be4b0cfde272956ad',
      fieldLabel: 'Brands',
      valueId: '83455af9-c888-4221-9312-4750b5a09bf5',
      valueLabel: 'Buildit',
    },
    {
      fieldId: 'COUNTRY',
      fieldLabel: 'Country',
      valueId: 'pl',
      valueLabel: 'Poland',
    },
    {
      fieldId: '58b7e4dce4b09a6d37a0ce40',
      fieldLabel: 'Department',
      valueId: '921917',
      valueLabel: 'Buildit Front End Engineering',
    },
  ],
  ref: 'https://api.smartrecruiters.com/api-v1/companies/WiproDigital/postings/743999665860002',
  creator: {
    name: 'Ania Gorska',
  },
  language: {
    code: 'en',
    label: 'English',
    labelNative: 'English (US)',
  },
};

describe('constructor()', () => {
  test(('Initialises members correctly'), () => {
    const job = new JobPosting(srPostingData);
    expect(job.uuid).toBe(srPostingData.uuid);
    expect(job.title).toBe(srPostingData.name);
    expect(job.companyId).toBe(srPostingData.company.identifier);
    expect(job.experienceLevel).toBe(srPostingData.experienceLevel.label);
    expect(job.location.city).toBe(srPostingData.location.city);
    expect(job.location.region).toBe(srPostingData.location.region);
    expect(job.location.countryCode).toBe(srPostingData.location.country);
    expect(job.typeOfEmployment).toBe(srPostingData.typeOfEmployment.label);
    expect(job.trId).toBeUndefined();
  });

  test(('Initialises tracking ID when one is provided'), () => {
    const job = new JobPosting(srPostingData, trId);
    expect(job.trId).toBe(trId);
  });
});

describe('country getter', () => {
  test('Returns country names for known country codes', () => {
    const { location } = new JobPosting(srPostingData);
    Object.keys(countryCodes).forEach((countryCode) => {
      location.countryCode = countryCode;
      expect(location.country).toBe(countryCodes[countryCode]);
    });
  });

  test('Throws a ReferenceError for unknown country codes', () => {
    const { location } = new JobPosting(srPostingData);
    location.countryCode = 'xxx';
    expect(location.country).toBeUndefined();
  });
});

describe('url getter', () => {
  test('Returns correct job ad URL', () => {
    const job = new JobPosting(srPostingData);
    expect(job.url).toBe(getJobAdUrl(
      srPostingData.company.identifier,
      srPostingData.uuid,
    ));
  });

  test('Adds tracking ID to URL, when provided', () => {
    const job = new JobPosting(srPostingData, trId);
    expect(job.url).toBe(getJobAdUrl(
      srPostingData.company.identifier,
      srPostingData.uuid,
      trId,
    ));
  });
});


describe('getJobPostings()', () => {
  test('returns promise that resolves to an array', async () => {
    const returnVal = await getJobPostings(companyId);
    expect(Array.isArray(returnVal)).toBe(true);
  });

  test('returns only JobPosting objects', async () => {
    const jobs = await getJobPostings(companyId);

    // Try to find a job that is NOT a JobPosting instance
    let nonJobPostingFound = false;
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      if (!(job instanceof JobPosting)) {
        nonJobPostingFound = true;
        break;
      }
    }
    expect(nonJobPostingFound).toBe(false);
  });

  test('passes trId to all JobPosting objects', async () => {
    const jobs = await getJobPostings(companyId, undefined, undefined, trId);

    // Try to find a job that does NOT have the trId set
    let nonMatchingTrIdFound = false;
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      if (job.trId !== trId) {
        nonMatchingTrIdFound = true;
        break;
      }
    }
    expect(nonMatchingTrIdFound).toBe(false);
  });
});

