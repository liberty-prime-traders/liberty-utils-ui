import {Component, OnInit, inject, computed, input, model} from '@angular/core'
import {toObservable} from '@angular/core/rxjs-interop'
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms'
import {CommonModule, DatePipe} from '@angular/common'
import {MessageService} from 'primeng/api'
import {InputNumber} from 'primeng/inputnumber'
import {InputTextModule} from 'primeng/inputtext'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {filter, skip, take, tap} from 'rxjs/operators'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {ProcessingStatus} from '../../../../../api/processing-status.enum'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {
  TransactionType,
  TransactionTypeLabel
} from '../../../../../api/transactions/transaction-type.enum'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {RadioButton} from 'primeng/radiobutton'
import {Select} from 'primeng/select'
import {DatePicker} from 'primeng/datepicker'
import {DropdownModule} from 'primeng/dropdown'
import {EnumToDropdownPipe} from '../../../../reusable/pipes/enum-to-dropdown.pipe'
import {LibertyLocation} from '../../../../../api/user-locations/liberty-location.enum'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {FormFieldComponent} from '../../../../reusable/components/form-field/form-field.component'
import {FormMode} from '../../form-mode.enum';

@Component({
  selector: 'dbt-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    RadioButton,
    Select,
    DatePicker,
    DropdownModule,
    EnumToDropdownPipe,
    FormFieldComponent,
    InputNumber
  ],
  templateUrl: './transaction-form.component.html'
})
export class AddTransactionComponent implements OnInit {

  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  private readonly formBuilder = inject(FormBuilder)
  readonly lbuOktaService = inject(LbuOktaService)
  private readonly datePipe = inject(DatePipe)
  private readonly messageService = inject(MessageService)

  readonly transaction = input<Transaction>()
  readonly visible = model(false)
  readonly mode = input(FormMode.ADD)

  readonly $contactOptions = this.contactService.selectAll
  private readonly transactionProcessingStatus$ = toObservable(this.transactionService.selectProcessingStatus)

  readonly TransactionType = TransactionType
  readonly TransactionTypeLabel = TransactionTypeLabel
  protected readonly LIBERTY_LOCATIONS = LibertyLocation
  protected readonly FormMode = FormMode

  ngOnInit(): void {
    this.contactService.fetch()
  }

  readonly $transactionForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.transaction()?.id,
    userId: [this.transaction()?.userId, Validators.required],
    description: this.transaction()?.description,
    amount: [this.transaction()?.amount, [Validators.required]],
    location: this.transaction()?.location,
    transactionType: [this.transaction()?.transactionType, Validators.required],
    transactionDate: [this.transaction()?.transactionDate, Validators.required]
  }))

  onSubmit() {
    const payload: Partial<Transaction> = this.$transactionForm().getRawValue()
    payload.transactionDate = this.datePipe.transform(payload.transactionDate, 'yyyy-MM-dd') ?? undefined
    if(this.mode() === 'add') {
      this.transactionService.post(payload)
    } else {
      this.transactionService.put(payload)
    }
    this.listenToProcessingStatus()
  }

  private listenToProcessingStatus() {
    this.transactionProcessingStatus$.pipe(
      skip(1),
      filter((processingStatus) => [ProcessingStatus.SUCCESS, ProcessingStatus.FAILURE].includes(processingStatus)),
      tap((processingStatus) => {
        if (processingStatus === ProcessingStatus.SUCCESS) {
          this.$transactionForm().reset(undefined)
          this.visible.set(false)
        } else if (processingStatus === ProcessingStatus.FAILURE) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: this.transactionService.selectFailureMessages().at(0)})
        }
      }),
      take(1)
    ).subscribe()
  }

  onReset() {
    this.$transactionForm().reset()
  }

}
