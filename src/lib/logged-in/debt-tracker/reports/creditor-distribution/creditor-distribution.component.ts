import {Component, OnInit, inject, computed, Signal} from '@angular/core'
import {ChartModule} from 'primeng/chart'
import {Card} from 'primeng/card'
import {DecimalPipe, NgForOf, NgIf} from '@angular/common'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'

@Component({
  selector: 'dt-creditor-distribution',
  templateUrl: './creditor-distribution.component.html',
  standalone: true,
  imports: [ChartModule, Card, NgForOf, NgIf, DecimalPipe]
})
export class CreditorDistributionComponent implements OnInit {
  private readonly transactionService = inject(TransactionService)
  transactions!: Signal<any[]>

  readonly topCreditorsData = computed(() => {
    const creditMap = new Map<string, number>()

    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.CREDIT && t.contactName) {
        const current = creditMap.get(t.contactName) ?? 0
        creditMap.set(t.contactName, current + (t.amount ?? 0))
      }
    }

    const topCreditors = Array.from(creditMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      labels: topCreditors.map(([name]) => name),
      datasets: [
        {
          data: topCreditors.map(([_, total]) => total),
          backgroundColor: ['#8B5CF6', '#3B82F6', '#EF4444', '#10B981', '#F59E0B'],
          hoverBackgroundColor: ['#059669', '#2563EB', '#7C3AED', '#DC2626', '#D97706']
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

  readonly topCreditorsList = computed(() => {
    const creditMap = new Map<string, number>()

    for (const t of this.transactions()) {
      if (t.transactionType === TransactionType.CREDIT && t.contactName) {
        const current = creditMap.get(t.contactName) ?? 0
        creditMap.set(t.contactName, current + (t.amount ?? 0))
      }
    }

    return Array.from(creditMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total]) => ({name, total}))
  })


  ngOnInit(): void {
    this.transactions = this.transactionService.selectAll
  }
}
