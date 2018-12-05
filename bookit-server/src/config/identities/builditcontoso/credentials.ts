import {Domain, GraphAPIParameters} from '../../../model/EnvironmentConfig';

export const domain: Domain = {
  domainName: 'builditcontoso.onmicrosoft.com',
  sites: ['nyc']
};


// export const creds: GraphAPIParameters = {
//   identity: 'builditcontoso',
//   tenantId: '37fcf0e4-ceb8-4866-8e26-293bab1e26a8',
//   clientId: '5171c8f0-4216-4bbc-9d75-af4c81bbc812',
// };

const AzureBuilditCreds: GraphAPIParameters = {
  identity: 'buildit',
  tenantId: '37fcf0e4-ceb8-4866-8e26-293bab1e26a8',
  clientId: '9a8b8181-afb1-48f8-a839-a895d39f9db0',
};


export const appsDevCreds: GraphAPIParameters = {
  identity: 'buildit',
  tenantId: '37fcf0e4-ceb8-4866-8e26-293bab1e26a8',
  clientId: '9a8b8181-afb1-48f8-a839-a895d39f9db0',
};


export const creds = appsDevCreds;

export const AppADusers = {
  'bruce@builditcontoso.onmicrosoft.com': 'Zara879600',
  'black-room@builditcontoso.onmicrosoft.com': 'Loto0627',
  'blue-room@builditcontoso.onmicrosoft.com': 'Duko6280',
  'green-room@builditcontoso.onmicrosoft.com': 'Docu0367',
  'red-room@builditcontoso.onmicrosoft.com': 'Jujo1317',
  'white-room@builditcontoso.onmicrosoft.com': 'Volo5384'
};
