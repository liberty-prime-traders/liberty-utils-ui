import { Injectable, inject } from '@angular/core'
import {TransactionService} from '../../../api/transactions/transaction.service'
import {TransactionType} from '../../../api/transactions/transaction-type.enum'

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private readonly transactionService = inject(TransactionService)
  private readonly now = new Date()
  private readonly year = this.now.getFullYear()
  private readonly month = this.now.getMonth()

  readonly today = new Date(this.year, this.month, this.now.getDate())
  startDate = new Date(this.year, this.month, 1)
  endDate = this.today

  constructor() {
    this.transactionService.refetch({
      startDate: this.startDate.toLocaleDateString('en-CA'),
      endDate: this.endDate.toLocaleDateString('en-CA')
    })
  }

  getBalance(contactId: string): number {
    const transactions = this.transactionService.selectAll().filter(
      t => t.userId === contactId
    )

    return transactions.reduce((sum, txn) => {
      if (txn.transactionType === TransactionType.CREDIT) return sum + (txn.amount ?? 0)
      if (txn.transactionType === TransactionType.DEBIT) return sum - (txn.amount ?? 0)
      return sum
    }, 0)
  }
}
