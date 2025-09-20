import {inject, Injectable, signal} from '@angular/core'
import {FetchService} from '../base-api/fetch-service'
import {Transaction} from '../transactions/transaction.model'
import {ContactTransactionStore} from './contact-transaction.store'
import {Subscription} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http'
import {ProcessingStatus} from '../processing-status.enum'

@Injectable({ providedIn: 'root'})
export class ContactTransactionService extends FetchService<Transaction> {
  private readonly contactTransactionsCache = new Map<string, Transaction[]>()
  private readonly $latestUserIdQueried = signal('')

  constructor() {
    super(inject(ContactTransactionStore), inject(HttpClient))
  }

  override refetch(params?: { userId: string }): Subscription | undefined {
    const key = `${params?.userId}`

    if (this.contactTransactionsCache.has(key)) {
      this.store.setAll(this.contactTransactionsCache.get(key)!)
      this.setProcessingStatus(ProcessingStatus.SUCCESS)
      return undefined
    }

    this.$latestUserIdQueried.set(key)
    return super.refetch(params)
  }

  override getHttpParams(params: { userId: string }): HttpParams {
    return new HttpParams().setNonNull('userId', params.userId)
  }

  override finishSavingWithSuccess(response: Transaction[]): void {
    this.contactTransactionsCache.set(this.$latestUserIdQueried(), response)
    super.finishSavingWithSuccess(response)
  }

  public upsertTransactionInCache(transaction: Transaction): void {
    this.contactTransactionsCache.forEach((cached) => {
      const index = cached.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        cached[index] = transaction
      }
    })
  }
}
