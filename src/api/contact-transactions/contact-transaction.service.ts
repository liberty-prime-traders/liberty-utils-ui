import {inject, Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Transaction} from '../transactions/transaction.model'
import {ContactTransactionStore} from './contact-transaction.store'
import {Subscription} from 'rxjs';
import {HttpParams} from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class ContactTransactionService extends BaseService<Transaction> {
  private readonly contactTransactionsCache = new Map<string, Transaction[]>()

  constructor() {
    super(inject(ContactTransactionStore))
  }

  override refetch(params?: {userId: string}): Subscription | undefined {
    const key = `${params?.userId}`
    if (this.contactTransactionsCache.has(key)) {
      this.store.setAll(this.contactTransactionsCache.get(key)!)
      return undefined
    }
    return super.refetch(params)
  }

  override getHttpParams(params: {userId: string}): HttpParams {
    return new HttpParams()
      .setNonNull('userId', params.userId)
  }

}
