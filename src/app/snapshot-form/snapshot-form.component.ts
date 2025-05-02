import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, input, OnInit, signal} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Fieldset} from 'primeng/fieldset'
import {InputNumber} from 'primeng/inputnumber'
import {Message} from 'primeng/message'
import {Toast} from 'primeng/toast'
import {Subscription} from 'rxjs'
import {DailySnapshotModel} from '../../api/daily-snapshot.model'
import {DspStore} from '../../api/dsp-store'
import {DspService} from '../../api/dsp.service'
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
	providers: [MessageService]
})
export class SnapshotFormComponent implements OnInit {
	private readonly formBuilder = inject(NonNullableFormBuilder)
	private readonly dspService = inject(DspService)
	private readonly dspStore = inject(DspStore)
	private readonly messageService = inject(MessageService)
	
	private readonly subscriptions = new Subscription()
	private readonly saveClickedAtLeastOnce = signal<boolean>(false)
	readonly processingStatus = this.dspStore.processingStatus
	readonly requestIsInProgress = computed(() => this.processingStatus() === ProcessingStatus.IN_PROGRESS)
	readonly failureMessages = this.dspStore.failureMessages
	
	readonly snapshotRecord = input<DailySnapshotModel>()
	readonly maxDate = input<Date>()
	
	readonly formGroup = computed(() =>
		this.formBuilder.group<DailySnapshotModel>({
			id: this.snapshotRecord()?.id ?? '',
			snapshotDate: this.snapshotRecord()?.snapshotDate,
			startBalanceCash: this.snapshotRecord()?.startBalanceCash,
			startBalanceJointAccount: this.snapshotRecord()?.startBalanceJointAccount,
			startBalancePersonalAccount: this.snapshotRecord()?.startBalancePersonalAccount,
			endBalanceCash: this.snapshotRecord()?.endBalanceCash,
			endBalanceJointAccount: this.snapshotRecord()?.endBalanceJointAccount,
			endBalancePersonalAccount: this.snapshotRecord()?.endBalancePersonalAccount,
			outflowCash: this.snapshotRecord()?.outflowCash,
			outflowJointAccount: this.snapshotRecord()?.outflowJointAccount,
			outflowPersonalAccount: this.snapshotRecord()?.outflowPersonalAccount
		})
	)
	
	constructor() {
		effect(() => {
			if (this.saveClickedAtLeastOnce() && this.processingStatus() === ProcessingStatus.SUCCESS) {
				this.messageService.add({
					severity: 'success',
					summary: 'Success',
					detail: 'Snapshot saved successfully'
				})
			}
		})
	}
	
	ngOnInit() {
		const snapshotDateControl = this.formGroup()?.get('snapshotDate')
		snapshotDateControl?.addValidators(Validators.required)
		snapshotDateControl?.updateValueAndValidity()
	}
	
	upsertSnapshot() {
		this.saveClickedAtLeastOnce.set(true)
		const snapshot = this.formGroup().value as DailySnapshotModel
		this.subscriptions.add(
			Boolean(snapshot?.id) ? this.dspService.put(snapshot) : this.dspService.post(snapshot)
		)
	}
}
