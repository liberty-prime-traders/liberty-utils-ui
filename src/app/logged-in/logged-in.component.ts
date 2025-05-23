import {AsyncPipe} from '@angular/common'
import {Component, inject, OnDestroy, OnInit} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router, RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {Menu} from 'primeng/menu'
import {TableModule} from 'primeng/table'
import {map, Observable} from 'rxjs'
import {SysUserService} from '../../api/sys-user/sys-user.service'
import {DspOktaService} from '../../config/dsp-okta.service'
import {HasSubscriptionComponent} from '../reusable/has-subscription.component'

@Component({
	selector: 'dsp-home',
	imports: [
		Button,
		TableModule,
		FormsModule,
		Divider,
		RouterOutlet,
		Menu,
		Card,
		AsyncPipe
	],
	templateUrl: './logged-in.component.html'
})
export class LoggedInComponent extends HasSubscriptionComponent implements OnInit, OnDestroy {
	private readonly dspOktaService = inject(DspOktaService)
	private readonly router = inject(Router)
	private readonly sysUserService = inject(SysUserService)
	
	readonly navigationItems$: Observable<MenuItem[]> = this.dspOktaService.isLibertyAdmin$.pipe(
		map(isLibertyAdmin => [
			{
				label: 'Menu',
				items: [
					{label: 'Snapshots', routerLink: 'snapshots'},
					{label: 'User Locations', routerLink: 'user-locations', visible: isLibertyAdmin}
				]
			}
		])
	)
	
	ngOnInit() {
		this.subscriptions.add(this.sysUserService.post())
	}
	
	logout() {
		this.router.navigate(['/logged-out']).then(() => this.dspOktaService.signOut().then())
	}
	
}
