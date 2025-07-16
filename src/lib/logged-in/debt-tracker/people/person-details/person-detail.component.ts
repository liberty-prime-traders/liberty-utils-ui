import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {Contact} from '../../../../../api/contacts/contact.model'
import {CurrencyPipe, DatePipe, formatCurrency} from '@angular/common'
import {Card} from 'primeng/card'
import {PrimeTemplate} from 'primeng/api'
import {DropdownModule} from 'primeng/dropdown'
import {TableModule} from 'primeng/table'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'dbt-person-detail',
  templateUrl: './person-detail.component.html',
  standalone: true,
  imports: [
    Card,
    PrimeTemplate,
    DropdownModule,
    TableModule,
    DatePipe,
    CurrencyPipe,
    FormsModule
  ]
})
export class PersonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private contactService = inject(ContactService)
  private transactionService = inject(TransactionService)
  protected readonly TransactionType = TransactionType
  protected readonly formatCurrency = formatCurrency

  personId!: string
  person?: Contact
  transactions!: Signal<Transaction[]>

  sortOptions = [
    {label: 'Newest First', value: 'date_desc'},
    {label: 'Oldest First', value: 'date_asc'},
    {label: 'Amount High to Low', value: 'amount_desc'},
    {label: 'Amount Low to High', value: 'amount_asc'}
  ]

  selectedSortOrder = 'date_desc'


  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('id') ?? ''
    if (!this.personId) return

    this.person = this.contactService.selectAll().find(p => p.id === this.personId)

    this.transactions = computed(() =>
      this.transactionService.selectAll().filter(t => t.userID === this.personId)
    )
  }

  getInitials(fullName: string): string {
    if (!fullName) return ''
    const names = fullName.trim().split(' ')
    const initials = names.length === 1
      ? names[0].charAt(0)
      : names[0].charAt(0) + names[names.length - 1].charAt(0)
    return initials.toUpperCase()
  }

  getNetBalanceForPerson(id: string | number): number {
    return this.transactionService.selectAll()
      .filter(t => t.userID === id)
      .reduce((sum, t) => {
        const amount = t.amount ?? 0
        return t.transactionType === TransactionType.CREDIT
          ? sum + amount
          : sum - amount
      }, 0)
  }
  readonly sortedTransactions = computed(() => {
    const sort = this.selectedSortOrder

    const getTime = (t: Transaction) => {
      if (Array.isArray(t.transactionDate)) {
        const [year, month, day] = t.transactionDate
        return new Date(year, month - 1, day).getTime()
      }
      return new Date(t.transactionDate ?? 0).getTime()
    }

    return [...this.transactions()].sort((a, b) => {
      switch (sort) {
      case 'date_asc':
        return getTime(a) - getTime(b)
      case 'date_desc':
        return getTime(b) - getTime(a)
      case 'amount_asc':
        return (a.amount ?? 0) - (b.amount ?? 0)
      case 'amount_desc':
        return (b.amount ?? 0) - (a.amount ?? 0)
      default:
        return 0
      }
    })
  })
}
