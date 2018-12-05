import fetch from 'cross-fetch';

/**
 * Constructs the full URL for SmartRecruiters' Posting API
 * endpoint.
 *
 * @see https://dev.smartrecruiters.com/customer-api/posting-api/endpoints/postings/
 *
 * @param {String} companyId   The company ID (e.g. "WiproDigital")
 */
function getPostingEndpointUrl(companyId) {
  return `https://api.smartrecruiters.com/v1/companies/${companyId}/postings`;
}

/**
 * Constructs the full URL for a job ad page on SmartRecruiters.
 *
 * @param {String} companyId   The company ID (e.g. "WiproDigital")
 * @param {String} jobUuid     The job's UUID
 * @param {String} trId        Optional tracking ID
 *
 * @return {String} Full job ad URL
 */
export function getJobAdUrl(companyId, jobUuid, trId) {
  const queryString = trId ? `?trid=${trId}` : '';
  return `https://jobs.smartrecruiters.com/ni/${companyId}/${jobUuid}${queryString}`;
}

/**
 * Fetches job posting data from SmartRecruiters' Posting API.
 *
 * @see https://dev.smartrecruiters.com/customer-api/posting-api/endpoints/postings/
 *
 * @param {String} companyId           The company ID (e.g. "WiproDigital")
 * @param {String} customFieldId       Optional custom field ID to filter results on
 * @param {String} customFieldValueId  Optional custom field value to use with the field ID
 *
 * @return {Promise<Array>} Promise that resolves to an array of job posting data.
 */
export async function getJobPostingsData(companyId, customFieldId, customFieldValueId) {
  const queryString = customFieldId ? `?custom_field.${customFieldId}=${customFieldValueId}` : '';
  const url = getPostingEndpointUrl(companyId) + queryString;
  const response = await fetch(url);
  const json = await response.json();
  return json.content; // actual jobs array
}
