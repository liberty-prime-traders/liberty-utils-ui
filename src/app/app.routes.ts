import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {DailySnapshotComponent} from '../lib/logged-in/daily-snapshot/daily-snapshot.component'
import {LoggedInComponent} from '../lib/logged-in/logged-in.component'
import {SnapshotGridComponent} from '../lib/logged-in/daily-snapshot/snapshot-grid/snapshot-grid.component'
import {UserLocationsComponent} from '../lib/logged-in/daily-snapshot/user-locations/user-locations.component'
import {LoggedOutComponent} from '../lib/logged-out/logged-out.component'
import {DashboardComponent} from '../lib/logged-in/debt-tracker/dashboard/dashboard.component'
import {PeopleComponent} from '../lib/logged-in/debt-tracker/people/people.component'
import {TransactionComponent} from '../lib/logged-in/debt-tracker/transactions/transaction.component'
import {ReportComponent} from '../lib/logged-in/debt-tracker/reports/report.component'
import {PersonDetailComponent} from '../lib/logged-in/debt-tracker/people/person-details/person-detail.component'
import {
  FinancialOverviewComponent
} from '../lib/logged-in/debt-tracker/reports/financial-overview/financial-overview.component'
import {
  DebtorDistributionComponent
} from '../lib/logged-in/debt-tracker/reports/debtor-distribution/debtor-distribution.component'
import {
  CreditorDistributionComponent
} from '../lib/logged-in/debt-tracker/reports/creditor-distribution/creditor-distribution.component'
import {AddNewFormComponent} from '../lib/logged-in/debt-tracker/add-new-form/add-new-form.component'
import {
  AddTransactionComponent
} from '../lib/logged-in/debt-tracker/add-new-form/transaction/add-transaction.component'
import {AddPersonComponent} from '../lib/logged-in/debt-tracker/add-new-form/person/add-person.component'

const dailySnapshotRoutes: Routes = [
  {path: '', component: SnapshotGridComponent},
  {path: 'user-locations', component: UserLocationsComponent},
  {path: '**', redirectTo: ''}
]

const debtTrackerChildrenRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'people',
    component: PeopleComponent,
    children: [
      {
        path: ':id',
        component: PersonDetailComponent
      }
    ]},
  {path: 'transactions', component: TransactionComponent},
  {path: 'reports',
    component: ReportComponent,
    children: [
      {
        path: 'overview',
        component: FinancialOverviewComponent
      },
      {
        path: 'debtors',
        component: DebtorDistributionComponent
      },
      {
        path: 'creditors',
        component: CreditorDistributionComponent
      },
      {path: '',
        redirectTo: 'overview',
        pathMatch: 'full'}
    ]},
  {
    path: 'add-new',
    component: AddNewFormComponent,
    children: [
      {
        path: 'transaction',
        component: AddTransactionComponent
      },
      {
        path: 'person',
        component: AddPersonComponent
      },
      {
        path: '',
        redirectTo: 'transaction',
        pathMatch: 'full'
      }
    ]
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
]

const loggedInRoutes: Routes = [
  {path: 'daily-snapshot', component: DailySnapshotComponent, children: dailySnapshotRoutes},
  {
    path: 'debt-tracker',
    loadComponent: () =>
      import('../lib/logged-in/debt-tracker/debt-tracker.component').then(m => m.DebtTrackerComponent),
    children: debtTrackerChildrenRoutes
  },
  {path: '**', redirectTo: 'daily-snapshot'}
]

export const appRoutes: Routes = [
  {path: 'secure', canActivate: [OktaAuthGuard], component: LoggedInComponent, children: loggedInRoutes},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'logged-out', component: LoggedOutComponent},
  {path: '**', redirectTo: 'logged-out'}
]
