const hostname = typeof window === 'undefined' ? 'localhost' : window.location.hostname;
const serverConfig = typeof window === 'undefined' ? null : window.SERVER_CONF;
/* eslint-disable no-console */
/* eslint-enable no-console */

export const STAGING = 'staging';
export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const DEVELOPMENT_ENDPOINT = 'http://localhost:6565/';
export const STAGING_PREFIX = 'http://eolas.staging.';
export const PRODUCTION_PREFIX = 'http://eolas.';

export class Config {

  constructor(environment = '') {
    this.environment = this.determineEnvironment(environment);
    this.computedBaseUrl = undefined;
  }

  determineEnvironment(environment) {
    let currentEnv;
    if (environment.includes('staging')) {
      currentEnv = STAGING;
    } else if (environment.includes('localhost')) {
      currentEnv = DEVELOPMENT;
    } else {
      currentEnv = PRODUCTION;
    }
    return currentEnv;
  }

  baseUrl() {
    try {
      if (!this.computedBaseUrl) {
        let url;
        const serverConf = this.serverConfig;
        if (serverConf && serverConf.eolasUrl) {
          url = serverConf.eolasUrl;
        } else {
          // server config is not provided, falling back to ancient black magic

          const eolasDomain = process.env.EOLAS_DOMAIN;
          if (this.environment === STAGING) {
            url = `${STAGING_PREFIX}${eolasDomain}/`;
          } else if (this.environment === DEVELOPMENT) {
            url = process.env.TEST_API || DEVELOPMENT_ENDPOINT;
          } else {
            url = `${PRODUCTION_PREFIX}${eolasDomain}/`;
          }
        }
        this.computedBaseUrl = url;
      }
    } catch (err) {
      this.computedBaseUrl = DEVELOPMENT_ENDPOINT;
    }
    return this.computedBaseUrl;
  }

  get serverConfig() {
    return serverConfig;
  }

  get noauth() {
    return serverConfig && serverConfig.noauth;
  }

  authUrl() {
    const serverConf = this.serverConfig;
    if (serverConf && serverConf.twigApiUrl) {
      return serverConf.twigApiUrl;
    }
    if (this.environment === STAGING || this.environment === DEVELOPMENT) {
      return 'https://staging-twig-api.buildit.tools/';
    }
    return 'https://twig-api.buildit.tools/';
  }

  get apiBaseUrl() {
    return this.baseUrl();
  }

  get starterProjectsBaseApiUrl() {
    return this.baseUrl();
  }

  get loginUrl() {
    return `${this.authUrl()}login`;
  }
}

const config = new Config(hostname);

/* eslint-disable no-console */
console.log('server config', config.serverConfig);
/* eslint-enable no-console */

export default config;
