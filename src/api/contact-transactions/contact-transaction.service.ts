import {inject, Injectable, signal} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Transaction} from '../transactions/transaction.model'
import {ContactTransactionStore} from './contact-transaction.store'
import {Subscription} from 'rxjs';
import {HttpParams} from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class ContactTransactionService extends BaseService<Transaction> {
  private readonly contactTransactionsCache = new Map<string, Transaction[]>()
  private readonly latestQuery = signal('')

  constructor() {
    super(inject(ContactTransactionStore))
  }

  override refetch(params?: {userId: string}): Subscription | undefined {
    const key = `${params?.userId}`
    if (this.contactTransactionsCache.has(key)) {
      this.store.setAll(this.contactTransactionsCache.get(key)!)
      return undefined
    }
    this.latestQuery.set(key)
    return super.refetch(params)
  }

  override getHttpParams(params: {userId: string}): HttpParams {
    return new HttpParams()
      .setNonNull('userId', params.userId)
  }

  override finishSavingWithSuccess(response: Transaction | Transaction[]): void {
    if (Array.isArray(response)) {
      this.contactTransactionsCache.set(this.latestQuery(), response)
    } else {
      this.upsertTransactionInCache(response)
    }
    super.finishSavingWithSuccess(response)
  }

  private upsertTransactionInCache(transaction: Transaction): void {
    this.contactTransactionsCache.forEach((cached, _) => {
      const index = cached.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        cached[index] = transaction
      } else {
        cached.unshift(transaction)
      }
    })
  }

}
