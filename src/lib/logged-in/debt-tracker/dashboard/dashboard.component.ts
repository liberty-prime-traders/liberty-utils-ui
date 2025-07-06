import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {Transaction} from '../../../../api/transactions/transaction.model'
import {TransactionType} from '../../../../api/transactions/transaction-type.enum'
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common'
import {Card} from 'primeng/card'
import {TableModule} from 'primeng/table'

@Component({
  selector: 'dt-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    DecimalPipe,
    Card,
    NgForOf,
    CurrencyPipe,
    NgClass,
    DatePipe,
    TableModule,
    NgIf
  ],
  standalone: true
})

export class DashboardComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  readonly TransactionType = TransactionType
  protected readonly now = () => Date.now()

  transactions!: Signal<Transaction[]>

  totalCreditAmount = computed(() =>
    this.transactions().reduce((sum, t) =>
      t.transactionType === TransactionType.CREDIT ? sum + (t.amount ?? 0) : sum
    , 0)
  )

  totalDebitAmount = computed(() =>
    this.transactions().reduce((sum, t) =>
      t.transactionType === TransactionType.DEBIT ? sum + (t.amount ?? 0) : sum
    , 0)
  )

  uniqueCreditPeopleCount = computed(() => {
    const people = new Set<string>()
    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.CREDIT && t.contactName) {
        people.add(t.contactName)
      }
    }
    return people.size
  })

  uniqueDebitPeopleCount = computed(() => {
    const people = new Set<string>()
    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.DEBIT && t.contactName) {
        people.add(t.contactName)
      }
    }
    return people.size
  })

  readonly recentTransactions = computed(() => {
    return [...this.transactions()]
      .filter(t => Boolean(t.transactionDate))
      .sort((a, b) => (b.transactionDate ?? 0) - (a.transactionDate ?? 0))
      .slice(0, 5)
  })

  readonly topCreditors = computed(() => {
    const creditMap = new Map<string, { id: string, name: string, total: number, lastDate: number }>()

    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.CREDIT && t.contactName && t.userID) {
        const date = Array.isArray(t.transactionDate)
          ? new Date(t.transactionDate[0], t.transactionDate[1] - 1, t.transactionDate[2])
          : new Date(t.transactionDate!)

        const existing = creditMap.get(t.userID) ?? {id: t.userID, name: t.contactName, total: 0, lastDate: 0}
        existing.total += t.amount ?? 0
        existing.lastDate = Math.max(existing.lastDate, date.getTime())
        creditMap.set(t.userID, existing)
      }
    }

    return Array.from(creditMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        name: d.name,
        total: d.total,
        lastTransactionDate: new Date(d.lastDate).toLocaleDateString()
      }))
  })

  readonly topDebtors = computed(() => {
    const debitMap = new Map<string, { id: string, name: string, total: number, lastDate: number }>()

    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.DEBIT && t.contactName && t.userID) {
        const date = Array.isArray(t.transactionDate)
          ? new Date(t.transactionDate[0], t.transactionDate[1] - 1, t.transactionDate[2])
          : new Date(t.transactionDate!)

        const existing = debitMap.get(t.userID) ?? {id: t.userID, name: t.contactName, total: 0, lastDate: 0}
        existing.total += Math.abs(t.amount ?? 0)
        existing.lastDate = Math.max(existing.lastDate, date.getTime())
        debitMap.set(t.userID, existing)
      }
    }

    return Array.from(debitMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        name: d.name,
        total: d.total,
        lastTransactionDate: new Date(d.lastDate).toLocaleDateString()
      }))
  })

  ngOnInit(): void {
    this.transactions = this.transactionService.selectAll
    this.transactionService.fetch()

    setInterval(() => {
      this.transactionService.fetch()
    }, 1000)
  }
}
