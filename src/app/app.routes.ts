import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {DailySnapshotComponent} from '../lib/logged-in/daily-snapshot/daily-snapshot.component'
import {LoggedInComponent} from '../lib/logged-in/logged-in.component'
import {SnapshotGridComponent} from '../lib/logged-in/daily-snapshot/snapshot-grid/snapshot-grid.component'
import {UserLocationsComponent} from '../lib/logged-in/daily-snapshot/user-locations/user-locations.component'
import {LoggedOutComponent} from '../lib/logged-out/logged-out.component'
import {PeopleComponent} from '../lib/logged-in/debt-tracker/people/people.component'
import {PersonDetailComponent} from '../lib/logged-in/debt-tracker/people/person-details/person-detail.component'
import {TransactionsComponent} from '../lib/logged-in/debt-tracker/transactions/transactions.component'

const dailySnapshotRoutes: Routes = [
  {path: '', component: SnapshotGridComponent},
  {path: 'user-locations', component: UserLocationsComponent},
  {path: '**', redirectTo: ''}
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
  {path: 'daily-snapshot', component: DailySnapshotComponent, children: dailySnapshotRoutes},
  {
    path: 'debt-tracker',
    loadComponent: () =>
      import('../lib/logged-in/debt-tracker/debt-tracker.component').then(m => m.DebtTrackerComponent),
    children: debtTrackerRoutes
  },
  {path: '**', redirectTo: 'daily-snapshot'}
]

export const appRoutes: Routes = [
	{path: 'secure', canActivate: [OktaAuthGuard], component: LoggedInComponent, children: loggedInRoutes},
	{path: 'login/callback', component: OktaCallbackComponent},
	{path: 'logged-out', component: LoggedOutComponent},
	{path: '**', redirectTo: 'logged-out'}
]
