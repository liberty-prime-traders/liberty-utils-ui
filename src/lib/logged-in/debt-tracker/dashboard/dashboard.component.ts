import {Component, computed, inject, OnInit} from '@angular/core'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {TransactionType} from '../../../../api/transactions/transaction-type.enum'
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common'
import {Card} from 'primeng/card'
import {TableModule} from 'primeng/table'
import {RouterLink} from '@angular/router'
import {TransactionSignPipe} from '../../../reusable/pipes/transaction-sign.pipe'
import {Avatar} from 'primeng/avatar'
import {InitialsPipe} from '../../../reusable/pipes/initials.pipe'

@Component({
  selector: 'dt-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    DecimalPipe,
    Card,
    DatePipe,
    TableModule,
    RouterLink,
    TransactionSignPipe,
    CurrencyPipe,
    Avatar,
    InitialsPipe
  ],
  standalone: true
})

export class DashboardComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  private readonly transactions = this.transactionService.selectAll

  $totalCreditAmount = computed(() =>
    this.transactions().reduce((sum, t) =>
        t.transactionType === TransactionType.CREDIT ? sum + (t.amount ?? 0) : sum
      , 0)
  )

  $totalDebitAmount = computed(() =>
    this.transactions().reduce((sum, t) =>
        t.transactionType === TransactionType.DEBIT ? sum + (t.amount ?? 0) : sum
      , 0)
  )

  $uniqueCreditContactCount = computed(() => {
    const people = new Set<string>()
    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.CREDIT && t.contactName) {
        people.add(t.contactName)
      }
    }
    return people.size
  })

  $uniqueDebitContactCount = computed(() => {
    const people = new Set<string>()
    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.DEBIT && t.contactName) {
        people.add(t.contactName)
      }
    }
    return people.size
  })

  readonly $recentTransactions = computed(() => {
    return [...this.transactions()]
      .filter(t => Boolean(t.transactionDate))
      .sort((a, b) =>
        new Date(b.transactionDate!!).getTime() -
        new Date(a.transactionDate!!).getTime()
      )
      .slice(0, 5);
  })

  getTop(type : TransactionType) {
    const resultMap = new Map<string, { id: string, name: string, total: number, lastDate: number }>()

    for (const t of this.transactions()) {
      if (t.transactionType === type && t.contactName && t.userId) {
        const date = Array.isArray(t.transactionDate)
          ? new Date(t.transactionDate[0], t.transactionDate[1] - 1, t.transactionDate[2])
          : new Date(t.transactionDate!)

        const existing = resultMap.get(t.userId) ?? {id: t.userId, name: t.contactName, total: 0, lastDate: 0}
        existing.total += t.amount ?? 0
        existing.lastDate = Math.max(existing.lastDate, date.getTime())
        resultMap.set(t.userId, existing)
      }
    }

    return Array.from(resultMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        name: d.name,
        total: d.total,
        lastTransactionDate: new Date(d.lastDate).toLocaleDateString()
      }))
  }

  readonly $topDebtors = computed(() => {
    return this.getTop(TransactionType.DEBIT)
  })

  readonly $topCreditors = computed(() => {
    return this.getTop(TransactionType.CREDIT)
  })

  ngOnInit(): void {
    this.transactionService.fetch()
  }
}
