import {Env} from './env.enum'

export namespace LbuEnvironment {
  export const environment = {
    // environment: Env.DEV,
    environment: Env.TEST,
    // environment: Env.PROD,
    DEV_URL: 'http://localhost:8080',
    TEST_URL: 'https://liberty-utils-server-test.ezra-home.me',
    PROD_URL: 'https://liberty-utils-server.ezra-home.me',
    OKTA_DOMAIN: 'okta.liberty-solutions.ezra-home.me/oauth2/default',
    OKTA_CLIENT_ID: '0oat6t2t3vXAZfI4f697'
  }

  export const getBaseUrl = () => {
    switch(environment.environment) {
      case Env.DEV: return environment.DEV_URL
      case Env.TEST: return environment.TEST_URL
      case Env.PROD: return environment.PROD_URL
    }
  }

}
