import {Component, OnInit, inject, Signal, computed, input} from '@angular/core'
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {DropdownModule} from 'primeng/dropdown'
import {InputTextModule} from 'primeng/inputtext'
import {CalendarModule} from 'primeng/calendar'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'

import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {Contact} from '../../../../../api/contacts/contact.model'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {RadioButton} from 'primeng/radiobutton'

@Component({
  selector: 'dt-add-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    CardModule,
    RadioButton
  ],
  templateUrl: './add-transaction.component.html'
})
export class AddTransactionComponent implements OnInit {
  private contactService = inject(ContactService)
  private transactionService = inject(TransactionService)
  private readonly formBuilder = inject(FormBuilder)
  readonly transaction = input<Transaction>()

  contacts!: Signal<Contact[]>
  readonly TransactionType = TransactionType

  ngOnInit(): void {
    this.contacts = this.contactService.selectAll
    this.contactService.fetch()
  }

  readonly transactionForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.transaction()?.id,
    userID: [this.transaction()?.userID, Validators.required],
    description: this.transaction()?.description,
    amount: [this.transaction()?.amount, [Validators.required]],
    transactionType: [this.transaction()?.transactionType, Validators.required],
    transactionDate: [this.transaction()?.transactionDate, Validators.required]
  }))

  insertTransaction() {
    const newTransaction: Partial<Transaction> = {...this.transactionForm().getRawValue()}
    this.transactionService.post(newTransaction)
  }

  onCancel() {
    this.transactionForm().reset(this.transaction())
  }

  readonly contactOptions = computed(() =>
    this.contacts().map(c => ({
      label: c.fullName,
      value: c.id
    }))
  )
}
