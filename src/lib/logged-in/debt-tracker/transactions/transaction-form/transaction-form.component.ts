import {Component, OnInit, inject, computed, input, model} from '@angular/core'
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {InputTextModule} from 'primeng/inputtext'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {RadioButton} from 'primeng/radiobutton'
import {Select} from 'primeng/select'
import {DatePicker} from 'primeng/datepicker'

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
    DatePicker
  ],
  templateUrl: './transaction-form.component.html'
})
export class AddTransactionComponent implements OnInit {
  private contactService = inject(ContactService)
  private transactionService = inject(TransactionService)
  private readonly formBuilder = inject(FormBuilder)
  readonly transaction = input<Transaction>()
  readonly visible = model(false)
  readonly mode = input<'add' | 'edit'>('add')
  readonly TransactionType = TransactionType

  ngOnInit(): void {
    this.contactService.fetch()
  }

  readonly $transactionForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.transaction()?.id,
    userId: [this.transaction()?.userId, Validators.required],
    description: this.transaction()?.description,
    amount: [this.transaction()?.amount, [Validators.required]],
    transactionType: [this.transaction()?.transactionType, Validators.required],
    transactionDate: [new Date(this.transaction()?.transactionDate ?? new Date()) , Validators.required]
  }))

  onSubmit() {
    const payload: Partial<Transaction> = {...this.$transactionForm().getRawValue()}
    if(this.mode() === 'add') {
      this.transactionService.post(payload)
    }
    else {
      this.transactionService.put(payload)
    }
    this.onCancel()
  }

  onCancel() {
    this.$transactionForm().reset(this.transaction())
    this.visible.set(false)
  }

  readonly $contactOptions = computed(() =>
    this.contactService.selectAll().map(c => ({
      label: c.fullName,
      value: c.id
    }))
  )
}
