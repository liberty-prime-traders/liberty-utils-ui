import {Component, inject, OnDestroy, OnInit} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router, RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Menubar} from 'primeng/menubar'
import {TableModule} from 'primeng/table'
import {SysUserService} from '../../api/sys-user/sys-user.service'
import {LbuOktaService} from '../../config/lbu-okta.service'
import {HasSubscriptionComponent} from '../reusable/components/has-subscription.component'

@Component({
	selector: 'lbu-logged-in',
  imports: [
    Button,
    TableModule,
    FormsModule,
    Divider,
    RouterOutlet,
    Menubar
  ],
	templateUrl: './logged-in.component.html'
})
export class LoggedInComponent extends HasSubscriptionComponent implements OnInit, OnDestroy {
	private readonly dspOktaService = inject(LbuOktaService)
	private readonly router = inject(Router)
	private readonly sysUserService = inject(SysUserService)

  readonly availableApps: MenuItem[] = [
    {label: 'Daily Snapshot', routerLink: 'daily-snapshot'},
    {label: 'Debt Tracker', routerLink: 'debt-tracker'}
  ]

	ngOnInit() {
		this.subscriptions.add(this.sysUserService.post())
	}

	logout() {
		this.router.navigate(['/logged-out']).then(() => this.dspOktaService.signOut().then())
	}

}
