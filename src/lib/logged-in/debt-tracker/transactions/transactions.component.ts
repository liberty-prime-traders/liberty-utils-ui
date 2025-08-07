import {Component, computed, signal, inject, OnInit, model} from '@angular/core'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionType} from '../../../../api/transactions/transaction-type.enum'
import {CurrencyPipe, DatePipe} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {Card} from 'primeng/card'
import {PrimeTemplate} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {Button} from 'primeng/button'
import {Select} from 'primeng/select'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'
import {DeleteDialogComponent} from '../../../reusable/components/delete-dialog/delete-dialog.component'
import {Dialog} from 'primeng/dialog'
import {DebtTrackerQuickAddForm} from '../add-entry/debt-tracker-quick-add.form.enum'
import {AddTransactionComponent} from './transaction-form/transaction-form.component'

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
  ],
  standalone: true
})
export class TransactionsComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  private readonly contactService = inject(ContactService)
  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm

  readonly editTransaction = model(false)
  readonly deleteTransaction = model(false)

  readonly selectedTransactionId = signal<string>('')
  readonly searchTerm = signal('')
  readonly selectedPerson = signal<string | null>(null)
  readonly selectedType = signal<TransactionType | null>(null)
  readonly sortBy = signal<{ field: 'date' | 'amount', order: 'asc' | 'desc' }>({field: 'date', order: 'desc'})

  readonly transactions = this.transactionService.selectAll
  readonly contacts = this.contactService.selectAll
  readonly TransactionType = TransactionType

  readonly sortOptions = [
    { label: 'Newest First', value: { field: 'date', order: 'desc' } },
    { label: 'Oldest First', value: { field: 'date', order: 'asc' } },
    { label: 'Highest First', value: { field: 'amount', order: 'desc' } },
    { label: 'Lowest First', value: { field: 'amount', order: 'asc' } }
  ]

  readonly filterOptions = [
    {label: 'Credit (You owe them)', value: TransactionType.CREDIT},
    {label: 'Debt (They owe you)', value: TransactionType.DEBIT}
  ]

  readonly $computedTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const personId = this.selectedPerson()
    const type = this.selectedType()
    const sortField = this.sortBy()

    return [...this.transactions()]
      .filter(t => {
        const matchesSearch = t.description?.toLowerCase().includes(term)
          || t.contactName?.toLowerCase().includes(term)

        const matchesPerson = personId ? t.userId === personId : true
        const matchesType = type ? t.transactionType === type : true

        return matchesSearch && matchesPerson && matchesType
      })
      .sort((a, b) => {
        const {field, order} = sortField
        const aVal = field === 'date' ? new Date(a.transactionDate ?? 0).getTime() : a.amount ?? 0
        const bVal = field === 'date' ? new Date(b.transactionDate ?? 0).getTime() : b.amount ?? 0
        return order === 'asc' ? aVal - bVal : bVal - aVal
      })
  })

  readonly $transaction = computed(() => {
    if(this.selectedTransactionId().length > 0) {
      return this.transactionService.selectAll().filter(t => t.id === this.selectedTransactionId())[0]
    }
    return undefined
  })

  ngOnInit(): void {
    this.transactionService.fetch()
    this.contactService.fetch()
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
