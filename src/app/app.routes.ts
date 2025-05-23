import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {LoggedInComponent} from './logged-in/logged-in.component'
import {SnapshotGridComponent} from './logged-in/snapshot-grid/snapshot-grid.component'
import {UserLocationsComponent} from './logged-in/user-locations/user-locations.component'
import {LoggedOutComponent} from './logged-out/logged-out.component'


const loggedInRoutes: Routes = [
	{path: 'snapshots', component: SnapshotGridComponent},
	{path: 'user-locations', component: UserLocationsComponent},
	{path: '**', redirectTo: 'snapshots'}
]

export const appRoutes: Routes = [
	{path: 'home', canActivate: [OktaAuthGuard], component: LoggedInComponent, children: loggedInRoutes},
	{path: 'login/callback', component: OktaCallbackComponent},
	{path: 'logged-out', component: LoggedOutComponent},
	{path: '**', redirectTo: 'logged-out'}
]
