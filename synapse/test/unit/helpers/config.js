import 'jsdom-global/register';
import {
  Config,
  DEVELOPMENT_ENDPOINT,
  STAGING_PREFIX,
  PRODUCTION_PREFIX,
} from 'helpers/config';
import { expect } from 'chai';

describe('config manager', () => {
  global.process.env.EOLAS_DOMAIN = 'example.com';

  it('handles localhost without TEST_API environment', () => {
    const devConfig = new Config('localhost');
    expect(devConfig.apiBaseUrl).to.equal(DEVELOPMENT_ENDPOINT);
    expect(devConfig.starterProjectsBaseApiUrl).to.equal(DEVELOPMENT_ENDPOINT);
  });

  it('handles localhost with TEST_API environment', () => {
    const testDevConfig = new Config('localhost');
    const testApiValue = 'foo';
    global.process.env.TEST_API = testApiValue;
    expect(testDevConfig.apiBaseUrl).to.equal(testApiValue);
    expect(testDevConfig.starterProjectsBaseApiUrl).to.equal(testApiValue);
  });

  it('handles staging', () => {
    const stagingConfig = new Config('staging.example.com');
    const stagingEndpoint = `${STAGING_PREFIX}${process.env.EOLAS_DOMAIN}/`;
    expect(stagingConfig.apiBaseUrl).to.equal(stagingEndpoint);
    expect(stagingConfig.starterProjectsBaseApiUrl).to.equal(stagingEndpoint);
  });

  it('handles production', () => {
    const productionConfig = new Config('production.example.com');
    const productionEndpoint = `${PRODUCTION_PREFIX}${process.env.EOLAS_DOMAIN}/`;
    expect(productionConfig.apiBaseUrl).to.equal(productionEndpoint);
    expect(productionConfig.starterProjectsBaseApiUrl).to.equal(productionEndpoint);
  });

  it('catches bad urls properly', () => {
    const badConfig = new Config();
    const badEndpoint = `${PRODUCTION_PREFIX}${process.env.EOLAS_DOMAIN}/`;
    expect(badConfig.apiBaseUrl).to.equal(badEndpoint);
    expect(badConfig.starterProjectsBaseApiUrl).to.equal(badEndpoint);
  });

  it('catches exceptions properly', () => {
    global.process.env = undefined;
    const errorConfig = new Config('production.example.com');
    const errorEndpoint = DEVELOPMENT_ENDPOINT;
    expect(errorConfig.apiBaseUrl).to.equal(errorEndpoint);
    expect(errorConfig.starterProjectsBaseApiUrl).to.equal(errorEndpoint);
  });
});
