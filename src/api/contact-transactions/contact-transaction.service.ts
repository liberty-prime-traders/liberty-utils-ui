import {HttpClient, HttpParams} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {FetchService} from '../base-api/fetch-service'
import {ProcessingStatus} from '../processing-status.enum'
import {Transaction} from '../transactions/transaction.model'
import {ContactTransactionStore} from './contact-transaction.store'

@Injectable({ providedIn: 'root'})
export class ContactTransactionService extends FetchService<Transaction> {
  private readonly contactTransactionsCache = new Map<string, Transaction[]>()

  constructor() {
    super(inject(ContactTransactionStore), inject(HttpClient))
  }

  override refetch(params?: { userId: string }): Subscription | undefined {
    const key = `${params?.userId}`

    if (this.contactTransactionsCache.has(key)) {
      this.refreshStore(key)
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
      this.refreshStore(userId)
    }
  }

  private refreshStore(userId: string): void {
    const cachedTransactions = this.contactTransactionsCache.get(userId)
    if (cachedTransactions) {
      this.store.setAll(cachedTransactions)
    }
  }

  public removeFromTransactionCache(id: string): void {
    this.contactTransactionsCache.forEach((cached, userId) => {
      const index = cached.findIndex(t => t.id === id)
      if (index !== -1) {
        cached.splice(index, 1)
        this.refreshStore(userId)
      }
    })
  }
}
