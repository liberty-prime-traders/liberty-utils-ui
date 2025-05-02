import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {LoggedInComponent} from './logged-in/logged-in.component'
import {LoggedOutComponent} from './logged-out/logged-out.component'

export const appRoutes: Routes = [
	{path: 'home', canActivate: [OktaAuthGuard], component: LoggedInComponent},
	{path: 'login/callback', component: OktaCallbackComponent},
	{path: 'logged-out', component: LoggedOutComponent},
	{path: '**', redirectTo: 'logged-out'}
]
