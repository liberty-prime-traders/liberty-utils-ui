import {Component} from '@angular/core'
import {MenuItem} from 'primeng/api'
import {Menubar} from 'primeng/menubar'
import {RouterOutlet} from '@angular/router'
import {AddEntryComponent} from './add-entry/add-entry.component'


@Component({
  selector: 'dbt-debt-tracker',
  templateUrl: './debt-tracker.component.html',
  imports: [
    Menubar,
    RouterOutlet,
    AddEntryComponent
  ],
  standalone: true
})
export class DebtTrackerComponent {
  protected readonly menuItems: MenuItem[] = [
    {label: 'Dashboard', icon: 'pi pi-home'},
    {label: 'People', icon: 'pi pi-users', routerLink: 'people'},
    {label: 'Transactions', icon: 'pi pi-dollar', routerLink: 'transactions'},
    {label: 'Reports', icon: 'pi pi-chart-bar'}
  ]
}
