import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, input, model, signal} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Fieldset} from 'primeng/fieldset'
import {InputNumber} from 'primeng/inputnumber'
import {Message} from 'primeng/message'
import {Toast} from 'primeng/toast'
import {Subscription} from 'rxjs'
import {DailySnapshotModel} from '../../api/dsp/daily-snapshot.model'
import {DspStore} from '../../api/dsp/dsp-store'
import {DspService} from '../../api/dsp/dsp.service'
import {ProcessingStatus} from '../../api/processing-status.enum'

@Component({
	selector: 'dsp-snapshot-form',
	templateUrl: './snapshot-form.component.html',
	imports: [
		Fieldset,
		InputNumber,
		ReactiveFormsModule,
		DatePipe,
		Button,
		Message,
		Toast,
		DatePicker
	],
	providers: [MessageService, DatePipe]
})
export class SnapshotFormComponent {
	private readonly formBuilder = inject(NonNullableFormBuilder)
	private readonly dspService = inject(DspService)
	private readonly dspStore = inject(DspStore)
	private readonly messageService = inject(MessageService)
	private readonly datePipe = inject(DatePipe)
	
	readonly showAudit = model(false)
	readonly showForm = model(false)
	private readonly subscriptions = new Subscription()
	private readonly saveClickedAtLeastOnce = signal<boolean>(false)
	readonly processingStatus = this.dspStore.processingStatus
	readonly requestIsInProgress = computed(() => this.processingStatus() === ProcessingStatus.IN_PROGRESS)
	readonly failureMessages = this.dspStore.failureMessages
	
	readonly snapshotRecord = input<DailySnapshotModel>()
	readonly maxDate = input<Date>()
	
	readonly formGroup = computed(() =>
		this.formBuilder.group({
			id: this.snapshotRecord()?.id,
			snapshotDate: [this.snapshotRecord()?.snapshotDate, Validators.required],
			startBalanceCash: this.snapshotRecord()?.startBalanceCash,
			endBalanceCash: this.snapshotRecord()?.endBalanceCash,
			outflowCash: this.snapshotRecord()?.outflowCash,
			cogs: this.snapshotRecord()?.cogs,
			cogsReturned: this.snapshotRecord()?.cogsReturned,
			expenses: this.snapshotRecord()?.expenses,
			inflowJointAccount: this.snapshotRecord()?.inflowJointAccount,
			inflowPersonalAccount: this.snapshotRecord()?.inflowPersonalAccount
		})
	)
	
	constructor() {
		effect(() => {
			if (this.saveClickedAtLeastOnce() && this.processingStatus() === ProcessingStatus.SUCCESS) {
				this.respondToSuccessfulSave()
			}
			if (this.saveClickedAtLeastOnce() && this.processingStatus() === ProcessingStatus.FAILURE) {
				this.respondToFailedSave()
			}
		})
	}
	
	upsertSnapshot() {
		this.saveClickedAtLeastOnce.set(true)
		const snapshot = this.formGroup().value as DailySnapshotModel
		snapshot.snapshotDate = this.datePipe.transform(snapshot.snapshotDate, 'yyyy-MM-dd') ?? undefined
		this.subscriptions.add(Boolean(snapshot?.id) ? this.dspService.put(snapshot) : this.dspService.post(snapshot))
	}
	
	private respondToSuccessfulSave() {
		this.messageService.add({
			severity: 'success',
			summary: 'Success',
			detail: 'Snapshot saved successfully'
		})
		if (!Boolean(this.snapshotRecord()?.id)) {
			this.showForm.set(false)
		}
	}
	
	private respondToFailedSave() {
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Snapshot save failed'
		})
	}
}
