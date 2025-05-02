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
import {DailySnapshotModel} from '../../api/daily-snapshot.model'
import {DspOktaService} from '../../config/dsp-okta.service'
import {DspStore} from '../../api/dsp-store'
import {DspService} from '../../api/dsp.service'
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
		SnapshotFormComponent
	],
	templateUrl: './logged-in.component.html'
})
export class LoggedInComponent implements OnInit, OnDestroy {
	
	private readonly dspService = inject(DspService)
	private readonly dspOktaService = inject(DspOktaService)
	private readonly dspStore = inject(DspStore)
	private readonly router = inject(Router)
	
	private readonly now = new Date()
	private readonly year = this.now.getFullYear()
	private readonly month = this.now.getMonth()
	
	readonly today = new Date(this.year, this.month, this.now.getDate())
	startDate = new Date(this.year, this.month, 1)
	endDate = this.today
	
	private readonly subscriptions = new Subscription()
	
	readonly showAddForm = model(false)
	readonly recordInFocus = signal<DailySnapshotModel | undefined>(undefined)
	readonly snapShotRecords = this.dspStore.entities
	readonly loading = this.dspStore.loading
	
	ngOnInit() {
		this.fetchSnapshots()
	}
	
	ngOnDestroy() {
		this.subscriptions.unsubscribe()
	}
	
	logout() {
		this.router.navigate(['/logged-out']).then(() => this.dspOktaService.signOut().then())
	}

	fetchSnapshots() {
		this.subscriptions.add(this.dspService.get(this.dateToString(this.startDate), this.dateToString(this.endDate)))
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
