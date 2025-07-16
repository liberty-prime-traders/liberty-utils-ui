import {UserClaims} from '@okta/okta-auth-js';

export interface OktaAccessTokenClaims extends UserClaims<{ groups: string[] }> {}
