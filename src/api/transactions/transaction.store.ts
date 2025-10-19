import {computed, Injectable, Signal, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {Transaction, TransactionsByDate} from './transaction.model'

@Injectable({providedIn: 'root'})
export class TransactionStore extends createBaseStore<TransactionsByDate>() implements BaseStore<TransactionsByDate> {
  readonly basePath = 'transaction'

  getCachedDates(): Set<string> {
    return new Set(this.ids() as string[])
  }

  getForDateRangeAndUser = (startDate: Date, endDate: Date, userId?: string) => computed(() => {
    const result: Transaction[] = []
    for (let date = startDate; date <=  endDate; date.setDate(date.getDate() + 1)) {
      const transactions = this.selectForId(date.toLocaleDateString())()?.transactions ?? []
      transactions.forEach(transaction => {
        if (!userId || transaction.userId === userId) {
          result.push(transaction)
        }
      })
    }
    return result
  })
}
