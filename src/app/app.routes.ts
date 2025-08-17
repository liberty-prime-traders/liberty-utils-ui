import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {LoggedInComponent} from '../lib/logged-in/logged-in.component'
import {SnapshotGridComponent} from '../lib/logged-in/daily-snapshot/snapshot-grid/snapshot-grid.component'
import {PlatformHomeComponent} from '../lib/logged-in/platform/platform-home/platform-home.component'
import {PlatformComponent} from '../lib/logged-in/platform/platform.component'
import {UserLocationsComponent} from '../lib/logged-in/platform/user-locations/user-locations.component'
import {LoggedOutComponent} from '../lib/logged-out/logged-out.component'
import {PeopleComponent} from '../lib/logged-in/debt-tracker/people/people.component'
import {PersonDetailComponent} from '../lib/logged-in/debt-tracker/people/person-details/person-detail.component'
import {TransactionsComponent} from '../lib/logged-in/debt-tracker/transactions/transactions.component'

const platformRoutes: Routes = [
  {path: '', component: PlatformHomeComponent},
  {path: 'user-locations', component: UserLocationsComponent},
  {path: '**', redirectTo: 'user-locations'}
]

const debtTrackerRoutes: Routes = [
  {
    path: 'people',
    component: PeopleComponent,
    children: [{path: ':id', component: PersonDetailComponent}]
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: '',
    redirectTo: 'people',
    pathMatch: 'full'
  }
]

const loggedInRoutes: Routes = [
  {path: 'daily-snapshot', component: SnapshotGridComponent},
  {
    path: 'debt-tracker',
    loadComponent: () =>
      import('../lib/logged-in/debt-tracker/debt-tracker.component').then(m => m.DebtTrackerComponent),
    children: debtTrackerRoutes
  },
  {path: 'platform', component: PlatformComponent, children: platformRoutes},
  {path: '**', redirectTo: 'daily-snapshot'}
]

export const appRoutes: Routes = [
	{path: 'secure', canActivate: [OktaAuthGuard], component: LoggedInComponent, children: loggedInRoutes},
	{path: 'login/callback', component: OktaCallbackComponent},
	{path: 'logged-out', component: LoggedOutComponent},
	{path: '**', redirectTo: 'logged-out'}
]
