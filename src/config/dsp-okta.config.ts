import {OktaConfig} from '@okta/okta-angular'
import OktaAuth, {OktaAuthOptions} from '@okta/okta-auth-js'
import {environment} from '../environments/environment'

const oktaAuthOptions: OktaAuthOptions = {
  issuer: `https://${environment.OKTA_DOMAIN}`,
  clientId: `${environment.OKTA_CLIENT_ID}`,
  redirectUri: `${window.location.origin}/login/callback`,
  responseType: 'code',
  scopes: ['openid']
}
const oktaAuth = new OktaAuth(oktaAuthOptions)
export const oktaModuleConfig: OktaConfig = {oktaAuth}

