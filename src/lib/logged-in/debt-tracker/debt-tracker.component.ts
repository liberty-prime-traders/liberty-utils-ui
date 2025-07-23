import {Component} from '@angular/core'
import {MenuItem} from 'primeng/api'
import {Menubar} from 'primeng/menubar'
import {RouterOutlet} from '@angular/router'
import {FloatingAddButtonComponent} from './floating-button/floating-button.component'


@Component({
  selector: 'dbt-debt-tracker',
  templateUrl: './debt-tracker.component.html',
  imports: [
    Menubar,
    RouterOutlet,
    FloatingAddButtonComponent
  ],
  standalone: true
})
export class DebtTrackerComponent {
  protected readonly menuItems: MenuItem[] = [
    {label: 'Dashboard', icon: 'pi pi-home'},
    {label: 'People', icon: 'pi pi-users', routerLink: 'people'},
    {label: 'Transactions', icon: 'pi pi-dollar'},
    {label: 'Reports', icon: 'pi pi-chart-bar'}
  ]
}
