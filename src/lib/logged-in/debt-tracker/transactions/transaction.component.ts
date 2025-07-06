import {Component, computed, signal, inject, OnInit} from '@angular/core'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionType} from '../../../../api/transactions/transaction-type.enum'
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {Card} from 'primeng/card'
import {PrimeTemplate} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {DropdownModule} from 'primeng/dropdown'
import {Button} from 'primeng/button'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'dt-transaction',
  templateUrl: './transaction.component.html',
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    Card,
    NgIf,
    PrimeTemplate,
    TableModule,
    DropdownModule,
    Button,
    GridFilterComponent
  ],
  standalone: true
})
export class TransactionComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  private readonly contactService = inject(ContactService)

  readonly searchTerm = signal('')
  readonly selectedPerson = signal<string | null>(null)
  readonly selectedType = signal<TransactionType | null>(null)
  readonly sortBy = signal<{ field: 'date' | 'amount', order: 'asc' | 'desc' }>({field: 'date', order: 'desc'})

  readonly transactions = this.transactionService.selectAll
  readonly contacts = this.contactService.selectAll

  readonly filteredTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const personId = this.selectedPerson()
    const type = this.selectedType()
    const sortField = this.sortBy()

    return [...this.transactions()]
      .filter(t => {
        const matchesSearch = t.description?.toLowerCase().includes(term)
          || t.contactName?.toLowerCase().includes(term)

        const matchesPerson = personId ? t.userID === personId : true
        const matchesType = type ? t.transactionType === type : true

        return matchesSearch && matchesPerson && matchesType
      })
      .sort((a, b) => {
        const {field, order} = sortField
        const aVal = field === 'date' ? a.transactionDate ?? 0 : a.amount ?? 0
        const bVal = field === 'date' ? b.transactionDate ?? 0 : b.amount ?? 0
        return order === 'asc' ? aVal - bVal : bVal - aVal
      })
  })

  readonly TransactionType = TransactionType

  ngOnInit(): void {
    this.transactionService.fetch()
    this.contactService.fetch()
  }
}
