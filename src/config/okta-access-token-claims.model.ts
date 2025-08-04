import {UserClaims} from '@okta/okta-auth-js'

export type OktaAccessTokenClaims = UserClaims<{ groups: string[] }>
