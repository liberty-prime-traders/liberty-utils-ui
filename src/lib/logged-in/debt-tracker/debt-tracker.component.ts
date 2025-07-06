import {Component} from '@angular/core'
import {MenuItem} from 'primeng/api'
import {Menubar} from 'primeng/menubar'
import {Card} from 'primeng/card'
import {RouterOutlet} from '@angular/router'
import {FloatingAddButtonComponent} from './floating-button/floating-button.component'


@Component({
  selector: 'dbt-debt-tracker',
  templateUrl: './debt-tracker.component.html',
  imports: [
    Menubar,
    Card,
    RouterOutlet,
    FloatingAddButtonComponent
  ],
  standalone: true
})
export class DebtTrackerComponent {
  protected readonly menuItems: MenuItem[] = [
    {label: 'Dashboard', icon: 'pi pi-home', routerLink: 'dashboard'},
    {label: 'People', icon: 'pi pi-users', routerLink: 'people'},
    {label: 'Transactions', icon: 'pi pi-dollar', routerLink: 'transactions'},
    {label: 'Reports', icon: 'pi pi-chart-bar', routerLink: 'reports'}
  ]
}
