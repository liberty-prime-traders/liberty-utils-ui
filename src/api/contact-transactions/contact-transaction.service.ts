import {inject, Injectable} from '@angular/core'
import {Transaction} from '../transactions/transaction.model'
import {ContactTransactionStore} from './contact-transaction.store'
import {Subscription} from 'rxjs'
import {HttpParams} from '@angular/common/http'
import {ProcessingStatus} from '../processing-status.enum'
import {BaseService} from '../base-api/base.service'

@Injectable({ providedIn: 'root'})
export class ContactTransactionService extends BaseService<Transaction> {
  private readonly contactTransactionsCache = new Map<string, Transaction[]>()

  constructor() {
    super(inject(ContactTransactionStore))
  }

  override refetch(params?: { userId: string }): Subscription | undefined {
    const key = `${params?.userId}`

    if (this.contactTransactionsCache.has(key)) {
      this.store.setAll(this.contactTransactionsCache.get(key)!)
      this.setProcessingStatus(ProcessingStatus.SUCCESS)
      return undefined
    }

    return super.refetch(params)
  }

  override getHttpParams(params: { userId: string }): HttpParams {
    return new HttpParams().setNonNull('userId', params.userId)
  }

  override finishSavingWithSuccess(response: Transaction[]): void {
    const userId = response[0].userId!
    this.contactTransactionsCache.set(userId, response)
    super.finishSavingWithSuccess(response)
  }

  public upsertTransactionInCache(transaction: Transaction): void {
    const userId = transaction.userId!
    if (this.contactTransactionsCache.has(userId)) {
      const cachedTransactions = this.contactTransactionsCache.get(userId)!
      const index = cachedTransactions.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        cachedTransactions[index] = transaction
      } else {
        cachedTransactions.unshift(transaction)
      }
      this.contactTransactionsCache.set(userId, cachedTransactions)
    }
  }

  override finishDeletingWithSuccess(id: string): void {
    this.contactTransactionsCache.forEach((cached, _) => {
      const index = cached.findIndex(t => t.id === id)
      if (index !== -1) {
        cached.splice(index, 1)
      }
    })
    super.finishDeletingWithSuccess(id)
  }
}
