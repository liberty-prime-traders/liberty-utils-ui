import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject, model, OnDestroy, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router} from '@angular/router'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Divider} from 'primeng/divider'
import {Drawer} from 'primeng/drawer'
import {TableModule} from 'primeng/table'
import {Subscription} from 'rxjs'
import {DailySnapshotModel} from '../../api/dsp/daily-snapshot.model'
import {DspService} from '../../api/dsp/dsp.service'
import {SysUserService} from '../../api/sys_user.service'
import {DspOktaService} from '../../config/dsp-okta.service'
import {AuditGridComponent} from '../audit-grid/audit-grid.component'
import {SnapshotFormComponent} from '../snapshot-form/snapshot-form.component'

@Component({
	selector: 'dsp-home',
	imports: [
		Button,
		TableModule,
		CurrencyPipe,
		DatePipe,
		DatePicker,
		FormsModule,
		Divider,
		Drawer,
		SnapshotFormComponent,
		AuditGridComponent
	],
	templateUrl: './logged-in.component.html'
})
export class LoggedInComponent implements OnInit, OnDestroy {
	
	private readonly dspService = inject(DspService)
	private readonly dspOktaService = inject(DspOktaService)
	private readonly router = inject(Router)
	private readonly sysUserService = inject(SysUserService)
	
	private readonly now = new Date()
	private readonly year = this.now.getFullYear()
	private readonly month = this.now.getMonth()
	
	readonly showAudit = model(false)
	readonly today = new Date(this.year, this.month, this.now.getDate())
	startDate = new Date(this.year, this.month, 1)
	endDate = this.today
	
	private readonly subscriptions = new Subscription()
	
	readonly showAddForm = model(false)
	readonly recordInFocus = signal<DailySnapshotModel | undefined>(undefined)
	readonly snapShotRecords = this.dspService.selectAll
	readonly loading = this.dspService.selectLoading
	
	ngOnInit() {
		this.fetchSnapshots()
		this.subscriptions.add(this.sysUserService.createUser())
	}
	
	ngOnDestroy() {
		this.subscriptions.unsubscribe()
	}
	
	logout() {
		this.router.navigate(['/logged-out']).then(() => this.dspOktaService.signOut().then())
	}

	fetchSnapshots() {
		this.subscriptions.add(this.dspService.refetch({
				startDate: this.dateToString(this.startDate),
				endDate: this.dateToString(this.endDate)
			})
		)
	}
	
	openDrawer(snapshot?: DailySnapshotModel) {
		this.recordInFocus.set(snapshot)
		this.showAddForm.set(true)
	}
	
	private dateToString(date: Date): string {
		const year = date.getFullYear()
		const month = String(date.getMonth()+1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}
}
