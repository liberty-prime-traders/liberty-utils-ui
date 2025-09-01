import {OktaConfig} from '@okta/okta-angular'
import OktaAuth, {OktaAuthOptions} from '@okta/okta-auth-js'
import {LbuEnvironment} from '../environments/environment'

const oktaAuthOptions: OktaAuthOptions = {
  issuer: `https://${LbuEnvironment.environment.OKTA_DOMAIN}`,
  clientId: `${LbuEnvironment.environment.OKTA_CLIENT_ID}`,
  redirectUri: `${window.location.origin}/login/callback`,
  responseType: 'code',
  scopes: ['openid', 'groups']
}
const oktaAuth = new OktaAuth(oktaAuthOptions)
export const oktaModuleConfig: OktaConfig = {oktaAuth}

