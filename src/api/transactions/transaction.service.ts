import {HttpParams} from '@angular/common/http'
import {inject, Injectable, signal} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../base-api/base.service'
import {ContactService} from '../contacts/contact.service'
import {Transaction} from './transaction.model'
import {TransactionStore} from './transaction.store'

@Injectable({providedIn: 'root'})
export class TransactionService extends BaseService<Transaction> {

  private readonly contactService = inject(ContactService)

  private readonly latestQuery = signal('')
  private readonly transactionsCache = new Map<string, Transaction[]>()

  constructor() {
    super(inject(TransactionStore))
  }

  override refetch(params?: {startDate: string, endDate: string}): Subscription | undefined {
    const key = `${params?.startDate}${params?.endDate}`
    if (this.transactionsCache.has(key)) {
      this.store.setAll(this.transactionsCache.get(key)!)
      return undefined
    }
    this.latestQuery.set(key)
    return super.refetch(params)
  }

  override getHttpParams(params: {startDate: string, endDate: string}): HttpParams {
    return new HttpParams()
      .setNonNull('startDate', params.startDate)
      .setNonNull('endDate', params.endDate)
  }

  override finishSavingWithSuccess(response: Transaction | Transaction[]): void {
    if (Array.isArray(response)) {
      this.transactionsCache.set(this.latestQuery(), response)
    } else {
      this.upsertTransactionInCache(response)
      this.patchContactBalance(response)
    }
    super.finishSavingWithSuccess(response)
  }

  override finishDeletingWithSuccess(id: string): void {
    this.transactionsCache.forEach((cached, _) => {
      const index = cached.findIndex(t => t.id === id)
      if (index !== -1) {
        cached.splice(index, 1)
      }
    })
    super.finishDeletingWithSuccess(id)
  }

  private upsertTransactionInCache(transaction: Transaction): void {
    this.transactionsCache.forEach((cached, _) => {
      const index = cached.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        cached[index] = transaction
      } else {
        cached.unshift(transaction)
      }
    })
  }

  private patchContactBalance(transaction: Transaction): void {
    this.contactService.patchBalance(transaction)
  }
}
