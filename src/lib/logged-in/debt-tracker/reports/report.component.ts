import {Component} from '@angular/core'
import {Menubar} from 'primeng/menubar'
import {MenuItem} from 'primeng/api'
import {RouterOutlet} from '@angular/router'

@Component({
  selector: 'dt-report',
  templateUrl: './report.component.html',
  imports: [
    Menubar,
    RouterOutlet
  ],
  standalone: true
})
export class ReportComponent {
  protected readonly items: MenuItem[] = [
    {label: 'Overview', icon: 'pi pi-chart-bar', routerLink: 'overview'},
    {label: 'Debtors', icon: 'pi pi-arrow-up-right', routerLink: 'debtors'},
    {label: 'Creditors', icon: 'pi pi-arrow-down-right', routerLink: 'creditors'}
  ]
}
