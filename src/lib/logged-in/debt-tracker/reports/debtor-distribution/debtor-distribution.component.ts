import {Component, OnInit, inject, computed, Signal} from '@angular/core'
import {ChartModule} from 'primeng/chart'
import {Card} from 'primeng/card'
import {DecimalPipe, NgForOf, NgIf} from '@angular/common'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'

@Component({
  selector: 'dt-debtor-distribution',
  templateUrl: './debtor-distribution.component.html',
  standalone: true,
  imports: [ChartModule, Card, NgForOf, NgIf, DecimalPipe]
})
export class DebtorDistributionComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  transactions!: Signal<any[]>

  readonly topDebtorsData = computed(() => {
    const debtMap = new Map<string, number>()

    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.DEBIT && t.contactName) {
        const current = debtMap.get(t.contactName) ?? 0
        debtMap.set(t.contactName, current + (t.amount ?? 0))
      }
    }

    const topDebtors = Array.from(debtMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      labels: topDebtors.map(([name]) => name),
      datasets: [
        {
          data: topDebtors.map(([_, total]) => total),
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
          hoverBackgroundColor: ['#DC2626', '#D97706', '#059669', '#2563EB', '#7C3AED']
        }
      ]
    }
  })

  readonly chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#d1d5db',
          font: {size: 14}
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  }

  readonly topDebtorsList = computed(() => {
    const debtMap = new Map<string, number>()

    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.DEBIT && t.contactName) {
        const current = debtMap.get(t.contactName) ?? 0
        debtMap.set(t.contactName, current + (t.amount ?? 0))
      }
    }

    return Array.from(debtMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total]) => ({name, total}))
  })


  ngOnInit(): void {
    this.transactions = this.transactionService.selectAll
  }
}
