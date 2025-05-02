import {inject, Injectable} from '@angular/core'
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular'
import {AccessToken} from '@okta/okta-auth-js'
import {map, Observable} from 'rxjs'
import {first} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class DspOktaService {
  private readonly oktaAuth = inject(OKTA_AUTH)
  private readonly oktaStateService = inject(OktaAuthStateService)
  
  async signOut(): Promise<void> { await this.oktaAuth.signOut() }

  readonly accessToken$: Observable<AccessToken|undefined> = this.oktaStateService.authState$.pipe(
    map(authState => authState.accessToken),
    first()
  )
}
