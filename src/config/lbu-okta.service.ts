import {inject, Injectable} from '@angular/core'
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular'
import {AccessToken} from '@okta/okta-auth-js'
import {map, Observable} from 'rxjs'
import {first} from 'rxjs/operators'
import {OktaAccessTokenClaims} from './okta-access-token-claims.model'
import {UserRole} from './user-role.enum'

@Injectable({providedIn: 'root'})
export class LbuOktaService {
  private readonly oktaAuth = inject(OKTA_AUTH)
  private readonly oktaStateService = inject(OktaAuthStateService)

  async signOut(): Promise<void> { await this.oktaAuth.signOut() }

  readonly accessToken$: Observable<AccessToken|undefined> = this.oktaStateService.authState$.pipe(
    map(authState => authState.accessToken),
    first()
  )

  readonly isLibertyAdmin$ = this.hasRole$(UserRole.ROLE_LIBERTY_ADMIN)

  hasRole$(role: UserRole): Observable<boolean> {
    return this.accessToken$.pipe(
      map(accessToken => this.hasRole(accessToken, role))
    )
  }

  private hasRole(accessToken: AccessToken|undefined, role: UserRole): boolean {
    const claims = (accessToken?.claims as OktaAccessTokenClaims)?.groups
    return Boolean(claims?.includes(role))
  }
}
