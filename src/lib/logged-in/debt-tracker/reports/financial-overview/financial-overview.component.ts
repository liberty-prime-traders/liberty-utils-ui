import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'
import {ChartModule} from 'primeng/chart'
import {Card} from 'primeng/card'
import {CurrencyPipe} from '@angular/common'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {Contact} from '../../../../../api/contacts/contact.model'

@Component({
  selector: 'dt-financial-overview',
  templateUrl: './financial-overview.component.html',
  imports: [
    ChartModule,
    Card,
    CurrencyPipe
  ],
  standalone: true
})
export class FinancialOverviewComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  private readonly contactService = inject(ContactService)

  transactions!: Signal<Transaction[]>
  people!: Signal<Contact[]>

  readonly totalCredit = computed(() =>
    this.transactions().reduce(
      (sum, t) => t.transactionType === TransactionType.CREDIT ? sum + (t.amount ?? 0) : sum,
      0
    )
  )

  readonly totalDebt = computed(() =>
    this.transactions().reduce(
      (sum, t) => t.transactionType === TransactionType.DEBIT ? sum + (t.amount ?? 0) : sum,
      0
    )
  )

  readonly numberOfCreditors = computed(() => {
    const creditors = new Set<string>()
    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.CREDIT && t.contactName) {
        creditors.add(t.contactName)
      }
    }
    return creditors.size
  })

  readonly numberOfDebtors = computed(() => {
    const debtors = new Set<string>()
    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.DEBIT && t.contactName) {
        debtors.add(t.contactName)
      }
    }
    return debtors.size
  })

  chartData = computed(() => ({
    labels: ['Owed to you', 'You owe'],
    datasets: [
      {
        label: 'Amount ($)',
        backgroundColor: ['#4ade80', '#f87171'],
        data: [this.totalDebt(), this.totalCredit()]
      }
    ]
  }))

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label(tooltipItem: any) {
            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toFixed(0)}`
        }
      }
    }
  }

  ngOnInit(): void {
    this.transactions = this.transactionService.selectAll
    this.people = this.contactService.selectAll
    this.contactService.fetch()
    this.transactionService.fetch()
  }
}
