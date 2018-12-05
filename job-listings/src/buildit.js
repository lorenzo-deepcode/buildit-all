import { getJobPostings } from './job-posting';
import {
  wiproDigitalId,
  builditTrId,
  builditCustomFieldId,
  builditCustomFieldValue,
} from './constants';

/**
 * Fetches all currently advertised Buildit jobs as JobPosting objects.
 *
 * Each JobPosting object will be initalised with the tracking ID for the
 * "Buildit website" source in SmartRecruiters' analytics.
 *
 * @return {Promise<Array>} Promise that resolves to an array of job postings.
 */
export async function getBuilditJobPostings() { // eslint-disable-line import/prefer-default-export
  return getJobPostings(wiproDigitalId, builditCustomFieldId, builditCustomFieldValue, builditTrId);
}
