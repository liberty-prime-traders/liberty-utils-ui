import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem, MessageService} from 'primeng/api'
import {Menubar} from 'primeng/menubar'
import {Toast} from 'primeng/toast'
import {AddEntryComponent} from './add-entry/add-entry.component'


@Component({
  selector: 'dbt-debt-tracker',
  templateUrl: './debt-tracker.component.html',
  imports: [
    Menubar,
    RouterOutlet,
    AddEntryComponent,
    Toast
  ],
  standalone: true,
  providers: [MessageService]
})
export class DebtTrackerComponent {
  protected readonly menuItems: MenuItem[] = [
    {label: 'Dashboard', icon: 'pi pi-home', routerLink: 'dashboard'},
    {label: 'Contacts', icon: 'pi pi-users', routerLink: 'contacts'},
    {label: 'Transactions', icon: 'pi pi-dollar', routerLink: 'transactions'},
    {label: 'Reports', icon: 'pi pi-chart-bar'}
  ]
}
