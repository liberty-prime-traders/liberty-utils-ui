import { Injectable, inject } from '@angular/core'
import {TransactionService} from '../../../api/transactions/transaction.service'
import {TransactionType} from '../../../api/transactions/transaction-type.enum'

@Injectable({ providedIn: 'root' })
export class BalanceService {
  private readonly transactionService = inject(TransactionService)

  constructor() {
    this.transactionService.fetch()
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
