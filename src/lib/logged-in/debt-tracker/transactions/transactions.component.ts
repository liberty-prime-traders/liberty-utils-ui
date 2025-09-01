import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Dialog} from 'primeng/dialog'
import {Fieldset} from 'primeng/fieldset'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionType} from '../../../../api/transactions/transaction-type.enum'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {LbuOktaService} from '../../../../config/lbu-okta.service'
import {DeleteDialogComponent} from '../../../reusable/components/delete-dialog/delete-dialog.component'
import {PrettifyEnumPipe} from '../../../reusable/pipes/prettify-enum.pipe'
import {TransactionSignPipe} from '../../../reusable/pipes/transaction-sign.pipe'
import {TransactionTypePipe} from '../../../reusable/pipes/transaction-type.pipe'
import {DebtTrackerQuickAddForm} from '../add-entry/debt-tracker-quick-add.form.enum'
import {AddTransactionComponent} from './transaction-form/transaction-form.component'
import {DatePicker} from 'primeng/datepicker'
import {FormMode} from '../form-mode.enum'

@Component({
  selector: 'dbt-transactions',
  templateUrl: './transactions.component.html',
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    Card,
    PrimeTemplate,
    TableModule,
    Button,
    Select,
    IconField,
    InputIcon,
    InputText,
    DeleteDialogComponent,
    Dialog,
    AddTransactionComponent,
    AsyncPipe,
    ToggleSwitch,
    PrettifyEnumPipe,
    TransactionSignPipe,
    TransactionTypePipe,
    Fieldset,
    DatePicker,
  ],
  standalone: true
})
export class TransactionsComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  private readonly contactService = inject(ContactService)
  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm
  readonly lbuOktaService = inject(LbuOktaService)

  readonly editTransaction = model(false)
  readonly deleteTransaction = model(false)

  readonly selectedTransactionId = signal<string>('')
  readonly searchTerm = signal('')
  readonly selectedPerson = signal<string | null>(null)
  readonly selectedType = signal<TransactionType | null>(null)

  readonly transactions = this.transactionService.selectAll
  readonly contacts = this.contactService.selectAll
  readonly transactionsLoading = this.transactionService.selectLoading

  protected readonly FormMode = FormMode
  private readonly now = new Date()
  private readonly year = this.now.getFullYear()
  private readonly month = this.now.getMonth()

  readonly today = new Date(this.year, this.month, this.now.getDate())
  startDate = new Date(this.year, this.month, 1)
  endDate = this.today

  readonly transactionTypeFilterOptions = [
    {label: 'Received Payments', value: TransactionType.CREDIT},
    {label: 'Debts Issued', value: TransactionType.DEBIT}
  ]

  readonly $filteredTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const personId = this.selectedPerson()
    const type = this.selectedType()

    return this.transactions().filter(t => {
      const matchesSearch = !term
        || t.description?.toLowerCase().includes(term)
        || t.contactName?.toLowerCase().includes(term)

      const matchesPerson = personId ? t.userId === personId : true
      const matchesType = type ? t.transactionType === type : true
      return matchesSearch && matchesPerson && matchesType
    })
  })

  readonly $transaction = computed(() => {
    if(this.selectedTransactionId().length > 0) {
      return this.transactionService.selectAll().filter(t => t.id === this.selectedTransactionId())[0]
    }
    return undefined
  })

  ngOnInit(): void {
    this.fetchTransactions()
    this.contactService.fetch()
  }

  fetchTransactions() {
    this.transactionService.refetch({
      startDate: this.startDate.toLocaleDateString('en-CA'),
      endDate: this.endDate.toLocaleDateString('en-CA')
    })
  }

  onEdit(id: string): void {
    this.selectedTransactionId.set(id)
    this.editTransaction.set(true)
  }

  onDelete(id: string): void {
    this.selectedTransactionId.set(id)
    this.deleteTransaction.set(true)
  }
}
